import { t } from '@superset-ui/core';
import {
  sections,
  sharedControls,
} from '@superset-ui/chart-controls';
import type { ControlPanelConfig } from '@superset-ui/chart-controls';

const controlPanel: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      tabOverride: 'data',
      controlSetRows: [
        [
          {
            name: 'x_axis',
            config: {
              ...sharedControls.x_axis,
              label: t('X-axis column'),
              description: t('Timestamp or sequence column used on the horizontal axis.'),
            },
          },
        ],
        ['time_grain_sqla'],
        [
          {
            name: 'metrics',
            config: {
              ...sharedControls.metrics,
              label: t('Y metric'),
              description: t(
                'Preferred aggregated Y metric. Leave blank and use Y column below for raw values.',
              ),
              validators: [],
            },
          },
        ],
        [
          {
            name: 'y_axis_column',
            config: {
              ...sharedControls.series,
              label: t('Y column fallback'),
              description: t(
                'Raw numeric column used when no aggregated Y metric is selected.',
              ),
              validators: [],
            },
          },
        ],
        [
          {
            name: 'facet_column',
            config: {
              ...sharedControls.series,
              label: t('Facet column'),
              description: t(
                'Categorical column that splits the chart into SPC panels such as nest, pallet, or cavity.',
              ),
            },
          },
          {
            name: 'color_column',
            config: {
              ...sharedControls.series,
              label: t('Color column'),
              clearable: true,
              default: null,
              description: t('Optional status or grouping column used to color markers.'),
              validators: [],
            },
          },
        ],
        [
          {
            name: 'tooltip_columns',
            config: {
              ...sharedControls.groupby,
              label: t('Tooltip columns'),
              description: t(
                'Optional metadata columns included in each point tooltip such as pallet or lot id.',
              ),
              default: [],
            },
          },
        ],
        ['adhoc_filters'],
        ['row_limit'],
      ],
    },
    {
      ...sections.advancedAnalyticsControls,
      tabOverride: 'data',
    },
    {
      ...sections.annotationsAndLayersControls,
      tabOverride: 'data',
    },
    {
      label: t('Display'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [
        [
          {
            name: 'chart_title',
            config: {
              type: 'TextControl',
              label: t('Chart title'),
              default: '',
              renderTrigger: true,
              description: t('Overall title shown above the facet grid.'),
            },
          },
        ],
        [
          {
            name: 'x_axis_label',
            config: {
              type: 'TextControl',
              label: t('X-axis label'),
              default: '',
              renderTrigger: true,
              description: t('Custom label applied to the x-axis in every facet panel.'),
            },
          },
          {
            name: 'y_axis_label',
            config: {
              type: 'TextControl',
              label: t('Y-axis label'),
              default: '',
              renderTrigger: true,
              description: t('Custom shared Y-axis label shown at the left of the facet grid.'),
            },
          },
        ],
        [
          {
            name: 'y_axis_label_gap',
            config: {
              type: 'TextControl',
              label: t('Y-axis label gap'),
              default: 12,
              isInt: true,
              renderTrigger: true,
              description: t('Space between Y-axis ticks/labels and the plot area.'),
            },
          },
          {
            name: 'x_axis_label_gap',
            config: {
              type: 'TextControl',
              label: t('X-axis label gap'),
              default: 10,
              isInt: true,
              renderTrigger: true,
              description: t('Space between X-axis ticks/labels and the plot area.'),
            },
          },
        ],
        [
          {
            name: 'facet_title_gap',
            config: {
              type: 'TextControl',
              label: t('Facet title gap'),
              default: 12,
              isInt: true,
              renderTrigger: true,
              description: t('Space between the facet title and the plot area.'),
            },
          },
          {
            name: 'panel_padding',
            config: {
              type: 'TextControl',
              label: t('Panel padding'),
              default: 12,
              isInt: true,
              renderTrigger: true,
              description: t('Internal padding used around each facet chart.'),
            },
          },
        ],
        [
          {
            name: 'left_outer_axis_padding',
            config: {
              type: 'TextControl',
              label: t('Left outer axis padding'),
              default: 16,
              isInt: true,
              renderTrigger: true,
              description: t(
                'Extra left padding applied only to the first facet in each row before the visible Y-axis.',
              ),
            },
          },
        ],
        [
          {
            name: 'row_gap',
            config: {
              type: 'TextControl',
              label: t('Row gap'),
              default: 16,
              isInt: true,
              renderTrigger: true,
            },
          },
          {
            name: 'column_gap',
            config: {
              type: 'TextControl',
              label: t('Column gap'),
              default: 2,
              isInt: true,
              renderTrigger: true,
            },
          },
        ],
        ['color_scheme'],
        [
          {
            name: 'show_legend',
            config: {
              type: 'CheckboxControl',
              label: t('Show legend'),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: 'enable_scroll_wheel_zoom',
            config: {
              type: 'CheckboxControl',
              label: t('Enable scroll wheel zoom'),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: 'connect_panels_within_row',
            config: {
              type: 'CheckboxControl',
              label: t('Connect panels within row'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'show_data_zoom_slider',
            config: {
              type: 'CheckboxControl',
              label: t('Show data zoom slider'),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: 'show_data_zoom_detail_text',
            config: {
              type: 'CheckboxControl',
              label: t('Show data zoom detail text'),
              default: false,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'data_zoom_gap',
            config: {
              type: 'TextControl',
              label: t('Data zoom gap'),
              default: 10,
              isInt: true,
              renderTrigger: true,
              description: t('Space between the x-axis area and the data zoom slider.'),
            },
          },
        ],
        [
          {
            name: 'time_format',
            config: {
              ...sharedControls.x_axis_time_format,
              label: t('Time format'),
              default: 'smart_date',
            },
          },
          {
            name: 'tooltip_time_format',
            config: {
              ...sharedControls.x_axis_time_format,
              label: t('Tooltip time format'),
              default: '%m-%d-%Y %I:%M:%S %p',
              description: t('Format applied to timestamp values in tooltips.'),
            },
          },
        ],
      ],
    },
    {
      label: t('SPC Limits'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [
        [
          {
            name: 'lower_spec_limit',
            config: {
              type: 'TextControl',
              label: t('Lower spec limit'),
              default: '',
              renderTrigger: true,
            },
          },
          {
            name: 'upper_spec_limit',
            config: {
              type: 'TextControl',
              label: t('Upper spec limit'),
              default: '',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'y_axis_min',
            config: {
              type: 'TextControl',
              label: t('Y-axis minimum'),
              default: '',
              renderTrigger: true,
            },
          },
          {
            name: 'y_axis_max',
            config: {
              type: 'TextControl',
              label: t('Y-axis maximum'),
              default: '',
              renderTrigger: true,
            },
          },
        ],
      ],
    },
    {
      label: t('Facet Layout'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [
        [
          {
            name: 'facet_sort_order',
            config: {
              type: 'SelectControl',
              label: t('Facet sort'),
              default: 'asc',
              clearable: false,
              renderTrigger: true,
              choices: [
                ['asc', t('Ascending')],
                ['desc', t('Descending')],
                ['custom', t('Custom')],
              ],
            },
          },
          {
            name: 'facet_sort_custom',
            config: {
              type: 'TextControl',
              label: t('Custom facet order'),
              default: '',
              renderTrigger: true,
              description: t('Comma-separated facet values used when Facet sort is Custom.'),
            },
          },
        ],
        [
          {
            name: 'max_facets',
            config: {
              type: 'TextControl',
              label: t('Maximum facets'),
              default: 28,
              isInt: true,
              renderTrigger: true,
            },
          },
          {
            name: 'max_panels_per_row',
            config: {
              type: 'TextControl',
              label: t('Maximum panels per row'),
              default: 7,
              isInt: true,
              renderTrigger: true,
              description: t('Balanced layout is enforced and the value is capped at seven.'),
            },
          },
        ],
      ],
    },
    {
      label: t('Markers'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [
        [
          {
            name: 'marker_size',
            config: {
              type: 'TextControl',
              label: t('Marker size'),
              default: 8,
              isInt: true,
              renderTrigger: true,
            },
          },
          {
            name: 'marker_opacity',
            config: {
              type: 'TextControl',
              label: t('Opacity'),
              default: 0.8,
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
};

export default controlPanel;
