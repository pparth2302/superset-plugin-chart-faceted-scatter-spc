import { ChartMetadata } from '@superset-ui/core';
import thumbnail from './images/thumbnail.png';

export default new ChartMetadata({
  category: 'Comparison',
  credits: ['https://echarts.apache.org'],
  description:
    'Manufacturing-style faceted SPC scatter chart with balanced multi-row panel layout, shared Y-scale, and spec limits.',
  name: 'Faceted Scatter SPC',
  tags: ['scatter', 'facet', 'spc', 'quality', 'manufacturing', 'echarts'],
  thumbnail,
});
