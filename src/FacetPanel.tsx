import React, { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { getNumberFormatter, getTimeFormatter } from '@superset-ui/core';
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

function asXAxisValue(value: unknown, axisType: FacetPanelProps['xAxisType']) {
  if (axisType === 'time') {
    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === 'number') {
      return value;
    }

    const parsed = Date.parse(String(value));
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (axisType === 'value') {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  return value == null ? null : String(value);
}

function formatTimeAxisValue(value: number | string, formatter: (value: number | Date) => string) {
  if (typeof value === 'number') {
    return formatter(value);
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? value : formatter(parsed);
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSelectionKey(value: unknown, axisType: FacetPanelProps['xAxisType']) {
  const normalizedValue = asXAxisValue(value, axisType);
  return normalizedValue === null ? null : String(normalizedValue);
}

export default function FacetPanel({
  panel,
  height,
  rowIndex,
  rowCount,
  isFirstInRow,
  isLastInRow,
  xAxisType,
  xAxisLabel,
  yAxisLabel,
  yDomain,
  markerSize,
  markerOpacity,
  timeFormat,
  upperSpecLimit,
  lowerSpecLimit,
  enableScrollWheelZoom,
  showDataZoomSlider,
  showDataZoomDetailText,
  connectPanelsWithinRow,
  yAxisLabelGap,
  xAxisLabelGap,
  dataZoomGap,
  facetTitleGap,
  panelPadding,
  leftOuterAxisPadding,
  columnGap,
  sharedZoom,
  selectedXKey,
  onZoomChange,
  onSelectionChange,
  getColor,
}: FacetPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeFormatter = useMemo(() => getTimeFormatter(timeFormat || 'smart_date'), [timeFormat]);
  const numberFormatter = useMemo(() => getNumberFormatter('SMART_NUMBER'), []);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const chart = echarts.init(containerRef.current);
    const sliderHeight = showDataZoomSlider ? 18 : 0;
    const showRowYAxis = isFirstInRow || !connectPanelsWithinRow;
    const topPadding = Math.max(8, panelPadding);
    const titleTop = Math.max(6, Math.floor(panelPadding / 2));
    const titleHeight = 16;
    const gridTop = topPadding + titleHeight + facetTitleGap;
    const gridBottom = Math.max(
      panelPadding + xAxisLabelGap + 24 + (showDataZoomSlider ? sliderHeight + dataZoomGap : 0),
      32,
    );
    const gridLeft = showRowYAxis
      ? Math.max(panelPadding + yAxisLabelGap + 36 + (isFirstInRow ? leftOuterAxisPadding : 0), 52)
      : Math.max(panelPadding, connectPanelsWithinRow ? 6 : 12);
    const gridRight = Math.max(panelPadding, connectPanelsWithinRow ? 8 : 12);
    const groupedPoints = panel.points.reduce<Record<string, typeof panel.points>>((accumulator, point) => {
      const key = point.colorValue || '__default__';
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(point);
      return accumulator;
    }, {});

    const series = Object.entries(groupedPoints).map(([groupKey, points], index) => ({
      type: 'scatter',
      name: groupKey === '__default__' ? 'Measurement' : groupKey,
      symbolSize: markerSize,
      itemStyle: {
        color: getColor(groupKey),
        opacity: markerOpacity,
      },
      data: points
        .map(point => ({
          value: [asXAxisValue(point.x, xAxisType), point.y],
          tooltipValues: point.tooltipValues,
          selectionKey: getSelectionKey(point.x, xAxisType),
          symbolSize:
            selectedXKey && getSelectionKey(point.x, xAxisType) === selectedXKey
              ? markerSize + 3
              : markerSize,
          itemStyle: {
            color: getColor(groupKey),
            opacity:
              selectedXKey === null
                ? markerOpacity
                : getSelectionKey(point.x, xAxisType) === selectedXKey
                  ? 1
                  : 0.14,
            borderColor:
              selectedXKey && getSelectionKey(point.x, xAxisType) === selectedXKey
                ? '#0f172a'
                : getColor(groupKey),
            borderWidth:
              selectedXKey && getSelectionKey(point.x, xAxisType) === selectedXKey ? 1.5 : 0,
          },
        }))
        .filter(point => point.value[0] !== null),
      z: 3 + index,
      markArea:
        lowerSpecLimit !== null && upperSpecLimit !== null && index === 0
          ? {
              silent: true,
              itemStyle: {
                color: 'rgba(143, 201, 58, 0.14)',
              },
              data: [[{ yAxis: lowerSpecLimit }, { yAxis: upperSpecLimit }]],
            }
          : undefined,
      markLine:
        (lowerSpecLimit !== null || upperSpecLimit !== null) && index === 0
          ? {
              silent: true,
              symbol: 'none',
              lineStyle: {
                color: '#c62828',
                type: 'solid',
                width: 1.5,
              },
              label: {
                show: isFirstInRow,
                formatter: ({ value }: { value: number }) => numberFormatter(value),
              },
              data: [
                lowerSpecLimit !== null ? { yAxis: lowerSpecLimit } : null,
                upperSpecLimit !== null ? { yAxis: upperSpecLimit } : null,
              ].filter(Boolean),
            }
          : undefined,
    }));

    chart.setOption({
      animation: false,
      title: {
        text: panel.title,
        left: 'center',
        top: titleTop,
        textStyle: {
          fontSize: 12,
          fontWeight: 600,
          color: '#1f2937',
        },
      },
      grid: {
        top: gridTop,
        right: gridRight,
        bottom: gridBottom,
        left: gridLeft,
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        formatter: (params: { data?: { tooltipValues?: Array<{ label: string; value: unknown }> } }) => {
          const tooltipValues = params.data?.tooltipValues || [];
          return tooltipValues
            .map(
              item =>
                `<div><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}</div>`,
            )
            .join('');
        },
      },
      toolbox: showDataZoomSlider || enableScrollWheelZoom
        ? {
            right: 8,
            top: 4,
            feature: {
              ...(showDataZoomSlider || enableScrollWheelZoom
                ? {
                    dataZoom: {
                      yAxisIndex: 'none',
                    },
                  }
                : {}),
              restore: {},
            },
          }
        : undefined,
      xAxis: {
        type: xAxisType,
        name: xAxisLabel,
        nameLocation: 'middle',
        nameGap: 28,
        axisLabel: {
          formatter: (value: number | string) =>
            xAxisType === 'time' ? formatTimeAxisValue(value, timeFormatter) : String(value),
          hideOverlap: true,
          margin: xAxisLabelGap,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.18)',
          },
        },
      },
      dataZoom: enableScrollWheelZoom || showDataZoomSlider
        ? [
            ...(enableScrollWheelZoom
              ? [
                  {
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'filter',
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true,
                    moveOnMouseWheel: false,
                    ...(sharedZoom || {}),
                  },
                ]
              : []),
            ...(showDataZoomSlider
              ? [
                  {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'filter',
                    height: sliderHeight,
                    bottom: Math.max(panelPadding, 8),
                    showDetail: showDataZoomDetailText,
                    showDataShadow: false,
                    brushSelect: false,
                    ...(sharedZoom || {}),
                  },
                ]
              : []),
          ]
        : undefined,
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        min: yDomain[0],
        max: yDomain[1],
        axisLine: {
          show: showRowYAxis,
        },
        axisTick: {
          show: showRowYAxis,
        },
        axisLabel: {
          show: showRowYAxis,
          margin: yAxisLabelGap,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.25)',
          },
        },
      },
      series,
    });

    const handleDataZoom = () => {
      const option = chart.getOption() as {
        dataZoom?: Array<{
          start?: number;
          end?: number;
          startValue?: string | number;
          endValue?: string | number;
        }>;
      };
      const currentZoom = (option.dataZoom?.[0] || {}) as {
        start?: number;
        end?: number;
        startValue?: string | number;
        endValue?: string | number;
      };

      onZoomChange({
        start: currentZoom.start,
        end: currentZoom.end,
        startValue: currentZoom.startValue,
        endValue: currentZoom.endValue,
      });
    };

    const handleRestore = () => {
      onZoomChange(null);
      onSelectionChange(null);
    };

    const handleClick = (params: { data?: unknown }) => {
      const dataPoint = params.data as { selectionKey?: string | null } | null | undefined;
      onSelectionChange(dataPoint?.selectionKey ?? null);
    };

    chart.on('datazoom', handleDataZoom);
    chart.on('restore', handleRestore);
    chart.on('click', handleClick);

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.off('datazoom', handleDataZoom);
      chart.off('restore', handleRestore);
      chart.off('click', handleClick);
      chart.dispose();
    };
  }, [
    columnGap,
    connectPanelsWithinRow,
    dataZoomGap,
    enableScrollWheelZoom,
    facetTitleGap,
    getColor,
    isFirstInRow,
    isLastInRow,
    leftOuterAxisPadding,
    lowerSpecLimit,
    markerOpacity,
    markerSize,
    numberFormatter,
    panel,
    panelPadding,
    rowCount,
    rowIndex,
    showDataZoomDetailText,
    showDataZoomSlider,
    timeFormatter,
    upperSpecLimit,
    xAxisLabelGap,
    xAxisLabel,
    xAxisType,
    yAxisLabelGap,
    yAxisLabel,
    yDomain,
    sharedZoom,
    selectedXKey,
    onZoomChange,
    onSelectionChange,
  ]);

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #dbe2ea',
        borderLeftWidth: connectPanelsWithinRow && !isFirstInRow && columnGap === 0 ? 0 : 1,
        borderRadius: connectPanelsWithinRow
          ? `${isFirstInRow ? 10 : 0}px ${isLastInRow ? 10 : 0}px ${isLastInRow ? 10 : 0}px ${
              isFirstInRow ? 10 : 0
            }px`
          : 10,
        boxSizing: 'border-box',
        height,
        minHeight: 220,
        overflow: 'hidden',
        boxShadow:
          connectPanelsWithinRow && !isFirstInRow
            ? 'inset 1px 0 0 rgba(226, 232, 240, 0.8)'
            : 'inset 0 0 0 1px rgba(226, 232, 240, 0.45)',
      }}
    >
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
