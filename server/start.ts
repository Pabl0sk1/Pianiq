// Servidor de producción: API + la app compilada (dist/). Uso: npm run build && npm start
import express from 'express';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createApp } from './app.ts';

const dist = resolve(process.cwd(), 'dist');
if (!existsSync(resolve(dist, 'index.html'))) {
  console.error('[pianiq] No existe dist/. Ejecuta primero: npm run build');
  process.exit(1);
}

const app = createApp({ publicUrl: process.env.PUBLIC_URL });
app.use(express.static(dist, { index: false, maxAge: '7d' }));
// Rutas de la SPA (login, perfil, …) → index.html
app.use((req, res, next) => (req.method === 'GET' ? res.sendFile(resolve(dist, 'index.html')) : next()));

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`[pianiq] escuchando en http://localhost:${port}`));
