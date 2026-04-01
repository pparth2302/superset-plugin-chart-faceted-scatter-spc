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
          y_axis_column: 'adhesive_od',
          facet_column: 'nest_num',
          color_column: 'status',
          tooltip_columns: ['pallet_id'],
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
    expect(props.layout.rowCounts).toEqual([2, 1]);
    expect(props.legendValues).toEqual(['Pass', 'Warn']);
    expect(props.yDomain[0]).toBeLessThanOrEqual(7);
    expect(props.yDomain[1]).toBeGreaterThanOrEqual(8);
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
});