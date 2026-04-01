import React from 'react';
import type { FacetPanelData } from './types';
interface FacetPanelProps {
    panel: FacetPanelData;
    width?: number;
    height: number;
    xAxisType: 'time' | 'value' | 'category';
    xAxisLabel: string;
    yAxisLabel: string;
    yDomain: [number, number];
    markerSize: number;
    markerOpacity: number;
    timeFormat: string;
    upperSpecLimit: number | null;
    lowerSpecLimit: number | null;
    showDataZoom: boolean;
    getColor: (key: string) => string;
}
export default function FacetPanel({ panel, height, xAxisType, xAxisLabel, yAxisLabel, yDomain, markerSize, markerOpacity, timeFormat, upperSpecLimit, lowerSpecLimit, showDataZoom, getColor, }: FacetPanelProps): React.JSX.Element;
export {};
//# sourceMappingURL=FacetPanel.d.ts.map