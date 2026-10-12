import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createApp } from './server/app.ts';

/** Permite que la app guarde canciones en src/data/library (biblioteca permanente). */
function libraryWriter(): Plugin {
  const dir = resolve(__dirname, 'src/data/library');
  return {
    name: 'piano-library-writer',
    configureServer(server) {
      // Descarga un archivo de audio desde un enlace directo (evita las restricciones CORS del navegador)
      server.middlewares.use('/__fetch', async (req, res) => {
        try {
          const url = new URL(req.url ?? '', 'http://x').searchParams.get('url') ?? '';
          const target = new URL(url);
          if (!/^https?:$/.test(target.protocol)) throw new Error('Solo enlaces http(s)');
          const r = await fetch(target, { redirect: 'follow' });
          if (!r.ok) throw new Error(`El servidor respondió ${r.status}`);
          const type = r.headers.get('content-type') ?? '';
          if (type.includes('text/html')) throw new Error('El enlace lleva a una página web, no a un archivo de audio');
          const buf = Buffer.from(await r.arrayBuffer());
          if (buf.length > 60 * 1024 * 1024) throw new Error('Archivo demasiado grande (máx. 60 MB)');
          res.setHeader('Content-Type', type || 'application/octet-stream');
          res.end(buf);
        } catch (e) {
          res.statusCode = 400;
          res.end(e instanceof Error ? e.message : String(e));
        }
      });
      server.middlewares.use('/__library/save', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Método no permitido');
        }
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', async () => {
          try {
            const song = JSON.parse(body);
            const slug = String(song.title || song.id)
              .normalize('NFD')
              .replace(/[̀-ͯ]/g, '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
              .slice(0, 60);
            await mkdir(dir, { recursive: true });
            await writeFile(resolve(dir, `${slug || song.id}.json`), JSON.stringify(song));
            res.end('ok');
          } catch (e) {
            res.statusCode = 400;
            res.end(String(e));
          }
        });
      });
    },
  };
}

/** Monta la API (login, perfiles, datos) dentro del servidor de desarrollo de Vite. */
function apiServer(): Plugin {
  return {
    name: 'pianiq-api',
    configureServer(server) {
      const app = createApp();
      server.middlewares.use((req, res, next) => (req.url?.startsWith('/api/') ? app(req as never, res as never, next) : next()));
    },
  };
}

export default defineConfig({
  plugins: [react(), libraryWriter(), apiServer()],
  server: { port: 5173, open: true },
});
