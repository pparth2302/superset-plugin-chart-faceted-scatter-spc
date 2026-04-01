import type { QueryFormData, QueryFormMetric, TimeseriesDataRecord } from '@superset-ui/core';
export type ColumnLike = string | {
    label?: string;
    column_name?: string;
    sqlExpression?: string;
    expressionType?: string;
};
export type FacetSortOrder = 'asc' | 'desc' | 'custom';
export type XAxisType = 'time' | 'value' | 'category';
export interface TooltipEntry {
    label: string;
    value: unknown;
}
export interface FacetPoint {
    x: unknown;
    y: number;
    facetValue: unknown;
    colorValue?: string;
    tooltipValues: TooltipEntry[];
    row: TimeseriesDataRecord;
}
export interface FacetPanelData {
    key: string;
    title: string;
    facetValue: unknown;
    points: FacetPoint[];
}
export interface FacetLayoutPosition {
    index: number;
    row: number;
    col: number;
}
export interface BalancedFacetLayout {
    rows: number;
    cols: number;
    rowCounts: number[];
    positions: FacetLayoutPosition[];
}
export interface SupersetPluginChartFacetedScatterSpcQueryFormData extends QueryFormData {
    x_axis?: ColumnLike;
    metrics?: QueryFormMetric[];
    y_axis_column?: ColumnLike;
    facet_column?: ColumnLike;
    color_column?: ColumnLike;
    tooltip_columns?: ColumnLike[];
    chart_title?: string;
    upper_spec_limit?: number | string | null;
    lower_spec_limit?: number | string | null;
    marker_size?: number | string;
    marker_opacity?: number | string;
    show_legend?: boolean;
    time_format?: string;
    y_axis_min?: number | string | null;
    y_axis_max?: number | string | null;
    facet_sort_order?: FacetSortOrder;
    facet_sort_custom?: string;
    max_facets?: number | string;
    max_panels_per_row?: number | string;
    panel_gap?: number | string;
    color_scheme?: string;
    row_limit?: number | string;
    temporal_columns_lookup?: Record<string, boolean>;
}
export interface SupersetPluginChartFacetedScatterSpcProps {
    width: number;
    height: number;
    chartTitle: string;
    xAxisLabel: string;
    yAxisLabel: string;
    facetColumnLabel: string;
    colorColumnLabel?: string;
    tooltipColumnLabels: string[];
    panels: FacetPanelData[];
    layout: BalancedFacetLayout;
    legendValues: string[];
    colorScheme: string;
    markerSize: number;
    markerOpacity: number;
    showLegend: boolean;
    timeFormat: string;
    yDomain: [number, number];
    upperSpecLimit: number | null;
    lowerSpecLimit: number | null;
    panelGap: number;
    xAxisType: XAxisType;
}
//# sourceMappingURL=types.d.ts.map