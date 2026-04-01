import {
  ChartProps,
  ensureIsArray,
  getMetricLabel,
} from '@superset-ui/core';
import type { QueryFormData, TimeseriesDataRecord } from '@superset-ui/core';
import { getBalancedFacetLayout, sortFacetValues } from '../layout';
import type {
  FacetPoint,
  FacetPanelData,
  SupersetPluginChartFacetedScatterSpcProps,
  SupersetPluginChartFacetedScatterSpcQueryFormData,
  XAxisType,
} from '../types';
import {
  getColumnLabel,
  parseOptionalNumber,
  parsePositiveInteger,
  stringifyFacetValue,
} from '../utils';

function inferXAxisType(
  xAxisLabel: string,
  formData: SupersetPluginChartFacetedScatterSpcQueryFormData,
  data: TimeseriesDataRecord[],
): XAxisType {
  if (formData.temporal_columns_lookup?.[xAxisLabel]) {
    return 'time';
  }

  const sampleValues = data
    .map(row => row[xAxisLabel])
    .filter(value => value !== null && typeof value !== 'undefined')
    .slice(0, 20);

  if (
    sampleValues.length &&
    sampleValues.every(value => {
      if (value instanceof Date) {
        return true;
      }

      if (typeof value === 'number') {
        return value > 100000000000;
      }

      return !Number.isNaN(Date.parse(String(value)));
    })
  ) {
    return 'time';
  }

  if (
    sampleValues.length &&
    sampleValues.every(value => {
      const numeric = Number(value);
      return Number.isFinite(numeric);
    })
  ) {
    return 'value';
  }

  return 'category';
}

function computeYDomain(
  values: number[],
  {
    userMin,
    userMax,
    lowerSpecLimit,
    upperSpecLimit,
  }: {
    userMin: number | null;
    userMax: number | null;
    lowerSpecLimit: number | null;
    upperSpecLimit: number | null;
  },
): [number, number] {
  const observed = [...values];
  if (lowerSpecLimit !== null) {
    observed.push(lowerSpecLimit);
  }
  if (upperSpecLimit !== null) {
    observed.push(upperSpecLimit);
  }

  const fallbackMin = observed.length ? Math.min(...observed) : 0;
  const fallbackMax = observed.length ? Math.max(...observed) : 1;
  let min = userMin ?? fallbackMin;
  let max = userMax ?? fallbackMax;

  if (min > max) {
    [min, max] = [max, min];
  }

  if (userMin === null || userMax === null) {
    const span = max - min;
    const padding = span === 0 ? Math.max(Math.abs(max) * 0.05, 1) : span * 0.05;
    if (userMin === null) {
      min -= padding;
    }
    if (userMax === null) {
      max += padding;
    }
  }

  if (min === max) {
    const padding = Math.max(Math.abs(max) * 0.05, 1);
    min -= padding;
    max += padding;
  }

  return [min, max];
}

function buildLegendValues(panels: FacetPanelData[]) {
  return Array.from(
    new Set(
      panels.flatMap(panel =>
        panel.points
          .map(point => point.colorValue)
          .filter((value): value is string => Boolean(value)),
      ),
    ),
  );
}

