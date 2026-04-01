import buildQuery from '../../src/plugin/buildQuery';

describe('buildQuery', () => {
  it('requests the shared facet columns and metric', () => {
    const queryContext = buildQuery({
      x_axis: 'timestamp',
      facet_column: 'nest_num',
      color_column: 'status',
      tooltip_columns: ['pallet_id'],
      metrics: [{ label: 'AVG(adhesive_od)' }],
      row_limit: 2500,
    } as any);

    expect(queryContext.queries[0]).toMatchObject({
      columns: ['timestamp', 'nest_num', 'status', 'pallet_id'],
      metrics: [{ label: 'AVG(adhesive_od)' }],
      row_limit: 2500,
    });
  });

  it('falls back to a raw y-axis column when no metric is supplied', () => {
    const queryContext = buildQuery({
      x_axis: 'timestamp',
      facet_column: 'nest_num',
      y_axis_column: 'adhesive_od',
    } as any);

    expect(queryContext.queries[0].columns).toEqual([
      'timestamp',
      'nest_num',
      'adhesive_od',
    ]);
    expect(queryContext.queries[0].metrics).toEqual([]);
  });
});