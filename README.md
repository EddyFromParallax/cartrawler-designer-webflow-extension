# CT Translations — Webflow Designer Extension

A Webflow Designer Extension that lets content editors browse, bind, and sync translation strings directly inside the Webflow Designer.

## Panels

| Panel | Description |
|---|---|
| **Strings** | Browse and filter translation strings for a locale |
| **Bind Key** | Bind a selected translation key to the active Webflow element |
| **Status** | View translation coverage across locales |
| **Sync** | Trigger a translation sync for one or more locales |

## Prerequisites

- Node.js 24+
- This app depends on `@cartrawler/translations-core` (linked via `file:../translations-core`)

## Development

```sh
npm install
npm run dev        # starts Vite dev server on http://localhost:1334
```

Outside the Webflow Designer, the app uses mock implementations of the Webflow API and data client (`src/dev/`) so all panels are functional in a regular browser.

### Inside the Webflow Designer

1. `npm run build` — outputs to `public/`
2. In the Webflow Designer, load the extension using the manifest in `webflow.json`

## Testing

```sh
npm test           # single run
npm run test:watch # watch mode
```

Tests live next to source files (`*.test.tsx`). Uses Vitest + React Testing Library + jsdom.

## Project structure

```
src/
  main.tsx              # entry — detects Webflow Designer vs browser, wires dependencies
  App.tsx               # shell with tab navigation across panels
  webflow-bridge.ts     # thin wrapper around the Webflow Designer API
  data-client.ts        # fetches translation data from the backend
  string-filter.ts      # search/filter utility for translation strings
  types.ts              # shared TypeScript types
  constants.ts          # app-wide constants
  styles.css            # global styles
  panels/               # one component + test per panel
  dev/                  # mock implementations for local development
```
