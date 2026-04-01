import {
  chunkFacetValuesIntoBalancedRows,
  getBalancedFacetLayout,
  sortFacetValues,
} from '../src/layout';

describe('layout helpers', () => {
  it('balances rows without exceeding the max columns', () => {
    expect(chunkFacetValuesIntoBalancedRows([1, 2, 3, 4, 5, 6, 7, 8], 7)).toEqual([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ]);
    expect(getBalancedFacetLayout(11, 7).rowCounts).toEqual([6, 5]);
    expect(getBalancedFacetLayout(15, 7).rowCounts).toEqual([5, 5, 5]);
  });

  it('sorts facet values numerically and honors custom order', () => {
    expect(sortFacetValues(['10', '2', '1'])).toEqual(['1', '2', '10']);
    expect(sortFacetValues(['B', 'A', 'C'], 'custom', 'C, A')).toEqual([
      'C',
      'A',
      'B',
    ]);
  });
});
