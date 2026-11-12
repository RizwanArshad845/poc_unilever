import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Serves /api/scan during `npm run dev` with the same handler Vercel deploys,
// so local development doesn't need `vercel dev`.
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/scan', async (req, res) => {
        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const { POST } = await server.ssrLoadModule('/api/scan.js');
          const response = await POST(
            new Request('http://localhost/api/scan', {
              method: req.method,
              headers: req.headers,
              body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
            }),
          );
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
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
  return { plugins: [react(), localApi()] };
});
