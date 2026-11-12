import { analyzeProduct, InputError } from '../server/analyzeProduct.js';

// Vercel Function (Node.js runtime, Web Request/Response signature).
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Send the photo as JSON.' }, { status: 400 });
  }

  try {
    const result = await analyzeProduct(body ?? {});
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    if (err instanceof InputError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error('[scan] analysis failed:', err);
    // Non-secret diagnostics so failures are visible in the browser's Network tab.
    // upstream_status is Gemini's HTTP status: 400/403 = bad key, 404 = unknown model, 429 = quota.
    return Response.json(
      {
        error: 'We could not check your photo right now. Try again in a moment.',
        code: err.code === 'missing_api_key' ? 'missing_api_key' : 'gemini_error',
        upstream_status: typeof err.status === 'number' ? err.status : undefined,
      },
      { status: 502 },
    );
  }
}
