# superset-plugin-chart-faceted-scatter-spc

`superset-plugin-chart-faceted-scatter-spc` is an Apache Superset 6.0.0 chart plugin for manufacturing-style SPC scatter dashboards. It renders one scatter panel per facet value, keeps a shared Y-axis scale, and balances panels into multiple rows with a configurable maximum number of panels per row.

## Folder Structure

```text
superset-plugin-chart-faceted-scatter-spc/
  package.json
  babel.config.js
  babel.config.jest.js
  jest.config.js
  tsconfig.json
  scripts/
    clean.mjs
    run-babel-esm.mjs
  src/
    index.ts
    metadata.ts
    layout.ts
    FacetPanel.tsx
    FacetedScatterSpcChart.tsx
    types.ts
    plugin/
      index.ts
      buildQuery.ts
      controlPanel.ts
      transformProps.ts
  test/
    index.test.ts
    layout.test.ts
    plugin/
      buildQuery.test.ts
      transformProps.test.ts
```

## Install Commands

From the plugin package:

```bash
cd superset-plugin-chart-faceted-scatter-spc
npm install
npm run build
```

To install the built plugin into Superset frontend from a local tarball:

```bash
cd superset-plugin-chart-faceted-scatter-spc
npm pack

cd /path/to/superset/superset-frontend
npm install /absolute/path/to/superset-plugin-chart-faceted-scatter-spc/superset-plugin-chart-faceted-scatter-spc-0.1.0.tgz --save-exact
```

## Superset 6 Frontend Registration

Register the plugin in Superset frontend, for example in `src/visualizations/presets/MainPreset.js`:

```js
import { SupersetPluginChartFacetedScatterSpc } from 'superset-plugin-chart-faceted-scatter-spc';

new SupersetPluginChartFacetedScatterSpc()
  .configure({ key: 'superset-plugin-chart-faceted-scatter-spc' })
  .register();
```

Then rebuild Superset frontend assets:

```bash
cd /path/to/superset/superset-frontend
npm install
npm run build
```

## Control Summary

- `X-axis column`: timestamp or ordered column
- `Y-axis metric`: aggregated Y value
- `Y-axis raw column`: raw numeric Y field if you do not want a metric
- `Facet column`: nest, pallet, cavity, lane, station, or similar
- `Color / group column`: optional series coloring
- `Tooltip columns`: optional metadata fields in tooltip
- `Chart title`
- `Upper spec limit` / `Lower spec limit`
- `Marker size` / `Opacity`
- `Show legend`
- `Time format`
- `Y-axis minimum` / `Y-axis maximum`
- `Facet sort order` / `Custom facet order`
- `Maximum facets`
- `Maximum panels per row` with default `7`
- `Panel gap`

## Notes

- The layout helper prefers balanced rows and never exceeds the configured maximum columns.
- All facet panels share the same Y-axis scale.
- Each panel gets its own local X-axis.
- Spec limits are drawn as red lines with a shaded green band between them.