import React, { useMemo } from 'react';
import { CategoricalColorNamespace } from '@superset-ui/core';
import { chunkFacetValuesIntoBalancedRows } from './layout';
import FacetPanel from './FacetPanel';
function buildLegendValues(panels) {
  return Array.from(new Set(panels.flatMap(panel => panel.points.map(point => point.colorValue).filter(value => Boolean(value)))));
}
export default function FacetedScatterSpcChart(_ref) {
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
    timeFormat,
    yDomain,
    upperSpecLimit,
    lowerSpecLimit,
    panelGap,
    xAxisType
  } = _ref;
  var colorScale = useMemo(() => CategoricalColorNamespace.getScale(colorScheme), [colorScheme]);
  var effectiveLegendValues = legendValues.length ? legendValues : buildLegendValues(panels);
  var rows = chunkFacetValuesIntoBalancedRows(panels, Math.max(layout.cols, 1));
  var titleHeight = chartTitle ? 28 : 0;
  var legendHeight = showLegend && effectiveLegendValues.length ? 34 : 0;
  var availableHeight = Math.max(240, height - titleHeight - legendHeight - panelGap * Math.max(layout.rows - 1, 0));
  var rowHeight = layout.rows ? Math.max(220, Math.floor(availableHeight / layout.rows)) : availableHeight;
  if (!panels.length) {
    return /*#__PURE__*/React.createElement("div", {
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      height,
      padding: 8,
      width
    }
  }, chartTitle ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#0f172a',
      fontSize: 16,
      fontWeight: 700
    }
  }, chartTitle) : null, showLegend && effectiveLegendValues.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      alignItems: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12
    }
  }, effectiveLegendValues.map(value => /*#__PURE__*/React.createElement("div", {
    key: value,
    style: {
      alignItems: 'center',
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: colorScale(value),
      borderRadius: 999,
      display: 'inline-block',
      height: 10,
      width: 10
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#475569',
      fontSize: 12
    }
  }, value)))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
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
  }, yAxisLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      gap: panelGap,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      gap: panelGap,
      overflow: 'auto'
    }
  }, rows.map((rowPanels, rowIndex) => /*#__PURE__*/React.createElement("div", {
    key: "row-" + rowIndex,
    style: {
      display: 'grid',
      gap: panelGap,
      gridTemplateColumns: "repeat(" + rowPanels.length + ", minmax(0, 1fr))"
    }
  }, rowPanels.map(panel => /*#__PURE__*/React.createElement(FacetPanel, {
    key: panel.key,
    panel: panel,
    height: rowHeight,
    xAxisType: xAxisType,
    xAxisLabel: xAxisLabel,
    yAxisLabel: "",
    yDomain: yDomain,
    markerSize: markerSize,
    markerOpacity: markerOpacity,
    timeFormat: timeFormat,
    upperSpecLimit: upperSpecLimit,
    lowerSpecLimit: lowerSpecLimit,
    getColor: colorScale
  }))))))));
}