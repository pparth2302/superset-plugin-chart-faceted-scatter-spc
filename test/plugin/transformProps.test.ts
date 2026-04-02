import { ChartProps } from '@superset-ui/core';
import transformProps from '../../src/plugin/transformProps';

describe('transformProps', () => {
  it('builds balanced facet panels from the query result', () => {
    const props = transformProps(
      new ChartProps({
        width: 1200,
        height: 800,
        formData: {
          chart_title: 'Nest or Pallet #',
          x_axis: 'timestamp',
          x_axis_label: 'Sample Time',
          y_axis_column: 'adhesive_od',
          y_axis_label: 'Adhesive OD',
          facet_column: 'nest_num',
          color_column: 'status',
          tooltip_columns: ['pallet_id'],
          tooltip_time_format: '%m-%d-%Y %I:%M:%S %p',
          y_axis_label_gap: 14,
          x_axis_label_gap: 11,
          data_zoom_gap: 9,
          facet_title_gap: 13,
          panel_padding: 10,
          left_outer_axis_padding: 20,
          row_gap: 18,
          column_gap: 3,
          enable_scroll_wheel_zoom: true,
          show_data_zoom_slider: true,
          show_data_zoom_detail_text: false,
          connect_panels_within_row: true,
          facet_sort_order: 'asc',
          max_facets: 8,
          max_panels_per_row: 7,
          marker_size: 9,
          marker_opacity: 0.7,
          lower_spec_limit: 7,
          upper_spec_limit: 8,
        },
        queriesData: [
          {
            data: [
              {
                timestamp: '2026-03-18T08:00:00',
                nest_num: 1,
                adhesive_od: 7.18,
                status: 'Pass',
                pallet_id: 'P123',
              },
              {
                timestamp: '2026-03-18T08:01:00',
                nest_num: 2,
                adhesive_od: 7.42,
                status: 'Pass',
                pallet_id: 'P123',
              },
              {
                timestamp: '2026-03-18T08:02:00',
                nest_num: 8,
                adhesive_od: 7.35,
                status: 'Warn',
                pallet_id: 'P124',
              },
            ],
          },
        ],
      }),
    );

    expect(props.panels).toHaveLength(3);
    expect(props.panels.map(panel => panel.title)).toEqual(['1', '2', '8']);
    expect(props.layout.rowCounts).toEqual([3]);
    expect(props.legendValues).toEqual(['Pass', 'Warn']);
    expect(props.xAxisLabel).toBe('Sample Time');
    expect(props.yAxisLabel).toBe('Adhesive OD');
    expect(props.enableScrollWheelZoom).toBe(true);
    expect(props.showDataZoomSlider).toBe(true);
    expect(props.showDataZoomDetailText).toBe(false);
    expect(props.connectPanelsWithinRow).toBe(true);
    expect(props.yAxisLabelGap).toBe(14);
    expect(props.xAxisLabelGap).toBe(11);
    expect(props.dataZoomGap).toBe(9);
    expect(props.facetTitleGap).toBe(13);
    expect(props.panelPadding).toBe(10);
    expect(props.leftOuterAxisPadding).toBe(20);
    expect(props.rowGap).toBe(18);
    expect(props.columnGap).toBe(3);
    expect(props.panels[0].points[0].tooltipValues[0]).toEqual({
      label: 'Sample Time',
      value: '03-18-2026 08:00:00 AM',
    });
    expect(props.yDomain[0]).toBeLessThanOrEqual(7);
    expect(props.yDomain[1]).toBeGreaterThanOrEqual(8);
    expect(props.xAxisType).toBe('time');
  });

  it('uses metric labels when a metric is selected for the y-axis', () => {
    const props = transformProps(
      new ChartProps({
        width: 900,
        height: 600,
        formData: {
          x_axis: 'timestamp',
          metrics: [{ label: 'AVG(adhesive_od)' }],
          facet_column: 'nest_num',
        },
        queriesData: [
          {
            data: [
              {
                timestamp: '2026-03-18T08:00:00',
                nest_num: 1,
                'AVG(adhesive_od)': 7.18,
              },
            ],
          },
        ],
      }),
    );

    expect(props.yAxisLabel).toBe('AVG(adhesive_od)');
    expect(props.panels[0].points[0].y).toBe(7.18);
  });

  it('caps panels per row at seven and honors custom facet ordering', () => {
    const props = transformProps(
      new ChartProps({
        width: 1200,
        height: 800,
        formData: {
          x_axis: 'timestamp',
          y_axis_column: 'adhesive_od',
          facet_column: 'nest_num',
          facet_sort_order: 'custom',
          facet_sort_custom: '3, 1',
          max_panels_per_row: 99,
        },
        queriesData: [
          {
            data: [
              { timestamp: '2026-03-18T08:00:00', nest_num: 1, adhesive_od: 7.18 },
              { timestamp: '2026-03-18T08:01:00', nest_num: 2, adhesive_od: 7.42 },
              { timestamp: '2026-03-18T08:02:00', nest_num: 3, adhesive_od: 7.35 },
            ],
          },
        ],
      }),
    );

    expect(props.panels.map(panel => panel.title)).toEqual(['3', '1', '2']);
    expect(props.layout.cols).toBeLessThanOrEqual(7);
  });
});
