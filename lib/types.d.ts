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
    rowCount: number;
    isFirstInRow: boolean;
    isLastInRow: boolean;
}
export interface BalancedFacetLayout {
    rows: number;
    cols: number;
    rowCounts: number[];
    positions: FacetLayoutPosition[];
}
export interface FacetZoomState {
    start?: number;
    end?: number;
    startValue?: string | number;
    endValue?: string | number;
}
export interface SupersetPluginChartFacetedScatterSpcQueryFormData extends QueryFormData {
    x_axis?: ColumnLike;
    metrics?: QueryFormMetric[];
    y_axis_column?: ColumnLike;
    facet_column?: ColumnLike;
    color_column?: ColumnLike;
    tooltip_columns?: ColumnLike[];
    chart_title?: string;
    x_axis_label?: string;
    y_axis_label?: string;
    y_axis_label_gap?: number | string;
    x_axis_label_gap?: number | string;
    data_zoom_gap?: number | string;
    facet_title_gap?: number | string;
    panel_padding?: number | string;
    left_outer_axis_padding?: number | string;
    overall_chart_height?: number | string;
    overall_chart_width?: number | string;
    row_gap?: number | string;
    column_gap?: number | string;
    upper_spec_limit?: number | string | null;
    lower_spec_limit?: number | string | null;
    marker_size?: number | string;
    marker_opacity?: number | string;
    show_legend?: boolean;
    show_data_zoom?: boolean;
    enable_scroll_wheel_zoom?: boolean;
    show_data_zoom_slider?: boolean;
    show_data_zoom_detail_text?: boolean;
    connect_panels_within_row?: boolean;
    time_format?: string;
    tooltip_time_format?: string;
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
    enableScrollWheelZoom: boolean;
    showDataZoomSlider: boolean;
    showDataZoomDetailText: boolean;
    connectPanelsWithinRow: boolean;
    timeFormat: string;
    tooltipTimeFormat: string;
    yDomain: [number, number];
    upperSpecLimit: number | null;
    lowerSpecLimit: number | null;
    yAxisLabelGap: number;
    xAxisLabelGap: number;
    dataZoomGap: number;
    facetTitleGap: number;
    panelPadding: number;
    leftOuterAxisPadding: number;
    overallChartHeight: number | null;
    overallChartWidth: number | null;
    rowGap: number;
    columnGap: number;
    xAxisType: XAxisType;
}
//# sourceMappingURL=types.d.ts.map