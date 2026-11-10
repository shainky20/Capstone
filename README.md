# SupplyChain Copilot

React + Vite frontend with an Express API and a Python Random Forest prediction
script. The root `package.json` intentionally manages both the frontend and
backend Node dependencies.

## Local development

1. Install Node dependencies with `npm ci`.
2. Set `VITE_API_URL=http://localhost:5000` and a restricted
   `VITE_GOOGLE_MAPS_API_KEY` in the root `.env`.
3. Set `GEMINI_API_KEY` in `backend/.env` (or in the backend process
   environment). Never use a `VITE_` name for Gemini credentials.
4. Install the Python dependencies with
   `python -m pip install -r backend/requirements.txt`.
5. Run the API with `npm start` and the frontend in another terminal with
   `npm run dev`.

The prediction endpoint accepts the same feature names used to train the saved
model: `origin`, `destination`, `rain_mm`, `wind_speed`, `traffic_index`,
`distance_km`, `priority`, and `historical_delay`.

## Deployment

- **Vercel:** deploy the repository root as a Vite project. Set
  `VITE_API_URL` to the Render API URL and set
  `VITE_GOOGLE_MAPS_API_KEY` to a browser key restricted by allowed referrers
  and enabled Maps APIs. `vercel.json` provides SPA route fallback.
- **Render:** deploy the root `render.yaml` Blueprint. It builds the Dockerfile
  with Node and Python in one service. Configure `GEMINI_API_KEY` and
  `FRONTEND_URLS` in Render; `FRONTEND_URLS` should contain the deployed
  frontend origins, comma-separated if needed.

The Render Blueprint uses the free plan as a starting point; free services may
sleep when idle and are not suitable for latency-sensitive always-on hosting.
Select an appropriate plan for production use.

The model file is loaded from the repository root and is not retrained during
API startup. `train_model.py` writes to that same location only when explicitly
run.
