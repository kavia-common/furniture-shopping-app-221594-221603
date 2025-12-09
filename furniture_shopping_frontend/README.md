# Furniture Shopping Frontend (LightningJS)

A simple furniture shopping demo built with LightningJS (Blits). It showcases:
- Home page with product grid
- Product detail view
- Cart view with quantities and removal
- Checkout modal with mock order placement
- Global store for state management
- Routing with dynamic product id
- Ocean Professional theme styling

## Environment

These variables are optional. If not set, the app will use local mock data:
- VITE_API_BASE
- VITE_BACKEND_URL

Other envs used by the container:
- VITE_FRONTEND_URL, VITE_WS_URL, VITE_NODE_ENV, VITE_NEXT_TELEMETRY_DISABLED, VITE_ENABLE_SOURCE_MAPS, VITE_PORT, VITE_TRUST_PROXY, VITE_LOG_LEVEL, VITE_HEALTHCHECK_PATH, VITE_FEATURE_FLAGS, VITE_EXPERIMENTS_ENABLED

## Assets

Place product images under `public/assets/furniture/`:
- sofa1.jpg
- chair1.jpg
- table1.jpg
- bookshelf1.jpg
- dining1.jpg
- lamp1.jpg

Update `src/data/mockData.js` if you change filenames.

## Scripts

Install dependencies:
```sh
npm install
```

Run in development:
```sh
npm run dev
```

Build for production:
```sh
npm run build
```

## Tech

- LightningJS v3 (Blits) with WebGL rendering
- Vite for development/build
- Router-based navigation and a simple global store
