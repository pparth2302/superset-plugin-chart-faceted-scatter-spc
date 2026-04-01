"use strict";

exports.__esModule = true;
exports.default = void 0;
var _core = require("@superset-ui/core");
var _chartControls = require("@superset-ui/chart-controls");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var controlPanel = {
  controlPanelSections: [{
    label: (0, _core.t)('Query'),
    expanded: true,
    tabOverride: 'data',
    controlSetRows: [[{
      name: 'x_axis',
      config: _extends({}, _chartControls.sharedControls.x_axis, {
        label: (0, _core.t)('X-axis column'),
        description: (0, _core.t)('Timestamp or sequence column used on the horizontal axis.')
      })
    }], ['time_grain_sqla'], [{
      name: 'metrics',
      config: _extends({}, _chartControls.sharedControls.metrics, {
        label: (0, _core.t)('Y metric'),
        description: (0, _core.t)('Preferred aggregated Y metric. Leave blank and use Y column below for raw values.'),
        validators: []
      })
    }], [{
      name: 'y_axis_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Y column fallback'),
        description: (0, _core.t)('Raw numeric column used when no aggregated Y metric is selected.'),
        validators: []
      })
    }], [{
      name: 'facet_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Facet column'),
        description: (0, _core.t)('Categorical column that splits the chart into SPC panels such as nest, pallet, or cavity.')
      })
    }, {
      name: 'color_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Color column'),
        clearable: true,
        default: null,
        description: (0, _core.t)('Optional status or grouping column used to color markers.'),
        validators: []
      })
    }], [{
      name: 'tooltip_columns',
      config: _extends({}, _chartControls.sharedControls.groupby, {
        label: (0, _core.t)('Tooltip columns'),
        description: (0, _core.t)('Optional metadata columns included in each point tooltip such as pallet or lot id.'),
        default: []
      })
    }], ['adhoc_filters'], ['row_limit']]
  }, _extends({}, _chartControls.sections.advancedAnalyticsControls, {
    tabOverride: 'data'
  }), _extends({}, _chartControls.sections.annotationsAndLayersControls, {
    tabOverride: 'data'
  }), {
    label: (0, _core.t)('Chart'),
    expanded: true,
    tabOverride: 'customize',
    controlSetRows: [[{
      name: 'chart_title',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Chart title'),
        default: '',
        renderTrigger: true,
        description: (0, _core.t)('Overall title shown above the facet grid.')
      }
    }], ['color_scheme'], [{
      name: 'show_legend',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show legend'),
        default: true,
        renderTrigger: true
      }
    }, {
      name: 'time_format',
      config: _extends({}, _chartControls.sharedControls.x_axis_time_format, {
        label: (0, _core.t)('Time format'),
        default: 'smart_date'
      })
    }]]
  }, {
    label: (0, _core.t)('SPC Limits'),
    expanded: true,
    tabOverride: 'customize',
    controlSetRows: [[{
      name: 'lower_spec_limit',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Lower spec limit'),
        default: '',
        renderTrigger: true
      }
    }, {
      name: 'upper_spec_limit',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Upper spec limit'),
        default: '',
        renderTrigger: true
      }
    }], [{
      name: 'y_axis_min',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Y-axis minimum'),
        default: '',
        renderTrigger: true
      }
    }, {
      name: 'y_axis_max',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Y-axis maximum'),
        default: '',
        renderTrigger: true
      }
    }]]
  }, {
    label: (0, _core.t)('Facet Layout'),
    expanded: true,
    tabOverride: 'customize',
    controlSetRows: [[{
      name: 'facet_sort_order',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Facet sort'),
        default: 'asc',
        clearable: false,
        renderTrigger: true,
        choices: [['asc', (0, _core.t)('Ascending')], ['desc', (0, _core.t)('Descending')], ['custom', (0, _core.t)('Custom')]]
      }
    }, {
      name: 'facet_sort_custom',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Custom facet order'),
        default: '',
        renderTrigger: true,
        description: (0, _core.t)('Comma-separated facet values used when Facet sort is Custom.')
      }
    }], [{
      name: 'max_facets',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Maximum facets'),
        default: 28,
        isInt: true,
        renderTrigger: true
      }
    }, {
      name: 'max_panels_per_row',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Maximum panels per row'),
        default: 7,
        isInt: true,
        renderTrigger: true,
        description: (0, _core.t)('Balanced layout is enforced and the value is capped at seven.')
      }
    }], [{
      name: 'panel_gap',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Panel gap'),
        default: 12,
        isInt: true,
        renderTrigger: true
      }
    }]]
  }, {
    label: (0, _core.t)('Markers'),
    expanded: true,
    tabOverride: 'customize',
    controlSetRows: [[{
      name: 'marker_size',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Marker size'),
        default: 8,
        isInt: true,
        renderTrigger: true
      }
    }, {
      name: 'marker_opacity',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Opacity'),
        default: 0.8,
        renderTrigger: true
      }
    }]]
  }]
};
var _default = exports.default = controlPanel;