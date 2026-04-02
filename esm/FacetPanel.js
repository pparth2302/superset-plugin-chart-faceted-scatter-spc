import _pt from "prop-types";
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { getTimeFormatter } from '@superset-ui/core';
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
function getSelectionKey(value, axisType) {
  var normalizedValue = asXAxisValue(value, axisType);
  return normalizedValue === null ? null : String(normalizedValue);
}
export default function FacetPanel(_ref) {
  var {
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
    getColor
  } = _ref;
  var containerRef = useRef(null);
  var timeFormatter = useMemo(() => getTimeFormatter(timeFormat || 'smart_date'), [timeFormat]);
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
    var chart = echarts.init(containerRef.current);
    var sliderHeight = showDataZoomSlider ? 18 : 0;
    var showRowYAxis = isFirstInRow || !connectPanelsWithinRow;
    var topPadding = Math.max(8, panelPadding);
    var titleTop = Math.max(6, Math.floor(panelPadding / 2));
    var titleHeight = 16;
    var gridTop = topPadding + titleHeight + facetTitleGap;
    var gridBottom = Math.max(panelPadding + xAxisLabelGap + 24 + (showDataZoomSlider ? sliderHeight + dataZoomGap : 0), 32);
    var gridLeft = showRowYAxis ? Math.max(panelPadding + yAxisLabelGap + 36 + (isFirstInRow ? leftOuterAxisPadding : 0), 52) : Math.max(panelPadding, connectPanelsWithinRow ? 6 : 12);
    var gridRight = Math.max(panelPadding, connectPanelsWithinRow ? 8 : 12);
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
          tooltipValues: point.tooltipValues,
          selectionKey: getSelectionKey(point.x, xAxisType),
          symbolSize: selectedXKey && getSelectionKey(point.x, xAxisType) === selectedXKey ? markerSize + 3 : markerSize,
          itemStyle: {
            color: getColor(groupKey),
            opacity: selectedXKey === null ? markerOpacity : getSelectionKey(point.x, xAxisType) === selectedXKey ? 1 : 0.14,
            borderColor: selectedXKey && getSelectionKey(point.x, xAxisType) === selectedXKey ? '#0f172a' : getColor(groupKey),
            borderWidth: selectedXKey && getSelectionKey(point.x, xAxisType) === selectedXKey ? 1.5 : 0
          }
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
            show: false
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
        top: titleTop,
        textStyle: {
          fontSize: 12,
          fontWeight: 600,
          color: '#1f2937'
        }
      },
      grid: {
        top: gridTop,
        right: gridRight,
        bottom: gridBottom,
        left: gridLeft,
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
      toolbox: showDataZoomSlider || enableScrollWheelZoom ? {
        right: 8,
        top: 4,
        feature: _extends({}, showDataZoomSlider || enableScrollWheelZoom ? {
          dataZoom: {
            yAxisIndex: 'none'
          }
        } : {}, {
          restore: {}
        })
      } : undefined,
      xAxis: {
        type: xAxisType,
        name: xAxisLabel,
        nameLocation: 'middle',
        nameGap: 28,
        axisLabel: {
          formatter: value => xAxisType === 'time' ? formatTimeAxisValue(value, timeFormatter) : String(value),
          hideOverlap: true,
          margin: xAxisLabelGap
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.18)'
          }
        }
      },
      dataZoom: enableScrollWheelZoom || showDataZoomSlider ? [...(enableScrollWheelZoom ? [_extends({
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'filter',
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: false
      }, sharedZoom || {})] : []), ...(showDataZoomSlider ? [_extends({
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'filter',
        height: sliderHeight,
        bottom: Math.max(panelPadding, 8),
        showDetail: showDataZoomDetailText,
        showDataShadow: false,
        brushSelect: false
      }, sharedZoom || {})] : [])] : undefined,
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        min: yDomain[0],
        max: yDomain[1],
        axisLine: {
          show: showRowYAxis
        },
        axisTick: {
          show: showRowYAxis
        },
        axisLabel: {
          show: showRowYAxis,
          margin: yAxisLabelGap
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.25)'
          }
        }
      },
      series
    });
    var handleDataZoom = () => {
      var _option$dataZoom;
      var option = chart.getOption();
      var currentZoom = ((_option$dataZoom = option.dataZoom) == null ? void 0 : _option$dataZoom[0]) || {};
      onZoomChange({
        start: currentZoom.start,
        end: currentZoom.end,
        startValue: currentZoom.startValue,
        endValue: currentZoom.endValue
      });
    };
    var handleRestore = () => {
      onZoomChange(null);
      onSelectionChange(null);
    };
    var handleClick = params => {
      var _dataPoint$selectionK;
      var dataPoint = params.data;
      onSelectionChange((_dataPoint$selectionK = dataPoint == null ? void 0 : dataPoint.selectionKey) != null ? _dataPoint$selectionK : null);
    };
    chart.on('datazoom', handleDataZoom);
    chart.on('restore', handleRestore);
    chart.on('click', handleClick);
    var resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
      chart.off('datazoom', handleDataZoom);
      chart.off('restore', handleRestore);
      chart.off('click', handleClick);
      chart.dispose();
    };
  }, [columnGap, connectPanelsWithinRow, dataZoomGap, enableScrollWheelZoom, facetTitleGap, getColor, isFirstInRow, isLastInRow, leftOuterAxisPadding, lowerSpecLimit, markerOpacity, markerSize, panel, panelPadding, rowCount, rowIndex, showDataZoomDetailText, showDataZoomSlider, timeFormatter, upperSpecLimit, xAxisLabelGap, xAxisLabel, xAxisType, yAxisLabelGap, yAxisLabel, yDomain, sharedZoom, selectedXKey, onZoomChange, onSelectionChange]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#ffffff',
      border: '1px solid #dbe2ea',
      borderLeftWidth: connectPanelsWithinRow && !isFirstInRow && columnGap === 0 ? 0 : 1,
      borderRadius: connectPanelsWithinRow ? (isFirstInRow ? 10 : 0) + "px " + (isLastInRow ? 10 : 0) + "px " + (isLastInRow ? 10 : 0) + "px " + (isFirstInRow ? 10 : 0) + "px" : 10,
      boxSizing: 'border-box',
      height,
      minHeight: 220,
      overflow: 'hidden',
      boxShadow: connectPanelsWithinRow && !isFirstInRow ? 'inset 1px 0 0 rgba(226, 232, 240, 0.8)' : 'inset 0 0 0 1px rgba(226, 232, 240, 0.45)'
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
  rowIndex: _pt.number.isRequired,
  rowCount: _pt.number.isRequired,
  isFirstInRow: _pt.bool.isRequired,
  isLastInRow: _pt.bool.isRequired,
  xAxisType: _pt.oneOf(['time', 'value', 'category']).isRequired,
  xAxisLabel: _pt.string.isRequired,
  yAxisLabel: _pt.string.isRequired,
  markerSize: _pt.number.isRequired,
  markerOpacity: _pt.number.isRequired,
  timeFormat: _pt.string.isRequired,
  upperSpecLimit: _pt.oneOfType([_pt.number, _pt.oneOf([null])]),
  lowerSpecLimit: _pt.oneOfType([_pt.number, _pt.oneOf([null])]),
  enableScrollWheelZoom: _pt.bool.isRequired,
  showDataZoomSlider: _pt.bool.isRequired,
  showDataZoomDetailText: _pt.bool.isRequired,
  connectPanelsWithinRow: _pt.bool.isRequired,
  yAxisLabelGap: _pt.number.isRequired,
  xAxisLabelGap: _pt.number.isRequired,
  dataZoomGap: _pt.number.isRequired,
  facetTitleGap: _pt.number.isRequired,
  panelPadding: _pt.number.isRequired,
  leftOuterAxisPadding: _pt.number.isRequired,
  columnGap: _pt.number.isRequired
};