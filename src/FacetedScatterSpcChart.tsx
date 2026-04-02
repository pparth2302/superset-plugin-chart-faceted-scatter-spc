import React, { useMemo, useState } from 'react';
import { CategoricalColorNamespace } from '@superset-ui/core';
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
  enableScrollWheelZoom,
  showDataZoomSlider,
  showDataZoomDetailText,
  connectPanelsWithinRow,
  timeFormat,
  yDomain,
  upperSpecLimit,
  lowerSpecLimit,
  yAxisLabelGap,
  xAxisLabelGap,
  dataZoomGap,
  facetTitleGap,
  panelPadding,
  leftOuterAxisPadding,
  overallChartHeight,
  overallChartWidth,
  rowGap,
  columnGap,
  xAxisType,
}: SupersetPluginChartFacetedScatterSpcProps) {
  const colorScale = useMemo(() => CategoricalColorNamespace.getScale(colorScheme), [colorScheme]);
  const effectiveLegendValues = legendValues.length ? legendValues : buildLegendValues(panels);
  const [sharedZoom, setSharedZoom] = useState<FacetZoomState | null>(null);
  const [selectedXKey, setSelectedXKey] = useState<string | null>(null);
  const rows = useMemo(() => {
    let cursor = 0;
    return layout.rowCounts.map((rowCount, rowIndex) => {
      const rowPanels = panels.slice(cursor, cursor + rowCount).map((panel, colIndex) => ({
        panel,
        position: layout.positions[cursor + colIndex],
      }));
      cursor += rowCount;
      return {
        rowIndex,
        rowPanels,
      };
    });
  }, [layout.positions, layout.rowCounts, panels]);
  const contentWidth = overallChartWidth ? Math.max(width, overallChartWidth) : width;
  const contentHeight = overallChartHeight ? Math.max(height, overallChartHeight) : height;
  const titleHeight = chartTitle ? 28 : 0;
  const legendHeight = showLegend && effectiveLegendValues.length ? 34 : 0;
  const availableHeight = Math.max(
    240,
    contentHeight - titleHeight - legendHeight - rowGap * Math.max(layout.rows - 1, 0),
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
        height,
        width,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          height: contentHeight,
          minWidth: contentWidth,
          padding: 8,
          width: contentWidth,
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
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: rowGap, minWidth: 0 }}>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: rowGap, minWidth: 0 }}>
              {rows.map(({ rowIndex, rowPanels }) => (
                <div
                  key={`row-${rowIndex}`}
                  style={{
                    display: 'grid',
                    gap: columnGap,
                    gridTemplateColumns: `repeat(${rowPanels.length}, minmax(0, 1fr))`,
                  }}
                >
                  {rowPanels.map(({ panel, position }) => (
                    <FacetPanel
                      key={panel.key}
                      panel={panel}
                      height={rowHeight}
                      rowIndex={rowIndex}
                      rowCount={position?.rowCount ?? rowPanels.length}
                      isFirstInRow={position?.isFirstInRow ?? false}
                      isLastInRow={position?.isLastInRow ?? false}
                      xAxisType={xAxisType}
                      xAxisLabel={xAxisLabel}
                      yAxisLabel=""
                      yDomain={yDomain}
                      markerSize={markerSize}
                      markerOpacity={markerOpacity}
                      timeFormat={timeFormat}
                      upperSpecLimit={upperSpecLimit}
                      lowerSpecLimit={lowerSpecLimit}
                      enableScrollWheelZoom={enableScrollWheelZoom}
                      showDataZoomSlider={showDataZoomSlider}
                      showDataZoomDetailText={showDataZoomDetailText}
                      connectPanelsWithinRow={connectPanelsWithinRow}
                      yAxisLabelGap={yAxisLabelGap}
                      xAxisLabelGap={xAxisLabelGap}
                      dataZoomGap={dataZoomGap}
                      facetTitleGap={facetTitleGap}
                      panelPadding={panelPadding}
                      leftOuterAxisPadding={leftOuterAxisPadding}
                      columnGap={columnGap}
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
    </div>
  );
}
