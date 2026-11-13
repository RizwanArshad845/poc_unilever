# Lux Scan & Win (POC)

A shopper photographs their Lux shower gel. Gemini verifies the pack, and if it is genuine Lux the shopper scratches a gold card to reveal a prize.

Live: https://jaltech-unilever.web.app (Firebase project `jaltech-poc`, Hosting site `jaltech-unilever`)

## Stack

- **Vite + React 19** single-page app (`/` landing, `/scan` camera flow)
- **Cloud Function** `unileverScan` (`functions/`) calls Gemini via `@google/genai`. Firebase Hosting routes `POST /api/scan` to it. The API key lives in Secret Manager and never reaches the browser.
- `motion` for animation, `canvas-confetti` for the win moment, `lucide-react` icons

## Run locally

```bash
npm install
npm run install:functions
cp .env.example .env.local   # then add your GEMINI_API_KEY
npm run dev                  # http://localhost:5173 (the /api/scan route works locally too)
```

The camera needs HTTPS or `localhost`. To test on a phone, use the deployed site.

## Deploy to Firebase

One-time setup (project must be on the Blaze plan for Cloud Functions):

```bash
npx firebase-tools login
npx firebase-tools hosting:sites:create jaltech-unilever --project jaltech-poc
npx firebase-tools functions:secrets:set GEMINI_API_KEY --project jaltech-poc
```

Then deploy (builds the site first):

```bash
npm run deploy        # site + function
npm run deploy:web    # site only
npm run deploy:api    # function only
```

Deploys target only the `jaltech-unilever` site and the `unilever` functions codebase, so other sites in the `jaltech-poc` project (such as the game POCs at jaltech-poc.web.app) are not touched.

## Tuning the AI

- The system instruction and JSON response schema live in `functions/src/analyzeProduct.js`.
- Verdicts: `match`, `other_lux` (for example Lux bar soap), `other_unilever` (for example Dove), `not_found`.
- A win requires `verdict === "match"` and `confidence >= MATCH_MIN_CONFIDENCE` (default 0.6).
- The prize is drawn server-side so the browser cannot choose it. Prizes and codes are demo only.
- Set `GEMINI_MODEL` to override the default model.
- When a scan fails, the 502 response includes a `code` (`missing_api_key` or `gemini_error`) and Gemini's `upstream_status`.

## Files

| Path | Purpose |
| --- | --- |
| `functions/src/analyzeProduct.js` | Gemini prompt, schema, validation, prize draw |
| `functions/src/scanResponse.js` | Request handling shared by the function and the dev server |
| `functions/index.js` | Cloud Function `unileverScan` (`POST /api/scan`) |
| `firebase.json`, `.firebaserc` | Hosting site target, `/api/scan` rewrite, functions codebase |
| `vite.config.js` | Serves `/api/scan` during `npm run dev` |
| `src/pages/Landing.jsx` | Campaign landing page |
| `src/pages/Scan.jsx` | Camera, verification and reward flow |
| `src/components/ScratchCard.jsx` | Canvas scratch-off card |
| `src/components/LuxBottle.jsx` | SVG pack illustration |