export default function transformProps(
  chartProps: ChartProps,
): SupersetPluginChartFacetedScatterSpcProps {
  const { width, height, queriesData, formData } = chartProps;
  const rawFormData =
    ((chartProps as unknown as { rawFormData?: QueryFormData }).rawFormData as
      | SupersetPluginChartFacetedScatterSpcQueryFormData
      | undefined) || (formData as SupersetPluginChartFacetedScatterSpcQueryFormData);
  const data = (queriesData[0]?.data || []) as TimeseriesDataRecord[];
  const metricLabels = ensureIsArray(rawFormData.metrics)
    .filter(Boolean)
    .map(metric => getMetricLabel(metric as never))
    .filter(Boolean);
  const xAxisLabel = getColumnLabel(rawFormData.x_axis) ?? 'timestamp';
  const yAxisLabel =
    metricLabels[0] ?? getColumnLabel(rawFormData.y_axis_column) ?? 'value';
  const facetColumnLabel = getColumnLabel(rawFormData.facet_column) ?? 'facet_value';
  const colorColumnLabel = getColumnLabel(rawFormData.color_column);
  const tooltipColumnLabels = ensureIsArray(rawFormData.tooltip_columns)
    .map(column => getColumnLabel(column))
    .filter((value): value is string => Boolean(value));
  const maxFacets = parsePositiveInteger(rawFormData.max_facets, 28);
  const maxPanelsPerRow = parsePositiveInteger(rawFormData.max_panels_per_row, 7, {
    max: 7,
  });
  const markerSize = parsePositiveInteger(rawFormData.marker_size, 8);
  const markerOpacity = Math.max(
    0.1,
    Math.min(1, parseOptionalNumber(rawFormData.marker_opacity, 0.8) ?? 0.8),
  );
  const lowerSpecLimit = parseOptionalNumber(rawFormData.lower_spec_limit);
  const upperSpecLimit = parseOptionalNumber(rawFormData.upper_spec_limit);
  const yAxisMin = parseOptionalNumber(rawFormData.y_axis_min);
  const yAxisMax = parseOptionalNumber(rawFormData.y_axis_max);
  const xAxisType = inferXAxisType(xAxisLabel, rawFormData, data);
  const sortedFacetValues = sortFacetValues(
    data.map(row => row[facetColumnLabel]),
    rawFormData.facet_sort_order ?? 'asc',
    rawFormData.facet_sort_custom,
  ).slice(0, maxFacets);

  const panels = sortedFacetValues
    .map(facetValue => {
      const points = data.reduce<FacetPoint[]>((accumulator, row) => {
        if (String(row[facetColumnLabel]) !== String(facetValue)) {
          return accumulator;
        }

          const yValue = Number(row[yAxisLabel]);
          if (!Number.isFinite(yValue)) {
            return accumulator;
          }

          accumulator.push({
            x: row[xAxisLabel],
            y: yValue,
            facetValue,
            colorValue:
              colorColumnLabel && row[colorColumnLabel] != null
                ? String(row[colorColumnLabel])
                : undefined,
            tooltipValues: [
              { label: xAxisLabel, value: row[xAxisLabel] },
              { label: facetColumnLabel, value: facetValue },
              { label: yAxisLabel, value: row[yAxisLabel] },
              ...(colorColumnLabel && row[colorColumnLabel] != null
                ? [{ label: colorColumnLabel, value: row[colorColumnLabel] }]
                : []),
              ...tooltipColumnLabels
                .filter(
                  label =>
                    ![xAxisLabel, facetColumnLabel, yAxisLabel, colorColumnLabel].includes(
                      label,
                    ),
                )
                .map(label => ({
                  label,
                  value: row[label],
                })),
            ],
            row,
          });

        return accumulator;
      }, []);

      return {
        key: stringifyFacetValue(facetValue),
        title: stringifyFacetValue(facetValue),
        facetValue,
        points,
      };
    })
    .filter(panel => panel.points.length);
  const yValues = panels.flatMap(panel => panel.points.map(point => point.y));

  return {
    width,
    height,
    chartTitle: rawFormData.chart_title ?? '',
    xAxisLabel,
    yAxisLabel,
    facetColumnLabel,
    colorColumnLabel,
    tooltipColumnLabels,
    panels,
    layout: getBalancedFacetLayout(panels.length, maxPanelsPerRow),
    legendValues: buildLegendValues(panels),
    colorScheme: rawFormData.color_scheme ?? 'supersetColors',
    markerSize,
    markerOpacity,
    showLegend: rawFormData.show_legend ?? true,
    timeFormat: rawFormData.time_format ?? 'smart_date',
    yDomain: computeYDomain(yValues, {
      userMin: yAxisMin,
      userMax: yAxisMax,
      lowerSpecLimit,
      upperSpecLimit,
    }),
    upperSpecLimit,
    lowerSpecLimit,
    panelGap: parsePositiveInteger(rawFormData.panel_gap, 12),
    xAxisType,
  };
}
