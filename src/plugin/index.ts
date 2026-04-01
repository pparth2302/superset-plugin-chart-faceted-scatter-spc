import { ChartPlugin } from '@superset-ui/core';
import metadata from '../metadata';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';

export default class FacetedScatterSpcChartPlugin extends ChartPlugin {
  constructor() {
    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('../FacetedScatterSpcChart'),
      metadata,
      transformProps,
    });
  }
}