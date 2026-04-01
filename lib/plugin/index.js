"use strict";

exports.__esModule = true;
exports.default = void 0;
var _core = require("@superset-ui/core");
var _metadata = _interopRequireDefault(require("../metadata"));
var _buildQuery = _interopRequireDefault(require("./buildQuery"));
var _controlPanel = _interopRequireDefault(require("./controlPanel"));
var _transformProps = _interopRequireDefault(require("./transformProps"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
class FacetedScatterSpcChartPlugin extends _core.ChartPlugin {
  constructor() {
    super({
      buildQuery: _buildQuery.default,
      controlPanel: _controlPanel.default,
      loadChart: () => Promise.resolve().then(() => _interopRequireWildcard(require('../FacetedScatterSpcChart'))),
      metadata: _metadata.default,
      transformProps: _transformProps.default
    });
  }
}
exports.default = FacetedScatterSpcChartPlugin;