import React, { useMemo, useState } from 'react';
import { CategoricalColorNamespace } from '@superset-ui/core';
import { chunkFacetValuesIntoBalancedRows } from './layout';
import FacetPanel from './FacetPanel';
import type {
  FacetPanelData,
  FacetZoomState,
  SupersetPluginChartFacetedScatterSpcProps,
} from './types';

function buildLegendValues(panels: FacetPanelData[]) {
  return Array.from(
    new Set(
      panels.flatMap(panel =>
        panel.points
          .map(point => point.colorValue)
          .filter((value): value is string => Boolean(value)),
      ),
    ),
  );
}

export default function FacetedScatterSpcChart({
  width,
  height,
  chartTitle,
  xAxisLabel,
  yAxisLabel,
  panels,
  layout,
  legendValues,
  colorScheme,
  markerSize,
  markerOpacity,
  showLegend,
  showDataZoom,
  timeFormat,
  yDomain,
  upperSpecLimit,
  lowerSpecLimit,
  panelGap,
  xAxisType,
}: SupersetPluginChartFacetedScatterSpcProps) {
  const colorScale = useMemo(() => CategoricalColorNamespace.getScale(colorScheme), [colorScheme]);
  const effectiveLegendValues = legendValues.length ? legendValues : buildLegendValues(panels);
  const rows = chunkFacetValuesIntoBalancedRows(panels, Math.max(layout.cols, 1));
  const [sharedZoom, setSharedZoom] = useState<FacetZoomState | null>(null);
  const [selectedXKey, setSelectedXKey] = useState<string | null>(null);
  const titleHeight = chartTitle ? 28 : 0;
  const legendHeight = showLegend && effectiveLegendValues.length ? 34 : 0;
  const availableHeight = Math.max(
    240,
    height - titleHeight - legendHeight - panelGap * Math.max(layout.rows - 1, 0),
  );
  const rowHeight = layout.rows
    ? Math.max(220, Math.floor(availableHeight / layout.rows))
    : availableHeight;

  if (!panels.length) {
    return (
      <div
        style={{
          alignItems: 'center',
          color: '#64748b',
          display: 'flex',
          height,
          justifyContent: 'center',
          width,
        }}
      >
        No data returned for the selected facet chart configuration.
      </div>
    );
  }

  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        height,
        padding: 8,
        width,
      }}
    >
      {chartTitle ? (
        <div style={{ color: '#0f172a', fontSize: 16, fontWeight: 700 }}>{chartTitle}</div>
      ) : null}
      {showLegend && effectiveLegendValues.length ? (
        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {effectiveLegendValues.map(value => (
            <div key={value} style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
              <span
                style={{
                  background: colorScale(value),
                  borderRadius: 999,
                  display: 'inline-block',
                  height: 10,
                  width: 10,
                }}
              />
              <span style={{ color: '#475569', fontSize: 12 }}>{value}</span>
            </div>
          ))}
        </div>
      ) : null}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div
          style={{
            alignItems: 'center',
            color: '#334155',
            display: 'flex',
            fontSize: 12,
            fontWeight: 600,
            justifyContent: 'center',
            minWidth: 28,
            paddingRight: 8,
            writingMode: 'vertical-rl',
          }}
        >
          {yAxisLabel}
        </div>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: panelGap, minWidth: 0 }}>
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: panelGap, overflow: 'auto' }}>
            {rows.map((rowPanels, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                style={{
                  display: 'grid',
                  gap: panelGap,
                  gridTemplateColumns: `repeat(${rowPanels.length}, minmax(0, 1fr))`,
                }}
              >
                {rowPanels.map(panel => (
                  <FacetPanel
                    key={panel.key}
                    panel={panel}
                    height={rowHeight}
                    xAxisType={xAxisType}
                    xAxisLabel={xAxisLabel}
                    yAxisLabel=""
                    yDomain={yDomain}
                    markerSize={markerSize}
                    markerOpacity={markerOpacity}
                    timeFormat={timeFormat}
                    upperSpecLimit={upperSpecLimit}
                    lowerSpecLimit={lowerSpecLimit}
                    showDataZoom={showDataZoom}
                    sharedZoom={sharedZoom}
                    selectedXKey={selectedXKey}
                    onZoomChange={setSharedZoom}
                    onSelectionChange={selectionKey =>
                      setSelectedXKey(current =>
                        current === selectionKey ? null : selectionKey,
                      )
                    }
                    getColor={colorScale}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
