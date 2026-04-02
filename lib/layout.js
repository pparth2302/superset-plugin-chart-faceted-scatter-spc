"use strict";

exports.__esModule = true;
exports.chunkFacetValuesIntoBalancedRows = chunkFacetValuesIntoBalancedRows;
exports.getBalancedFacetLayout = getBalancedFacetLayout;
exports.sortFacetValues = sortFacetValues;
function normalizeComparable(value) {
  if (value === null || typeof value === 'undefined') {
    return {
      numeric: false,
      value: ''
    };
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return {
      numeric: true,
      value
    };
  }
  var numeric = Number(value);
  if (Number.isFinite(numeric) && String(value).trim() !== '') {
    return {
      numeric: true,
      value: numeric
    };
  }
  return {
    numeric: false,
    value: String(value)
  };
}
function sortFacetValues(values, sortOrder, customOrder) {
  if (sortOrder === void 0) {
    sortOrder = 'asc';
  }
  var deduped = Array.from(new Set(values));
  var sorted = [...deduped].sort((left, right) => {
    var leftComparable = normalizeComparable(left);
    var rightComparable = normalizeComparable(right);
    if (leftComparable.numeric && rightComparable.numeric) {
      return Number(leftComparable.value) - Number(rightComparable.value);
    }
    return String(leftComparable.value).localeCompare(String(rightComparable.value), undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  });
  if (sortOrder === 'desc') {
    sorted.reverse();
    return sorted;
  }
  if (sortOrder === 'custom' && customOrder) {
    var desiredOrder = customOrder.split(',').map(value => value.trim()).filter(Boolean);
    var orderMap = new Map(desiredOrder.map((value, index) => [value.toLowerCase(), index]));
    return sorted.sort((left, right) => {
      var leftKey = String(left).toLowerCase();
      var rightKey = String(right).toLowerCase();
      var leftIndex = orderMap.get(leftKey);
      var rightIndex = orderMap.get(rightKey);
      if (typeof leftIndex === 'number' && typeof rightIndex === 'number') {
        return leftIndex - rightIndex;
      }
      if (typeof leftIndex === 'number') {
        return -1;
      }
      if (typeof rightIndex === 'number') {
        return 1;
      }
      return 0;
    });
  }
  return sorted;
}
function chunkFacetValuesIntoBalancedRows(values, maxCols) {
  if (!values.length) {
    return [];
  }
  var safeMaxCols = Math.max(1, Math.floor(maxCols));
  var rows = Math.max(1, Math.ceil(values.length / safeMaxCols));
  var baseCount = Math.floor(values.length / rows);
  var remainder = values.length % rows;
  var chunks = [];
  var cursor = 0;
  for (var row = 0; row < rows; row += 1) {
    var rowCount = baseCount + (row < remainder ? 1 : 0);
    chunks.push(values.slice(cursor, cursor + rowCount));
    cursor += rowCount;
  }
  return chunks;
}
function getBalancedFacetLayout(count, maxCols) {
  if (count <= 0) {
    return {
      rows: 0,
      cols: 0,
      rowCounts: [],
      positions: []
    };
  }
  var safeMaxCols = Math.max(1, Math.floor(maxCols));
  var rowValues = Array.from({
    length: count
  }, (_, index) => index);
  var chunks = chunkFacetValuesIntoBalancedRows(rowValues, safeMaxCols);
  var rowCounts = chunks.map(chunk => chunk.length);
  var positions = [];
  chunks.forEach((chunk, row) => {
    chunk.forEach((value, col) => {
      positions.push({
        index: value,
        row,
        col,
        rowCount: chunk.length,
        isFirstInRow: col === 0,
        isLastInRow: col === chunk.length - 1
      });
    });
  });
  return {
    rows: chunks.length,
    cols: Math.max(...rowCounts),
    rowCounts,
    positions
  };
}