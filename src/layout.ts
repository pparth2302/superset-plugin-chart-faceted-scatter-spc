import { BalancedFacetLayout, FacetLayoutPosition, FacetSortOrder } from './types';

function normalizeComparable(value: unknown) {
  if (value === null || typeof value === 'undefined') {
    return { numeric: false, value: '' };
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return { numeric: true, value };
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric) && String(value).trim() !== '') {
    return { numeric: true, value: numeric };
  }

  return { numeric: false, value: String(value) };
}

export function sortFacetValues<T>(
  values: T[],
  sortOrder: FacetSortOrder = 'asc',
  customOrder?: string,
) {
  const deduped = Array.from(new Set(values));
  const sorted = [...deduped].sort((left, right) => {
    const leftComparable = normalizeComparable(left);
    const rightComparable = normalizeComparable(right);

    if (leftComparable.numeric && rightComparable.numeric) {
      return Number(leftComparable.value) - Number(rightComparable.value);
    }

    return String(leftComparable.value).localeCompare(String(rightComparable.value), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });

  if (sortOrder === 'desc') {
    sorted.reverse();
    return sorted;
  }

  if (sortOrder === 'custom' && customOrder) {
    const desiredOrder = customOrder
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    const orderMap = new Map(desiredOrder.map((value, index) => [value.toLowerCase(), index]));

    return sorted.sort((left, right) => {
      const leftKey = String(left).toLowerCase();
      const rightKey = String(right).toLowerCase();
      const leftIndex = orderMap.get(leftKey);
      const rightIndex = orderMap.get(rightKey);

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

export function chunkFacetValuesIntoBalancedRows<T>(values: T[], maxCols: number) {
  if (!values.length) {
    return [] as T[][];
  }

  const safeMaxCols = Math.max(1, Math.floor(maxCols));
  const rows = Math.max(1, Math.ceil(values.length / safeMaxCols));
  const baseCount = Math.floor(values.length / rows);
  const remainder = values.length % rows;
  const chunks: T[][] = [];
  let cursor = 0;

  for (let row = 0; row < rows; row += 1) {
    const rowCount = baseCount + (row < remainder ? 1 : 0);
    chunks.push(values.slice(cursor, cursor + rowCount));
    cursor += rowCount;
  }

  return chunks;
}

export function getBalancedFacetLayout(
  count: number,
  maxCols: number,
): BalancedFacetLayout {
  if (count <= 0) {
    return {
      rows: 0,
      cols: 0,
      rowCounts: [],
      positions: [],
    };
  }

  const rowValues = Array.from({ length: count }, (_, index) => index);
  const chunks = chunkFacetValuesIntoBalancedRows(rowValues, maxCols);
  const rowCounts = chunks.map(chunk => chunk.length);
  const positions: FacetLayoutPosition[] = [];

  chunks.forEach((chunk, row) => {
    chunk.forEach((value, col) => {
      positions.push({
        index: value,
        row,
        col,
      });
    });
  });

  return {
    rows: chunks.length,
    cols: Math.max(...rowCounts),
    rowCounts,
    positions,
  };
}