"use strict";

exports.__esModule = true;
exports.default = buildQuery;
var _core = require("@superset-ui/core");
var _utils = require("../utils");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function buildQuery(formData) {
  var fd = formData;
  var xAxis = fd.x_axis;
  var facetColumn = fd.facet_column;
  var colorColumn = fd.color_column;
  var yAxisColumn = fd.y_axis_column;
  var tooltipColumns = (0, _core.ensureIsArray)(fd.tooltip_columns).filter(Boolean);
  var metrics = (0, _core.ensureIsArray)(fd.metrics).filter(Boolean);
  var rowLimit = (0, _utils.parsePositiveInteger)(fd.row_limit, 10000);
  var columns = (0, _utils.uniqueColumnLikes)([xAxis, facetColumn, colorColumn, ...(metrics.length ? tooltipColumns : [yAxisColumn, ...tooltipColumns])]);
  var xAxisLabel = (0, _utils.getColumnLabel)(xAxis);
  var facetLabel = (0, _utils.getColumnLabel)(facetColumn);
  var orderby = [xAxisLabel, facetLabel].filter(Boolean).map(label => [label, true]);
  var metricLabel = metrics[0] ? (0, _utils.getMetricLabelOrUndefined)(metrics[0]) : undefined;
  return (0, _core.buildQueryContext)(formData, baseQueryObject => [_extends({}, baseQueryObject, {
    columns,
    metrics,
    orderby: metrics.length && metricLabel ? [[metricLabel, false], ...orderby] : orderby,
    row_limit: rowLimit,
    series_columns: [],
    is_timeseries: false
  })]);
}