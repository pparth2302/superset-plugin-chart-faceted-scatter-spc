# superset-plugin-chart-faceted-scatter-spc

Apache Superset chart plugin for a faceted manufacturing SPC scatter chart built with React, TypeScript, and ECharts.

## Folder structure

```text
src/
  FacetedScatterSpcChart.tsx
  FacetPanel.tsx
  index.ts
  layout.ts
  metadata.ts
  types.ts
  utils.ts
  plugin/
    buildQuery.ts
    controlPanel.ts
    index.ts
    transformProps.ts
test/
  layout.test.ts
  plugin/
    buildQuery.test.ts
    transformProps.test.ts
```

## Install

From this package directory:

```powershell
npm install
npm run build
```

From your Superset frontend directory:

```powershell
npm install --save "C:\Users\ppatel2\Desktop\projects\superset-plugins\superset-plugin-chart-faceted-scatter-spc"
```

## Register in Superset 6 frontend

Edit `superset-frontend/src/visualizations/presets/MainPreset.ts`.

Add the import:

```ts
import FacetedScatterSpcChartPlugin from 'superset-plugin-chart-faceted-scatter-spc';
```

Add the plugin inside the `plugins:` array in `MainPreset`:

```ts
new FacetedScatterSpcChartPlugin().configure({
  key: 'faceted_scatter_spc',
}),
```

## Rebuild Superset frontend

```powershell
cd <superset-root>\superset-frontend
npm install
npm run build
```

For local development with watch mode in the plugin package:

```powershell
cd C:\Users\ppatel2\Desktop\projects\superset-plugins\superset-plugin-chart-faceted-scatter-spc
npm run dev
```

Then rebuild or run the Superset frontend dev server separately.
