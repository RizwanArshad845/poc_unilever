import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import { scanResponse } from './src/scanResponse.js';

// Stored in Secret Manager: `firebase functions:secrets:set GEMINI_API_KEY`.
// Bound secrets are exposed to the function as process.env.GEMINI_API_KEY.
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');

// POST /api/scan, routed here by the Hosting rewrite in firebase.json.
export const unileverScan = onRequest(
  {
    region: 'us-central1',
    secrets: [GEMINI_API_KEY],
    memory: '512MiB',
    timeoutSeconds: 60,
    maxInstances: 10, // caps cost if the demo URL gets hammered
  },
  async (req, res) => {
    res.set('Cache-Control', 'private, no-store');
    if (req.method !== 'POST') {
      res.set('Allow', 'POST').status(405).json({ error: 'Use POST.' });
      return;
    }
    const { status, body } = await scanResponse(req.body, logger);
    res.status(status).json(body);
  },
);
