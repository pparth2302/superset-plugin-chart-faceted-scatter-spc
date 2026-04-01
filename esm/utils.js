import { getMetricLabel } from '@superset-ui/core';
export function getColumnLabel(column) {
  if (!column) {
    return undefined;
  }
  if (typeof column === 'string') {
    return column;
  }
  if (typeof column === 'object') {
    var candidate = column;
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
export function uniqueColumnLikes(columns) {
  var seen = new Set();
  var unique = [];
  columns.forEach(column => {
    if (!column) {
      return;
    }
    var label = getColumnLabel(column);
    if (!label || seen.has(label)) {
      return;
    }
    seen.add(label);
    unique.push(column);
  });
  return unique;
}
export function parseOptionalNumber(value, fallback) {
  if (fallback === void 0) {
    fallback = null;
  }
  if (value === '' || value === null || typeof value === 'undefined') {
    return fallback;
  }
  var parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
export function parsePositiveInteger(value, fallback, _temp) {
  var {
    min = 1,
    max
  } = _temp === void 0 ? {} : _temp;
  var parsed = Number(value);
  var normalized = Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
  var clampedMin = Math.max(min, normalized);
  return typeof max === 'number' ? Math.min(clampedMin, max) : clampedMin;
}
export function getMetricLabelOrUndefined(metric) {
  var label = getMetricLabel(metric);
  return label || undefined;
}
export function stringifyFacetValue(value) {
  if (value === null || typeof value === 'undefined' || value === '') {
    return 'Unknown';
  }
  return String(value);
}