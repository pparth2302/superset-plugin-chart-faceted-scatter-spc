import { getMetricLabel } from '@superset-ui/core';
import type { ColumnLike } from './types';

export function getColumnLabel(column: unknown): string | undefined {
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

export function uniqueColumnLikes(columns: Array<ColumnLike | undefined | null>) {
  const seen = new Set<string>();
  const unique: ColumnLike[] = [];

  columns.forEach(column => {
    if (!column) {
      return;
    }

    const label = getColumnLabel(column);
    if (!label || seen.has(label)) {
      return;
    }

    seen.add(label);
    unique.push(column);
  });

  return unique;
}

export function parseOptionalNumber(value: unknown, fallback: number | null = null) {
  if (value === '' || value === null || typeof value === 'undefined') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parsePositiveInteger(
  value: unknown,
  fallback: number,
  { min = 1, max }: { min?: number; max?: number } = {},
) {
  const parsed = Number(value);
  const normalized = Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
  const clampedMin = Math.max(min, normalized);
  return typeof max === 'number' ? Math.min(clampedMin, max) : clampedMin;
}

export function getMetricLabelOrUndefined(metric: unknown) {
  const label = getMetricLabel(metric as never);
  return label || undefined;
}

export function stringifyFacetValue(value: unknown) {
  if (value === null || typeof value === 'undefined' || value === '') {
    return 'Unknown';
  }

  return String(value);
}
