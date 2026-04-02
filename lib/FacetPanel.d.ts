import React from 'react';
import type { FacetPanelData, FacetZoomState } from './types';
interface FacetPanelProps {
    panel: FacetPanelData;
    width?: number;
    height: number;
    rowIndex: number;
    rowCount: number;
    isFirstInRow: boolean;
    isLastInRow: boolean;
    xAxisType: 'time' | 'value' | 'category';
    xAxisLabel: string;
    yAxisLabel: string;
    yDomain: [number, number];
    markerSize: number;
    markerOpacity: number;
    timeFormat: string;
    upperSpecLimit: number | null;
    lowerSpecLimit: number | null;
    enableScrollWheelZoom: boolean;
    showDataZoomSlider: boolean;
    showDataZoomDetailText: boolean;
    connectPanelsWithinRow: boolean;
    yAxisLabelGap: number;
    xAxisLabelGap: number;
    dataZoomGap: number;
    facetTitleGap: number;
    panelPadding: number;
    leftOuterAxisPadding: number;
    columnGap: number;
    sharedZoom: FacetZoomState | null;
    selectedXKey: string | null;
    onZoomChange: (zoom: FacetZoomState | null) => void;
    onSelectionChange: (selectionKey: string | null) => void;
    getColor: (key: string) => string;
}
export default function FacetPanel({ panel, height, rowIndex, rowCount, isFirstInRow, isLastInRow, xAxisType, xAxisLabel, yAxisLabel, yDomain, markerSize, markerOpacity, timeFormat, upperSpecLimit, lowerSpecLimit, enableScrollWheelZoom, showDataZoomSlider, showDataZoomDetailText, connectPanelsWithinRow, yAxisLabelGap, xAxisLabelGap, dataZoomGap, facetTitleGap, panelPadding, leftOuterAxisPadding, columnGap, sharedZoom, selectedXKey, onZoomChange, onSelectionChange, getColor, }: FacetPanelProps): React.JSX.Element;
export {};
//# sourceMappingURL=FacetPanel.d.ts.map