import { BalancedFacetLayout, FacetSortOrder } from './types';
export declare function sortFacetValues<T>(values: T[], sortOrder?: FacetSortOrder, customOrder?: string): T[];
export declare function chunkFacetValuesIntoBalancedRows<T>(values: T[], maxCols: number): T[][];
export declare function getBalancedFacetLayout(count: number, maxCols: number): BalancedFacetLayout;
//# sourceMappingURL=layout.d.ts.map