# Let it rain

Let it rain is a premium-feeling weather experience built as a small monorepo:

- `frontend/`: React + Vite + TypeScript + Tailwind CSS + React Query + PWA
- `backend/`: FastAPI proxy for Open-Meteo search and forecast APIs with TTL caching

The product direction follows a cinematic dark UI with glassmorphism, large hero moments, multi-section exploration, desktop install support, and a layout that can later be wrapped into a mobile shell.

## Features

- Backend-powered location autocomplete with keyboard navigation and normal copy/paste behavior
- 30 requested weather variables grouped into focused sections instead of one giant dump
- Current overview, next 24 hours, and up to 16 forecast days
- Dedicated tabs for precipitation, wind and pressure, sky and visibility, sun and radiation, and ground and soil
- FastAPI cache abstraction with in-memory TTL storage and `X-Cache: HIT/MISS`
- Last location and selected tab persistence with `localStorage`
- Desktop-installable PWA with an in-app `Install App` button
- Vercel-friendly frontend and Render-friendly backend structure

## Project Structure

```text
.
├─ backend/
│  ├─ app/
│  │  ├─ services/
│  │  ├─ cache.py
│  │  ├─ config.py
│  │  ├─ main.py
│  │  └─ models.py
│  ├─ .env.example
│  └─ requirements.txt
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ lib/
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  ├─ .env.example
│  └─ package.json
├─ render.yaml
└─ README.md
```

## Exact Weather Variables Requested From Open-Meteo

### Current / overview

`temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `is_day`, `weather_code`, `wind_speed_10m`, `wind_direction_10m`, `wind_gusts_10m`, `surface_pressure`, `pressure_msl`

### Hourly exploration

`temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `weather_code`, `wind_speed_10m`, `wind_direction_10m`, `wind_gusts_10m`, `surface_pressure`, `pressure_msl`, `precipitation`, `rain`, `showers`, `snowfall`, `precipitation_probability`, `cloud_cover`, `cloud_cover_low`, `cloud_cover_mid`, `cloud_cover_high`, `visibility`, `uv_index`, `sunshine_duration`, `direct_radiation`, `diffuse_radiation`, `soil_temperature_0cm`, `soil_moisture_0_to_1cm`

### Daily summary

`weather_code`, `temperature_2m_max`, `temperature_2m_min`, `sunrise`, `sunset`

If a provider omits a variable for a location or model, the backend returns stable payloads with missing-field lists and the UI renders those values as unavailable instead of breaking.

## Local Setup

### Recommended development workflow

```bash
pip install -r backend/requirements.txt
npm install
npm run install:frontend
npm run dev
```

This starts both apps together:

- frontend: `http://localhost:5173`
- backend: `http://127.0.0.1:8000`

The root `npm run dev` command keeps the backend on `python -m uvicorn app.main:app --reload --reload-dir app`, so Python changes are still picked up automatically while that terminal stays open.

### Existing two-terminal workflow still works

Backend:

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --reload-dir app
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Environment Notes

### Backend

Optional settings live in `backend/.env` and can be copied from `backend/.env.example`.

- `WEATHER_CORS_ORIGINS`
- `WEATHER_GEOCODING_CACHE_TTL_SECONDS`
- `WEATHER_WEATHER_CACHE_TTL_SECONDS`
- `WEATHER_REQUEST_TIMEOUT_SECONDS`

### Frontend

Optional settings live in `frontend/.env` and can be copied from `frontend/.env.example`.

- `VITE_API_BASE_URL=http://127.0.0.1:8000`

## API Surface

- `GET /health`
- `GET /search?q=del`
- `GET /weather?lat=28.6139&lon=77.209&name=New%20Delhi&admin=Delhi&country=India&timezone=Asia/Kolkata`

Responses are normalized into:

- `location`
- `current`
- `current_units`
- `hourly`
- `daily`
- `status`

## Caching

- Search suggestions are cached for 30 minutes.
- Weather responses are cached for 10 minutes.
- The cache implementation is abstracted behind `CacheBackend` in [`backend/app/cache.py`](/C:/Projects/Weather%20app/backend/app/cache.py).
- Response headers expose cache results through `X-Cache`.

## Deployment

### Deploy first

Deploy the backend first so you have the live API URL ready for the frontend environment variable.

### Render backend

Use the included `render.yaml`, or create a Render Web Service with:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

After deploy, copy the public backend URL.

### Vercel frontend

Create a Vercel project that points at `frontend/`.

- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-render-backend.onrender.com`

Then redeploy the frontend.

## What To Test Manually

1. Search typing, paste, arrow-key navigation, Enter selection, mouse selection, and Escape close behavior.
2. Weather loading for multiple cities and countries.
3. Responsive layouts on mobile, tablet, and desktop widths.
4. Tab persistence after refresh.
5. Last selected location after refresh.
6. Disabled or active `Install App` behavior in a supported Chromium browser.
7. Backend `X-Cache` headers on repeated `/search` and `/weather` requests.
8. Graceful rendering when a field is unavailable.
9. PWA install and standalone launch from desktop.

## Verification

Verified locally:

- `cd frontend && npm run build`
- `cd backend && python -m py_compile app\main.py app\cache.py app\config.py app\models.py app\services\open_meteo.py`

## Provider References

- [Open-Meteo Forecast API](https://open-meteo.com/en/docs)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
