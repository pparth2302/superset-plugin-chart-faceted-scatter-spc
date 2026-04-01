function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { buildQueryContext, ensureIsArray } from '@superset-ui/core';
import { getColumnLabel, getMetricLabelOrUndefined, parsePositiveInteger, uniqueColumnLikes } from '../utils';
export default function buildQuery(formData) {
  var fd = formData;
  var xAxis = fd.x_axis;
  var facetColumn = fd.facet_column;
  var colorColumn = fd.color_column;
  var yAxisColumn = fd.y_axis_column;
  var tooltipColumns = ensureIsArray(fd.tooltip_columns).filter(Boolean);
  var metrics = ensureIsArray(fd.metrics).filter(Boolean);
  var rowLimit = parsePositiveInteger(fd.row_limit, 10000);
  var columns = uniqueColumnLikes([xAxis, facetColumn, colorColumn, ...(metrics.length ? tooltipColumns : [yAxisColumn, ...tooltipColumns])]);
  var xAxisLabel = getColumnLabel(xAxis);
  var facetLabel = getColumnLabel(facetColumn);
  var orderby = [xAxisLabel, facetLabel].filter(Boolean).map(label => [label, true]);
  var metricLabel = metrics[0] ? getMetricLabelOrUndefined(metrics[0]) : undefined;
  return buildQueryContext(formData, baseQueryObject => [_extends({}, baseQueryObject, {
    columns,
    metrics,
    orderby: metrics.length && metricLabel ? [[metricLabel, false], ...orderby] : orderby,
    row_limit: rowLimit,
    series_columns: [],
    is_timeseries: false
  })]);
}