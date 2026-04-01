import React, { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { getNumberFormatter, getTimeFormatter } from '@superset-ui/core';
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

export default function FacetPanel({
  panel,
  height,
  xAxisType,
  xAxisLabel,
  yAxisLabel,
  yDomain,
  markerSize,
  markerOpacity,
  timeFormat,
  upperSpecLimit,
  lowerSpecLimit,
  showDataZoom,
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
                show: true,
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
        top: 6,
        textStyle: {
          fontSize: 12,
          fontWeight: 600,
          color: '#1f2937',
        },
      },
      grid: {
        top: 34,
        right: 12,
        bottom: 34,
        left: 18,
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
      toolbox: showDataZoom
        ? {
            right: 8,
            top: 4,
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
              },
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
        },
        splitLine: {
          show: false,
        },
      },
      dataZoom: showDataZoom
        ? [
            {
              type: 'inside',
              xAxisIndex: 0,
              filterMode: 'filter',
            },
          ]
        : undefined,
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        min: yDomain[0],
        max: yDomain[1],
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.25)',
          },
        },
      },
      series,
    });

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [
    getColor,
    lowerSpecLimit,
    markerOpacity,
    markerSize,
    numberFormatter,
    panel,
    timeFormatter,
    upperSpecLimit,
    xAxisLabel,
    xAxisType,
    yAxisLabel,
    yDomain,
    showDataZoom,
  ]);

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #dbe2ea',
        borderRadius: 10,
        boxSizing: 'border-box',
        height,
        minHeight: 220,
        overflow: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(226, 232, 240, 0.45)',
      }}
    >
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
