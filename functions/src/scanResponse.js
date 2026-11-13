import { analyzeProduct, InputError } from './analyzeProduct.js';

/**
 * Framework-free core of POST /api/scan: takes the parsed JSON body, returns { status, body }.
 * Used by the Cloud Function (functions/index.js) and the Vite dev server (vite.config.js).
 */
export async function scanResponse(payload, log = console) {
  if (!payload || typeof payload !== 'object') {
    return { status: 400, body: { error: 'Send the photo as JSON.' } };
  }

  try {
    return { status: 200, body: await analyzeProduct(payload) };
  } catch (err) {
    if (err instanceof InputError) {
      return { status: 400, body: { error: err.message } };
    }
    log.error('[scan] analysis failed', err);
    // Non-secret diagnostics: upstream_status is Gemini's HTTP status
    // (400/403 = bad key, 404 = unknown model, 429 = quota).
    return {
      status: 502,
      body: {
        error: 'We could not check your photo right now. Try again in a moment.',
        code: err.code === 'missing_api_key' ? 'missing_api_key' : 'gemini_error',
        upstream_status: typeof err.status === 'number' ? err.status : undefined,
      },
    };
  }
}
