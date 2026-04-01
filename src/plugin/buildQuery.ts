import {
  buildQueryContext,
  ensureIsArray,
} from '@superset-ui/core';
import type {
  QueryFormData,
  QueryFormColumn,
  QueryFormMetric,
  QueryFormOrderBy,
  QueryObject,
} from '@superset-ui/core';
import type { SupersetPluginChartFacetedScatterSpcQueryFormData } from '../types';
import {
  getColumnLabel,
  getMetricLabelOrUndefined,
  parsePositiveInteger,
  uniqueColumnLikes,
} from '../utils';

export default function buildQuery(formData: QueryFormData) {
  const fd = formData as SupersetPluginChartFacetedScatterSpcQueryFormData;
  const xAxis = fd.x_axis;
  const facetColumn = fd.facet_column;
  const colorColumn = fd.color_column;
  const yAxisColumn = fd.y_axis_column;
  const tooltipColumns = ensureIsArray(fd.tooltip_columns).filter(Boolean);
  const metrics = ensureIsArray(fd.metrics).filter(Boolean) as QueryFormMetric[];
  const rowLimit = parsePositiveInteger(fd.row_limit, 10000);
  const columns = uniqueColumnLikes([
    xAxis,
    facetColumn,
    colorColumn,
    ...(metrics.length ? tooltipColumns : [yAxisColumn, ...tooltipColumns]),
  ]) as QueryFormColumn[];

  const xAxisLabel = getColumnLabel(xAxis);
  const facetLabel = getColumnLabel(facetColumn);
  const orderby = [xAxisLabel, facetLabel]
    .filter(Boolean)
    .map(label => [label as string, true] as QueryFormOrderBy);
  const metricLabel = metrics[0] ? getMetricLabelOrUndefined(metrics[0]) : undefined;

  return buildQueryContext(formData, (baseQueryObject: QueryObject) => [
    {
      ...baseQueryObject,
      columns,
      metrics,
      orderby:
        metrics.length && metricLabel
          ? ([[metricLabel, false], ...orderby] as QueryFormOrderBy[])
          : orderby,
      row_limit: rowLimit,
      series_columns: [],
      is_timeseries: false,
    },
  ]);
}
