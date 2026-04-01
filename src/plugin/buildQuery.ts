import {
  buildQueryContext,
  ensureIsArray,
  getMetricLabel,
  QueryFormData,
  QueryFormMetric,
  QueryFormOrderBy,
  QueryObject,
} from '@superset-ui/core';
import { SupersetPluginChartFacetedScatterSpcQueryFormData } from '../types';

function getColumnKey(column: unknown): string | undefined {
  if (!column) {
    return undefined;
  }

  if (typeof column === 'string') {
    return column;
  }

  if (typeof column === 'object') {
    const candidate = column as {
      label?: unknown;
      column_name?: unknown;
      sqlExpression?: unknown;
    };

    if (typeof candidate.label === 'string' && candidate.label) {
      return candidate.label;
    }

    if (typeof candidate.column_name === 'string' && candidate.column_name) {
      return candidate.column_name;
    }

    if (typeof candidate.sqlExpression === 'string' && candidate.sqlExpression) {
      return candidate.sqlExpression;
    }
  }

  return String(column);
}

function pushUnique(target: unknown[], candidate: unknown) {
  if (!candidate) {
    return;
  }

  const candidateKey = getColumnKey(candidate);
  const exists = target.some(value => getColumnKey(value) === candidateKey);

  if (!exists) {
    target.push(candidate);
  }
}

export default function buildQuery(formData: QueryFormData) {
  const fd = formData as SupersetPluginChartFacetedScatterSpcQueryFormData;
  const metrics = ensureIsArray(fd.metrics).filter(Boolean) as QueryFormMetric[];
  const xAxis = fd.x_axis;
  const facetColumn = fd.facet_column;
  const colorColumn = fd.color_column;
  const tooltipColumns = ensureIsArray(fd.tooltip_columns).filter(Boolean);
  const yAxisColumn = fd.y_axis_column;
  const columns: unknown[] = [];

  pushUnique(columns, xAxis);
  pushUnique(columns, facetColumn);
  pushUnique(columns, colorColumn);
  tooltipColumns.forEach(column => pushUnique(columns, column));

  if (!metrics.length) {
    pushUnique(columns, yAxisColumn);
  }

  const xAxisLabel = getColumnKey(xAxis);
  const facetLabel = getColumnKey(facetColumn);
  const orderby = [
    facetLabel ? [facetLabel, true] : null,
    xAxisLabel ? [xAxisLabel, true] : null,
    !xAxisLabel && metrics[0] ? [getMetricLabel(metrics[0] as any), false] : null,
  ].filter(Boolean) as QueryFormOrderBy[];

  return buildQueryContext(formData, (baseQueryObject: QueryObject) => [
    {
      ...baseQueryObject,
      columns,
      metrics,
      orderby,
      row_limit: Number(fd.row_limit || 10000),
      series_columns: [],
      is_timeseries: false,
      post_processing: [],
    },
  ]);
}