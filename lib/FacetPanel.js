"use strict";

exports.__esModule = true;
exports.default = FacetPanel;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _react = _interopRequireWildcard(require("react"));
var echarts = _interopRequireWildcard(require("echarts"));
var _core = require("@superset-ui/core");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function FacetPanel(_ref) {
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
    sharedZoom,
    selectedXKey,
    onZoomChange,
    onSelectionChange,
    getColor
  } = _ref;
  var containerRef = (0, _react.useRef)(null);
  var timeFormatter = (0, _react.useMemo)(() => (0, _core.getTimeFormatter)(timeFormat || 'smart_date'), [timeFormat]);
  var numberFormatter = (0, _react.useMemo)(() => (0, _core.getNumberFormatter)('SMART_NUMBER'), []);
  (0, _react.useEffect)(() => {
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
      dataZoom: showDataZoom ? [_extends({
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'filter'
      }, sharedZoom || {}), _extends({
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'filter',
        height: 18,
        bottom: 8
      }, sharedZoom || {})] : undefined,
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
  }, [getColor, lowerSpecLimit, markerOpacity, markerSize, numberFormatter, panel, timeFormatter, upperSpecLimit, xAxisLabel, xAxisType, yAxisLabel, yDomain, showDataZoom, sharedZoom, selectedXKey, onZoomChange, onSelectionChange]);
  return /*#__PURE__*/_react.default.createElement("div", {
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
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: containerRef,
    style: {
      height: '100%',
      width: '100%'
    }
  }));
}
FacetPanel.propTypes = {
  width: _propTypes.default.number,
  height: _propTypes.default.number.isRequired,
  xAxisType: _propTypes.default.oneOf(['time', 'value', 'category']).isRequired,
  xAxisLabel: _propTypes.default.string.isRequired,
  yAxisLabel: _propTypes.default.string.isRequired,
  markerSize: _propTypes.default.number.isRequired,
  markerOpacity: _propTypes.default.number.isRequired,
  timeFormat: _propTypes.default.string.isRequired,
  upperSpecLimit: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.oneOf([null])]),
  lowerSpecLimit: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.oneOf([null])]),
  showDataZoom: _propTypes.default.bool.isRequired,
  selectedXKey: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.oneOf([null])]),
  onZoomChange: _propTypes.default.func.isRequired,
  onSelectionChange: _propTypes.default.func.isRequired,
  getColor: _propTypes.default.func.isRequired
};