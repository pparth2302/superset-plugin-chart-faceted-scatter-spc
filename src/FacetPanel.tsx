import React, { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { getNumberFormatter, getTimeFormatter } from '@superset-ui/core';
import { FacetPanelData } from './types';

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
      name: groupKey === '__default__' ? panel.title : groupKey,
      symbolSize: markerSize,
      itemStyle: {
        color: getColor(groupKey === '__default__' ? panel.title : groupKey),
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
            .map(item => `<div><strong>${item.label}:</strong> ${item.value ?? ''}</div>`)
            .join('');
        },
      },
      xAxis: {
        type: xAxisType,
        name: xAxisLabel,
        nameLocation: 'middle',
        nameGap: 28,
        axisLabel: {
          formatter: (value: number | string) =>
            xAxisType === 'time' ? timeFormatter(value) : String(value),
        },
        splitLine: {
          show: false,
        },
      },
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
      }}
    >
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}