import { t } from '@superset-ui/core';
import {
  ControlPanelConfig,
  sections,
  sharedControls,
} from '@superset-ui/chart-controls';

function mapDatasourceColumnsToChoices(state: Record<string, any>) {
  const columns = state.datasource?.columns || [];

  return {
    choices: columns.map((column: Record<string, any>) => [
      column.column_name,
      column.verbose_name || column.column_name,
    ]),
  };
}

const config: ControlPanelConfig = {
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
              type: 'SelectControl',
              freeForm: false,
              clearable: false,
              label: t('X-axis column'),
              renderTrigger: true,
              mapStateToProps: mapDatasourceColumnsToChoices,
              description: t('Timestamp or ordered field plotted on the X-axis of each facet.'),
            },
          },
        ],
        [
          {
            name: 'metrics',
            config: {
              ...sharedControls.metrics,
              label: t('Y-axis metric'),
              description: t('Aggregated Y value. Leave empty if you want to use a raw numeric column.'),
            },
          },
        ],
        [
          {
            name: 'y_axis_column',
            config: {
              type: 'SelectControl',
              freeForm: false,
              clearable: true,
              label: t('Y-axis raw column'),
              renderTrigger: true,
              mapStateToProps: mapDatasourceColumnsToChoices,
              description: t('Optional raw numeric column for point-level scatter when no metric is selected.'),
            },
          },
        ],
        [
          {
            name: 'facet_column',
            config: {
              type: 'SelectControl',
              freeForm: false,
              clearable: false,
              label: t('Facet column'),
              renderTrigger: true,
              mapStateToProps: mapDatasourceColumnsToChoices,
              description: t('Categorical field that determines one panel per distinct value.'),
            },
          },
        ],
        [
          {
            name: 'color_column',
            config: {
              type: 'SelectControl',
              freeForm: false,
              clearable: true,
              label: t('Color / group column'),
              renderTrigger: true,
              mapStateToProps: mapDatasourceColumnsToChoices,
              description: t('Optional field used to color scatter markers and build the legend.'),
            },
          },
        ],
        [
          {
            name: 'tooltip_columns',
            config: {
              type: 'SelectControl',
              freeForm: false,
              multi: true,
              clearable: true,
              label: t('Tooltip columns'),
              renderTrigger: true,
              mapStateToProps: mapDatasourceColumnsToChoices,
              description: t('Optional metadata columns appended to the tooltip for each point.'),
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
      label: t('Chart'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [
        [
          {
            name: 'chart_title',
            config: {
              type: 'TextControl',
              label: t('Chart title'),
              default: 'Nest or Pallet #',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'upper_spec_limit',
            config: {
              type: 'TextControl',
              label: t('Upper spec limit'),
              isFloat: true,
              default: '',
              renderTrigger: true,
            },
          },
          {
            name: 'lower_spec_limit',
            config: {
              type: 'TextControl',
              label: t('Lower spec limit'),
              isFloat: true,
              default: '',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'marker_size',
            config: {
              type: 'TextControl',
              label: t('Marker size'),
              isInt: true,
              default: 8,
              renderTrigger: true,
            },
          },
          {
            name: 'marker_opacity',
            config: {
              type: 'TextControl',
              label: t('Opacity'),
              isFloat: true,
              default: 0.85,
              renderTrigger: true,
            },
          },
        ],
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
            name: 'color_scheme',
            config: {
              type: 'TextControl',
              label: t('Color scheme'),
              default: 'supersetColors',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'time_format',
            config: {
              type: 'TextControl',
              label: t('Time format'),
              default: 'smart_date',
              renderTrigger: true,
              description: t('Formatter key passed to Superset time formatting helpers.'),
            },
          },
        ],
        [
          {
            name: 'y_axis_min',
            config: {
              type: 'TextControl',
              label: t('Y-axis minimum'),
              isFloat: true,
              default: '',
              renderTrigger: true,
            },
          },
          {
            name: 'y_axis_max',
            config: {
              type: 'TextControl',
              label: t('Y-axis maximum'),
              isFloat: true,
              default: '',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'facet_sort_order',
            config: {
              type: 'SelectControl',
              clearable: false,
              label: t('Facet sort order'),
              default: 'asc',
              renderTrigger: true,
              choices: [
                ['asc', t('Ascending')],
                ['desc', t('Descending')],
                ['custom', t('Custom order')],
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
              description: t('Comma-separated facet values, for example 1,2,3,4,5,6,7.'),
            },
          },
        ],
        [
          {
            name: 'max_facets',
            config: {
              type: 'TextControl',
              label: t('Maximum facets'),
              isInt: true,
              default: 28,
              renderTrigger: true,
            },
          },
          {
            name: 'max_panels_per_row',
            config: {
              type: 'TextControl',
              label: t('Maximum panels per row'),
              isInt: true,
              default: 7,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'panel_gap',
            config: {
              type: 'TextControl',
              label: t('Panel gap'),
              isInt: true,
              default: 16,
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
};

export default config;