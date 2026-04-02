"use strict";

exports.__esModule = true;
exports.default = FacetedScatterSpcChart;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@superset-ui/core");
var _FacetPanel = _interopRequireDefault(require("./FacetPanel"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function buildLegendValues(panels) {
  return Array.from(new Set(panels.flatMap(panel => panel.points.map(point => point.colorValue).filter(value => Boolean(value)))));
}
function FacetedScatterSpcChart(_ref) {
  var {
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
    xAxisType
  } = _ref;
  var colorScale = (0, _react.useMemo)(() => _core.CategoricalColorNamespace.getScale(colorScheme), [colorScheme]);
  var effectiveLegendValues = legendValues.length ? legendValues : buildLegendValues(panels);
  var [sharedZoom, setSharedZoom] = (0, _react.useState)(null);
  var [selectedXKey, setSelectedXKey] = (0, _react.useState)(null);
  var rows = (0, _react.useMemo)(() => {
    var cursor = 0;
    return layout.rowCounts.map((rowCount, rowIndex) => {
      var rowPanels = panels.slice(cursor, cursor + rowCount).map((panel, colIndex) => ({
        panel,
        position: layout.positions[cursor + colIndex]
      }));
      cursor += rowCount;
      return {
        rowIndex,
        rowPanels
      };
    });
  }, [layout.positions, layout.rowCounts, panels]);
  var contentWidth = overallChartWidth ? Math.max(width, overallChartWidth) : width;
  var contentHeight = overallChartHeight ? Math.max(height, overallChartHeight) : height;
  var titleHeight = chartTitle ? 28 : 0;
  var legendHeight = showLegend && effectiveLegendValues.length ? 34 : 0;
  var availableHeight = Math.max(240, contentHeight - titleHeight - legendHeight - rowGap * Math.max(layout.rows - 1, 0));
  var rowHeight = layout.rows ? Math.max(220, Math.floor(availableHeight / layout.rows)) : availableHeight;
  if (!panels.length) {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        alignItems: 'center',
        color: '#64748b',
        display: 'flex',
        height,
        justifyContent: 'center',
        width
      }
    }, "No data returned for the selected facet chart configuration.");
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      height,
      width,
      overflow: 'auto'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      height: contentHeight,
      minWidth: contentWidth,
      padding: 8,
      width: contentWidth
    }
  }, chartTitle ? /*#__PURE__*/_react.default.createElement("div", {
    style: {
      color: '#0f172a',
      fontSize: 16,
      fontWeight: 700
    }
  }, chartTitle) : null, showLegend && effectiveLegendValues.length ? /*#__PURE__*/_react.default.createElement("div", {
    style: {
      alignItems: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12
    }
  }, effectiveLegendValues.map(value => /*#__PURE__*/_react.default.createElement("div", {
    key: value,
    style: {
      alignItems: 'center',
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      background: colorScale(value),
      borderRadius: 999,
      display: 'inline-block',
      height: 10,
      width: 10
    }
  }), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: '#475569',
      fontSize: 12
    }
  }, value)))) : null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      alignItems: 'center',
      color: '#334155',
      display: 'flex',
      fontSize: 12,
      fontWeight: 600,
      justifyContent: 'center',
      minWidth: 28,
      paddingRight: 8,
      writingMode: 'vertical-rl'
    }
  }, yAxisLabel), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      gap: rowGap,
      minWidth: 0
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      gap: rowGap,
      minWidth: 0
    }
  }, rows.map(_ref2 => {
    var {
      rowIndex,
      rowPanels
    } = _ref2;
    return /*#__PURE__*/_react.default.createElement("div", {
      key: "row-" + rowIndex,
      style: {
        display: 'grid',
        gap: columnGap,
        gridTemplateColumns: "repeat(" + rowPanels.length + ", minmax(0, 1fr))"
      }
    }, rowPanels.map(_ref3 => {
      var _position$rowCount, _position$isFirstInRo, _position$isLastInRow;
      var {
        panel,
        position
      } = _ref3;
      return /*#__PURE__*/_react.default.createElement(_FacetPanel.default, {
        key: panel.key,
        panel: panel,
        height: rowHeight,
        rowIndex: rowIndex,
        rowCount: (_position$rowCount = position == null ? void 0 : position.rowCount) != null ? _position$rowCount : rowPanels.length,
        isFirstInRow: (_position$isFirstInRo = position == null ? void 0 : position.isFirstInRow) != null ? _position$isFirstInRo : false,
        isLastInRow: (_position$isLastInRow = position == null ? void 0 : position.isLastInRow) != null ? _position$isLastInRow : false,
        xAxisType: xAxisType,
        xAxisLabel: xAxisLabel,
        yAxisLabel: "",
        yDomain: yDomain,
        markerSize: markerSize,
        markerOpacity: markerOpacity,
        timeFormat: timeFormat,
        upperSpecLimit: upperSpecLimit,
        lowerSpecLimit: lowerSpecLimit,
        enableScrollWheelZoom: enableScrollWheelZoom,
        showDataZoomSlider: showDataZoomSlider,
        showDataZoomDetailText: showDataZoomDetailText,
        connectPanelsWithinRow: connectPanelsWithinRow,
        yAxisLabelGap: yAxisLabelGap,
        xAxisLabelGap: xAxisLabelGap,
        dataZoomGap: dataZoomGap,
        facetTitleGap: facetTitleGap,
        panelPadding: panelPadding,
        leftOuterAxisPadding: leftOuterAxisPadding,
        columnGap: columnGap,
        sharedZoom: sharedZoom,
        selectedXKey: selectedXKey,
        onZoomChange: setSharedZoom,
        onSelectionChange: selectionKey => setSelectedXKey(current => current === selectionKey ? null : selectionKey),
        getColor: colorScale
      });
    }));
  }))))));
}