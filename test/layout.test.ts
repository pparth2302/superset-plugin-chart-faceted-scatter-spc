import {
  chunkFacetValuesIntoBalancedRows,
  getBalancedFacetLayout,
  sortFacetValues,
} from '../src/layout';

describe('layout helpers', () => {
  it('balances 8 facets into two rows of four', () => {
    expect(getBalancedFacetLayout(8, 7)).toEqual({
      rows: 2,
      cols: 4,
      rowCounts: [4, 4],
      positions: [
        { index: 0, row: 0, col: 0 },
        { index: 1, row: 0, col: 1 },
        { index: 2, row: 0, col: 2 },
        { index: 3, row: 0, col: 3 },
        { index: 4, row: 1, col: 0 },
        { index: 5, row: 1, col: 1 },
        { index: 6, row: 1, col: 2 },
        { index: 7, row: 1, col: 3 },
      ],
    });
  });

  it('balances 11 facets into rows of six and five', () => {
    expect(getBalancedFacetLayout(11, 7).rowCounts).toEqual([6, 5]);
  });

  it('chunks values without exceeding the max columns', () => {
    expect(chunkFacetValuesIntoBalancedRows([1, 2, 3, 4, 5, 6, 7, 8], 7)).toEqual([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ]);
  });

  it('sorts custom facet values ahead of the remaining values', () => {
    expect(sortFacetValues(['3', '1', '5', '2', '4'], 'custom', '5,3,1')).toEqual([
      '5',
      '3',
      '1',
      '2',
      '4',
    ]);
  });
});