import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Served at https://jaltech-poc.web.app/unilever/ (see firebase.json).
const BASE = '/unilever/';

// Serves <BASE>api/scan during `npm run dev` using the same core as the Cloud Function,
// so local development doesn't need the Firebase emulator.
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(`${BASE}api/scan`, async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Use POST.' }));
          return;
        }
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          let payload = null;
          try {
            payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          } catch {
            /* scanResponse turns a missing body into a 400 */
          }
          const { scanResponse } = await server.ssrLoadModule('/functions/src/scanResponse.js');
          const { status, body } = await scanResponse(payload);
          res.statusCode = status;
          res.end(JSON.stringify(body));
        } catch (err) {
          console.error(err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Local API error' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Expose server-only vars (no VITE_ prefix) to the local API handler only.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    base: BASE,
    // dist/ is the Hosting root; the app lives in dist/unilever/ so it serves at /unilever/.
    build: { outDir: 'dist/unilever', emptyOutDir: true },
    plugins: [react(), localApi()],
  };
});
