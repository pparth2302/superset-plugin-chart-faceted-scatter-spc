import {
  ChartProps,
  ensureIsArray,
  getMetricLabel,
  TimeseriesDataRecord,
} from '@superset-ui/core';
import { getBalancedFacetLayout, sortFacetValues } from '../layout';
import {
  ColumnLike,
  FacetPanelData,
  FacetPoint,
  SupersetPluginChartFacetedScatterSpcProps,
  SupersetPluginChartFacetedScatterSpcQueryFormData,
} from '../types';

function getColumnKey(column: ColumnLike | undefined): string {
  if (!column) {
    return '';
  }

  if (typeof column === 'string') {
    return column;
  }

  return String(column.label || column.column_name || column.sqlExpression || '');
}

function parseOptionalNumber(value: unknown) {
  if (value === null || typeof value === 'undefined' || value === '') {
    return null;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function detectXAxisType(values: unknown[]): 'time' | 'value' | 'category' {
  const firstValue = values.find(value => value !== null && typeof value !== 'undefined' && value !== '');

  if (typeof firstValue === 'number') {
    return 'value';
  }

  if (firstValue instanceof Date) {
    return 'time';
  }

  if (typeof firstValue === 'string' && !Number.isNaN(Date.parse(firstValue))) {
    return 'time';
  }

  return 'category';
}

function buildTooltipValues(
  row: TimeseriesDataRecord,
  xAxisLabel: string,
  yAxisLabel: string,
  facetLabel: string,
  facetValue: unknown,
  colorLabel: string,
  colorValue: unknown,
  tooltipColumns: string[],
) {
  const values = [
    { label: xAxisLabel, value: row[xAxisLabel] },
    { label: facetLabel, value: facetValue },
    { label: yAxisLabel, value: row[yAxisLabel] },
  ];

  if (colorLabel && colorValue != null) {
    values.push({ label: colorLabel, value: colorValue });
  }

  tooltipColumns.forEach(column => {
    if (![xAxisLabel, yAxisLabel, facetLabel, colorLabel].includes(column)) {
      values.push({ label: column, value: row[column] });
    }
  });

  return values;
}

function computeYDomain(
  points: FacetPoint[],
  lowerSpecLimit: number | null,
  upperSpecLimit: number | null,
  overrideMin: number | null,
  overrideMax: number | null,
): [number, number] {
  const values = points.map(point => point.y).filter(value => Number.isFinite(value));
  if (lowerSpecLimit !== null) {
    values.push(lowerSpecLimit);
  }
  if (upperSpecLimit !== null) {
    values.push(upperSpecLimit);
  }

  let min = overrideMin;
  let max = overrideMax;

  if (min === null) {
    min = values.length ? Math.min(...values) : 0;
  }

  if (max === null) {
    max = values.length ? Math.max(...values) : 1;
  }

  if (min === max) {
    const padding = min === 0 ? 1 : Math.abs(min) * 0.05;
    min -= padding;
    max += padding;
  } else if (overrideMin === null || overrideMax === null) {
    const padding = (max - min) * 0.05;
    if (overrideMin === null) {
      min -= padding;
    }
    if (overrideMax === null) {
      max += padding;
    }
  }

  return [min, max];
}

export default function transformProps(
  chartProps: ChartProps,
): SupersetPluginChartFacetedScatterSpcProps {
  const { width, height, queriesData, formData } = chartProps;
  const fd = formData as SupersetPluginChartFacetedScatterSpcQueryFormData;
  const rows = (queriesData[0]?.data || []) as TimeseriesDataRecord[];
  const xAxisLabel = getColumnKey(fd.x_axis);
  const facetColumnLabel = getColumnKey(fd.facet_column);
  const colorColumnLabel = getColumnKey(fd.color_column);
  const tooltipColumns = ensureIsArray(fd.tooltip_columns)
    .map(column => getColumnKey(column as ColumnLike))
    .filter(Boolean);
  const metricLabels = ensureIsArray(fd.metrics)
    .filter(Boolean)
    .map(metric => getMetricLabel(metric as any));
  const yAxisLabel = metricLabels[0] || getColumnKey(fd.y_axis_column);
  const lowerSpecLimit = parseOptionalNumber(fd.lower_spec_limit);
  const upperSpecLimit = parseOptionalNumber(fd.upper_spec_limit);
  const yAxisMin = parseOptionalNumber(fd.y_axis_min);
  const yAxisMax = parseOptionalNumber(fd.y_axis_max);
  const maxFacets = Math.max(1, Number(fd.max_facets || 28));
  const maxPanelsPerRow = Math.max(1, Number(fd.max_panels_per_row || 7));
  const pointSize = Math.max(1, Number(fd.marker_size || 8));
  const markerOpacity = Math.min(1, Math.max(0.05, Number(fd.marker_opacity || 0.85)));

  const facetValues = sortFacetValues(
    rows
      .map(row => row[facetColumnLabel])
      .filter(value => value !== null && typeof value !== 'undefined'),
    fd.facet_sort_order || 'asc',
    fd.facet_sort_custom,
  ).slice(0, maxFacets);

  const allowedFacetValues = new Set(facetValues.map(value => String(value)));
  const panelsByFacet = new Map<string, FacetPanelData>();
  const points: FacetPoint[] = [];

  rows.forEach(row => {
    const facetValue = row[facetColumnLabel];
    if (facetValue === null || typeof facetValue === 'undefined') {
      return;
    }

    const facetKey = String(facetValue);
    if (!allowedFacetValues.has(facetKey)) {
      return;
    }

    const yValue = Number(row[yAxisLabel]);
    const xValue = row[xAxisLabel];

    if (!Number.isFinite(yValue) || xValue === null || typeof xValue === 'undefined') {
      return;
    }

    if (!panelsByFacet.has(facetKey)) {
      panelsByFacet.set(facetKey, {
        key: facetKey,
        title: facetKey,
        facetValue,
        points: [],
      });
    }

    const colorValue = colorColumnLabel ? row[colorColumnLabel] : undefined;
    const point: FacetPoint = {
      x: xValue,
      y: yValue,
      facetValue,
      colorValue: colorValue == null ? undefined : String(colorValue),
      tooltipValues: buildTooltipValues(
        row,
        xAxisLabel,
        yAxisLabel,
        facetColumnLabel,
        facetValue,
        colorColumnLabel,
        colorValue,
        tooltipColumns,
      ),
      row,
    };

    panelsByFacet.get(facetKey)?.points.push(point);
    points.push(point);
  });

  const panels = facetValues
    .map(value => panelsByFacet.get(String(value)))
    .filter((panel): panel is FacetPanelData => Boolean(panel));
  const xAxisType = detectXAxisType(points.map(point => point.x));
  const legendValues = colorColumnLabel
    ? sortFacetValues(
        Array.from(
          new Set(
            points
              .map(point => point.colorValue)
              .filter((value): value is string => Boolean(value)),
          ),
        ),
      )
    : [];

  return {
    width,
    height,
    chartTitle: fd.chart_title || 'Nest or Pallet #',
    xAxisLabel,
    yAxisLabel,
    facetColumnLabel,
    colorColumnLabel: colorColumnLabel || undefined,
    panels,
    layout: getBalancedFacetLayout(panels.length, maxPanelsPerRow),
    legendValues,
    colorScheme: fd.color_scheme || 'supersetColors',
    markerSize: pointSize,
    markerOpacity,
    showLegend: fd.show_legend ?? true,
    timeFormat: fd.time_format || 'smart_date',
    yDomain: computeYDomain(points, lowerSpecLimit, upperSpecLimit, yAxisMin, yAxisMax),
    upperSpecLimit,
    lowerSpecLimit,
    panelGap: Math.max(0, Number(fd.panel_gap || 16)),
    xAxisType,
  };
}