"use strict";

exports.__esModule = true;
exports.default = void 0;
var _core = require("@superset-ui/core");
var _thumbnail = _interopRequireDefault(require("./images/thumbnail.png"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = new _core.ChartMetadata({
  category: 'Comparison',
  credits: ['https://echarts.apache.org'],
  description: 'Manufacturing-style faceted SPC scatter chart with balanced multi-row panel layout, shared Y-scale, and spec limits.',
  name: 'Faceted Scatter SPC',
  tags: ['scatter', 'facet', 'spc', 'quality', 'manufacturing', 'echarts'],
  thumbnail: _thumbnail.default
});