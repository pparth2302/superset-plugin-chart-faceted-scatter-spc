"use strict";

exports.__esModule = true;
exports.default = transformProps;
var _core = require("@superset-ui/core");
var _layout = require("../layout");
var _utils = require("../utils");
function inferXAxisType(xAxisLabel, formData, data) {
  var _formData$temporal_co;
  if ((_formData$temporal_co = formData.temporal_columns_lookup) != null && _formData$temporal_co[xAxisLabel]) {
    return 'time';
  }
  var sampleValues = data.map(row => row[xAxisLabel]).filter(value => value !== null && typeof value !== 'undefined').slice(0, 20);
  if (sampleValues.length && sampleValues.every(value => {
    if (value instanceof Date) {
      return true;
    }
    if (typeof value === 'number') {
      return value > 100000000000;
    }
    return !Number.isNaN(Date.parse(String(value)));
  })) {
    return 'time';
  }
  if (sampleValues.length && sampleValues.every(value => {
    var numeric = Number(value);
    return Number.isFinite(numeric);
  })) {
    return 'value';
  }
  return 'category';
}
function computeYDomain(values, _ref) {
  var {
    userMin,
    userMax,
    lowerSpecLimit,
    upperSpecLimit
  } = _ref;
  var observed = [...values];
  if (lowerSpecLimit !== null) {
    observed.push(lowerSpecLimit);
  }
  if (upperSpecLimit !== null) {
    observed.push(upperSpecLimit);
  }
  var fallbackMin = observed.length ? Math.min(...observed) : 0;
  var fallbackMax = observed.length ? Math.max(...observed) : 1;
  var min = userMin != null ? userMin : fallbackMin;
  var max = userMax != null ? userMax : fallbackMax;
  if (min > max) {
    [min, max] = [max, min];
  }
  if (userMin === null || userMax === null) {
    var span = max - min;
    var padding = span === 0 ? Math.max(Math.abs(max) * 0.05, 1) : span * 0.05;
    if (userMin === null) {
      min -= padding;
    }
    if (userMax === null) {
      max += padding;
    }
  }
  if (min === max) {
    var _padding = Math.max(Math.abs(max) * 0.05, 1);
    min -= _padding;
    max += _padding;
  }
  return [min, max];
}
function formatTemporalValue(value, formatter) {
  if (value instanceof Date) {
    return formatter(value);
  }
  if (typeof value === 'number') {
    return formatter(value);
  }
  var rawValue = String(value);
  var normalizedValue = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(rawValue) ? rawValue + "Z" : rawValue;
  var parsed = Date.parse(normalizedValue);
  return Number.isNaN(parsed) ? value : formatter(parsed);
}
function buildLegendValues(panels) {
  return Array.from(new Set(panels.flatMap(panel => panel.points.map(point => point.colorValue).filter(value => Boolean(value)))));
}
function transformProps(chartProps) {
  var _queriesData$, _getColumnLabel, _rawFormData$x_axis_l, _rawFormData$y_axis_l, _getColumnLabel2, _parseOptionalNumber, _rawFormData$tooltip_, _rawFormData$facet_so, _rawFormData$chart_ti, _rawFormData$color_sc, _rawFormData$show_leg, _rawFormData$show_dat, _rawFormData$time_for;
  var {
    width,
    height,
    queriesData,
    formData
  } = chartProps;
  var rawFormData = chartProps.rawFormData || formData;
  var data = ((_queriesData$ = queriesData[0]) == null ? void 0 : _queriesData$.data) || [];
  var metricLabels = (0, _core.ensureIsArray)(rawFormData.metrics).filter(Boolean).map(metric => (0, _core.getMetricLabel)(metric)).filter(Boolean);
  var xAxisLabel = (_getColumnLabel = (0, _utils.getColumnLabel)(rawFormData.x_axis)) != null ? _getColumnLabel : 'timestamp';
  var resolvedXAxisLabel = ((_rawFormData$x_axis_l = rawFormData.x_axis_label) == null ? void 0 : _rawFormData$x_axis_l.trim()) || xAxisLabel;
  var yAxisLabel = ((_rawFormData$y_axis_l = rawFormData.y_axis_label) == null ? void 0 : _rawFormData$y_axis_l.trim()) || metricLabels[0] || (0, _utils.getColumnLabel)(rawFormData.y_axis_column) || 'value';
  var facetColumnLabel = (_getColumnLabel2 = (0, _utils.getColumnLabel)(rawFormData.facet_column)) != null ? _getColumnLabel2 : 'facet_value';
  var colorColumnLabel = (0, _utils.getColumnLabel)(rawFormData.color_column);
  var tooltipColumnLabels = (0, _core.ensureIsArray)(rawFormData.tooltip_columns).map(column => (0, _utils.getColumnLabel)(column)).filter(value => Boolean(value));
  var maxFacets = (0, _utils.parsePositiveInteger)(rawFormData.max_facets, 28);
  var maxPanelsPerRow = (0, _utils.parsePositiveInteger)(rawFormData.max_panels_per_row, 7, {
    max: 7
  });
  var markerSize = (0, _utils.parsePositiveInteger)(rawFormData.marker_size, 8);
  var markerOpacity = Math.max(0.1, Math.min(1, (_parseOptionalNumber = (0, _utils.parseOptionalNumber)(rawFormData.marker_opacity, 0.8)) != null ? _parseOptionalNumber : 0.8));
  var lowerSpecLimit = (0, _utils.parseOptionalNumber)(rawFormData.lower_spec_limit);
  var upperSpecLimit = (0, _utils.parseOptionalNumber)(rawFormData.upper_spec_limit);
  var yAxisMin = (0, _utils.parseOptionalNumber)(rawFormData.y_axis_min);
  var yAxisMax = (0, _utils.parseOptionalNumber)(rawFormData.y_axis_max);
  var xAxisType = inferXAxisType(xAxisLabel, rawFormData, data);
  var tooltipTimeFormat = (_rawFormData$tooltip_ = rawFormData.tooltip_time_format) != null ? _rawFormData$tooltip_ : '%m-%d-%Y %I:%M:%S %p';
  var tooltipTimeFormatter = (0, _core.getTimeFormatter)(tooltipTimeFormat);
  var sortedFacetValues = (0, _layout.sortFacetValues)(data.map(row => row[facetColumnLabel]), (_rawFormData$facet_so = rawFormData.facet_sort_order) != null ? _rawFormData$facet_so : 'asc', rawFormData.facet_sort_custom).slice(0, maxFacets);
  var panels = sortedFacetValues.map(facetValue => {
    var points = data.reduce((accumulator, row) => {
      var _ref2, _metricLabels$;
      if (String(row[facetColumnLabel]) !== String(facetValue)) {
        return accumulator;
      }
      var yFieldKey = (_ref2 = (_metricLabels$ = metricLabels[0]) != null ? _metricLabels$ : (0, _utils.getColumnLabel)(rawFormData.y_axis_column)) != null ? _ref2 : 'value';
      var yValue = Number(row[yFieldKey]);
      if (!Number.isFinite(yValue)) {
        return accumulator;
      }
      var formatTooltipValue = (label, value) => {
        var _rawFormData$temporal;
        return xAxisType === 'time' && (label === xAxisLabel || (_rawFormData$temporal = rawFormData.temporal_columns_lookup) != null && _rawFormData$temporal[label]) ? formatTemporalValue(value, tooltipTimeFormatter) : value;
      };
      accumulator.push({
        x: row[xAxisLabel],
        y: yValue,
        facetValue,
        colorValue: colorColumnLabel && row[colorColumnLabel] != null ? String(row[colorColumnLabel]) : undefined,
        tooltipValues: [{
          label: resolvedXAxisLabel,
          value: formatTooltipValue(xAxisLabel, row[xAxisLabel])
        }, {
          label: facetColumnLabel,
          value: facetValue
        }, {
          label: yAxisLabel,
          value: row[yFieldKey]
        }, ...(colorColumnLabel && row[colorColumnLabel] != null ? [{
          label: colorColumnLabel,
          value: row[colorColumnLabel]
        }] : []), ...tooltipColumnLabels.filter(label => ![xAxisLabel, facetColumnLabel, yFieldKey, colorColumnLabel].includes(label)).map(label => ({
          label,
          value: formatTooltipValue(label, row[label])
        }))],
        row
      });
      return accumulator;
    }, []);
    return {
      key: (0, _utils.stringifyFacetValue)(facetValue),
      title: (0, _utils.stringifyFacetValue)(facetValue),
      facetValue,
      points
    };
  }).filter(panel => panel.points.length);
  var yValues = panels.flatMap(panel => panel.points.map(point => point.y));
  return {
    width,
    height,
    chartTitle: (_rawFormData$chart_ti = rawFormData.chart_title) != null ? _rawFormData$chart_ti : '',
    xAxisLabel: resolvedXAxisLabel,
    yAxisLabel,
    facetColumnLabel,
    colorColumnLabel,
    tooltipColumnLabels,
    panels,
    layout: (0, _layout.getBalancedFacetLayout)(panels.length, maxPanelsPerRow),
    legendValues: buildLegendValues(panels),
    colorScheme: (_rawFormData$color_sc = rawFormData.color_scheme) != null ? _rawFormData$color_sc : 'supersetColors',
    markerSize,
    markerOpacity,
    showLegend: (_rawFormData$show_leg = rawFormData.show_legend) != null ? _rawFormData$show_leg : true,
    showDataZoom: (_rawFormData$show_dat = rawFormData.show_data_zoom) != null ? _rawFormData$show_dat : true,
    timeFormat: (_rawFormData$time_for = rawFormData.time_format) != null ? _rawFormData$time_for : 'smart_date',
    tooltipTimeFormat,
    yDomain: computeYDomain(yValues, {
      userMin: yAxisMin,
      userMax: yAxisMax,
      lowerSpecLimit,
      upperSpecLimit
    }),
    upperSpecLimit,
    lowerSpecLimit,
    panelGap: (0, _utils.parsePositiveInteger)(rawFormData.panel_gap, 12),
    xAxisType
  };
}