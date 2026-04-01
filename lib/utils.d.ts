import type { ColumnLike } from './types';
export declare function getColumnLabel(column: unknown): string | undefined;
export declare function uniqueColumnLikes(columns: Array<ColumnLike | undefined | null>): ColumnLike[];
export declare function parseOptionalNumber(value: unknown, fallback?: number | null): number | null;
export declare function parsePositiveInteger(value: unknown, fallback: number, { min, max }?: {
    min?: number;
    max?: number;
}): number;
export declare function getMetricLabelOrUndefined(metric: unknown): string | undefined;
export declare function stringifyFacetValue(value: unknown): string;
//# sourceMappingURL=utils.d.ts.map