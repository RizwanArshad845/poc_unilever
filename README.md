# Lux Scan & Win (POC)

A shopper photographs their Lux shower gel. Gemini verifies the pack, and if it is genuine Lux the shopper scratches a gold card to reveal a prize.

## Stack

- **Vite + React 19** single-page app (`/` landing, `/scan` camera flow)
- **Vercel Function** `api/scan.js` calls Gemini via `@google/genai`. The API key stays server-side.
- `motion` for animation, `canvas-confetti` for the win moment, `lucide-react` icons, `@vercel/analytics`

## Run locally

```bash
npm install
cp .env.example .env.local   # then add your GEMINI_API_KEY
npm run dev                  # http://localhost:5173 (the /api/scan route works locally too)
```

The camera needs HTTPS or `localhost`. To test on a phone, deploy a preview to Vercel or use a tunnel.

## Deploy to Vercel

1. Push this folder to a Git repo and import it at vercel.com/new (framework: Vite, auto-detected), **or** run `npx vercel`.
2. Add `GEMINI_API_KEY` in Project Settings > Environment Variables (or `vercel env add GEMINI_API_KEY`).
3. Redeploy.

## Tuning the AI

- The system instruction and JSON response schema live in `server/analyzeProduct.js`.
- Verdicts: `match`, `other_lux` (for example Lux bar soap), `other_unilever` (for example Dove), `not_found`.
- A win requires `verdict === "match"` and `confidence >= MATCH_MIN_CONFIDENCE` (default 0.6).
- The prize is drawn server-side so the browser cannot choose it. Prizes and codes are demo only.
- Set `GEMINI_MODEL` to override the default model.

## Files

| Path | Purpose |
| --- | --- |
| `server/analyzeProduct.js` | Gemini prompt, schema, validation, prize draw |
| `api/scan.js` | Vercel Function wrapper (`POST /api/scan`) |
| `vite.config.js` | Serves `/api/scan` during `npm run dev` |
| `src/pages/Landing.jsx` | Campaign landing page |
| `src/pages/Scan.jsx` | Camera, verification and reward flow |
| `src/components/ScratchCard.jsx` | Canvas scratch-off card |
| `src/components/LuxBottle.jsx` | SVG pack illustration (replace with real photography) |
