import _pt from "prop-types";
import React, { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { getNumberFormatter, getTimeFormatter } from '@superset-ui/core';
function asXAxisValue(value, axisType) {
  if (axisType === 'time') {
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'number') {
      return value;
    }
    var parsed = Date.parse(String(value));
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (axisType === 'value') {
    var numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return value == null ? null : String(value);
}
function formatTimeAxisValue(value, formatter) {
  if (typeof value === 'number') {
    return formatter(value);
  }
  var parsed = Date.parse(value);
  return Number.isNaN(parsed) ? value : formatter(parsed);
}
function escapeHtml(value) {
  return String(value != null ? value : '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
export default function FacetPanel(_ref) {
  var {
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
    getColor
  } = _ref;
  var containerRef = useRef(null);
  var timeFormatter = useMemo(() => getTimeFormatter(timeFormat || 'smart_date'), [timeFormat]);
  var numberFormatter = useMemo(() => getNumberFormatter('SMART_NUMBER'), []);
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
    var chart = echarts.init(containerRef.current);
    var groupedPoints = panel.points.reduce((accumulator, point) => {
      var key = point.colorValue || '__default__';
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(point);
      return accumulator;
    }, {});
    var series = Object.entries(groupedPoints).map((_ref2, index) => {
      var [groupKey, points] = _ref2;
      return {
        type: 'scatter',
        name: groupKey === '__default__' ? 'Measurement' : groupKey,
        symbolSize: markerSize,
        itemStyle: {
          color: getColor(groupKey),
          opacity: markerOpacity
        },
        data: points.map(point => ({
          value: [asXAxisValue(point.x, xAxisType), point.y],
          tooltipValues: point.tooltipValues
        })).filter(point => point.value[0] !== null),
        z: 3 + index,
        markArea: lowerSpecLimit !== null && upperSpecLimit !== null && index === 0 ? {
          silent: true,
          itemStyle: {
            color: 'rgba(143, 201, 58, 0.14)'
          },
          data: [[{
            yAxis: lowerSpecLimit
          }, {
            yAxis: upperSpecLimit
          }]]
        } : undefined,
        markLine: (lowerSpecLimit !== null || upperSpecLimit !== null) && index === 0 ? {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: '#c62828',
            type: 'solid',
            width: 1.5
          },
          label: {
            show: true,
            formatter: _ref3 => {
              var {
                value
              } = _ref3;
              return numberFormatter(value);
            }
          },
          data: [lowerSpecLimit !== null ? {
            yAxis: lowerSpecLimit
          } : null, upperSpecLimit !== null ? {
            yAxis: upperSpecLimit
          } : null].filter(Boolean)
        } : undefined
      };
    });
    chart.setOption({
      animation: false,
      title: {
        text: panel.title,
        left: 'center',
        top: 6,
        textStyle: {
          fontSize: 12,
          fontWeight: 600,
          color: '#1f2937'
        }
      },
      grid: {
        top: 34,
        right: 12,
        bottom: 34,
        left: 18,
        containLabel: true
      },
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        formatter: params => {
          var _params$data;
          var tooltipValues = ((_params$data = params.data) == null ? void 0 : _params$data.tooltipValues) || [];
          return tooltipValues.map(item => "<div><strong>" + escapeHtml(item.label) + ":</strong> " + escapeHtml(item.value) + "</div>").join('');
        }
      },
      toolbox: showDataZoom ? {
        right: 8,
        top: 4,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {}
        }
      } : undefined,
      xAxis: {
        type: xAxisType,
        name: xAxisLabel,
        nameLocation: 'middle',
        nameGap: 28,
        axisLabel: {
          formatter: value => xAxisType === 'time' ? formatTimeAxisValue(value, timeFormatter) : String(value),
          hideOverlap: true
        },
        splitLine: {
          show: false
        }
      },
      dataZoom: showDataZoom ? [{
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'filter'
      }] : undefined,
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        min: yDomain[0],
        max: yDomain[1],
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.25)'
          }
        }
      },
      series
    });
    var resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [getColor, lowerSpecLimit, markerOpacity, markerSize, numberFormatter, panel, timeFormatter, upperSpecLimit, xAxisLabel, xAxisType, yAxisLabel, yDomain, showDataZoom]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#ffffff',
      border: '1px solid #dbe2ea',
      borderRadius: 10,
      boxSizing: 'border-box',
      height,
      minHeight: 220,
      overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(226, 232, 240, 0.45)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    style: {
      height: '100%',
      width: '100%'
    }
  }));
}
FacetPanel.propTypes = {
  width: _pt.number,
  height: _pt.number.isRequired,
  xAxisType: _pt.oneOf(['time', 'value', 'category']).isRequired,
  xAxisLabel: _pt.string.isRequired,
  yAxisLabel: _pt.string.isRequired,
  markerSize: _pt.number.isRequired,
  markerOpacity: _pt.number.isRequired,
  timeFormat: _pt.string.isRequired,
  upperSpecLimit: _pt.oneOfType([_pt.number, _pt.oneOf([null])]),
  lowerSpecLimit: _pt.oneOfType([_pt.number, _pt.oneOf([null])]),
  showDataZoom: _pt.bool.isRequired,
  getColor: _pt.func.isRequired
};