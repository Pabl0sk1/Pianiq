import express, { type NextFunction, type Request, type Response } from 'express';
import { getDb, type UserRow } from './db.ts';
import { hashPassword, newToken, sha256, verifyPassword } from './crypto.ts';
import { sendMail, usingDevMailbox } from './mail.ts';

const SESSION_COOKIE = 'pianiq_session';
const DAY = 24 * 60 * 60 * 1000;
const isProd = process.env.NODE_ENV === 'production';

// ---------------------------------------------------------------------------
// Utilidades

class HttpError extends Error {
  status: number;
  field?: string;
  constructor(status: number, message: string, field?: string) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

const sqlDate = (ms: number) => new Date(ms).toISOString().replace('T', ' ').slice(0, 19);

function readCookie(req: Request, name: string): string | null {
  const raw = req.headers.cookie ?? '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

function setSessionCookie(res: Response, token: string, remember: boolean) {
  const attrs = [`${SESSION_COOKIE}=${token}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (remember) attrs.push(`Max-Age=${30 * 24 * 60 * 60}`);
  if (isProd) attrs.push('Secure');
  res.setHeader('Set-Cookie', attrs.join('; '));
}

function clearSessionCookie(res: Response) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

export interface PublicUser {
  id: number;
  username: string;
  email: string;
  name: string;
  bio: string;
  level: string;
  avatar: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt: string | null;
}

const publicUser = (u: UserRow): PublicUser => ({
  id: u.id,
  username: u.username,
  email: u.email,
  name: u.name,
  bio: u.bio,
  level: u.level,
  avatar: u.avatar,
  role: u.role,
  createdAt: u.created_at,
  lastLoginAt: u.last_login_at,
});

// Validaciones
const USERNAME_RE = /^[a-z0-9_.]{3,24}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LEVELS = ['principiante', 'elemental', 'intermedio', 'avanzado'];

function str(v: unknown, field: string, { min = 0, max = 200, required = true } = {}): string {
  const s = typeof v === 'string' ? v.trim() : '';
  if (required && !s) throw new HttpError(400, 'Este campo es obligatorio.', field);
  if (s.length < min) throw new HttpError(400, `Debe tener al menos ${min} caracteres.`, field);
  if (s.length > max) throw new HttpError(400, `Máximo ${max} caracteres.`, field);
  return s;
}

function checkPassword(v: unknown, field = 'password'): string {
  const p = typeof v === 'string' ? v : '';
  if (p.length < 8) throw new HttpError(400, 'La contraseña debe tener al menos 8 caracteres.', field);
  if (p.length > 200) throw new HttpError(400, 'La contraseña es demasiado larga.', field);
  if (!/[a-zA-Z]/.test(p) || !/\d/.test(p)) throw new HttpError(400, 'Usa al menos una letra y un número.', field);
  return p;
}

function checkUsername(v: unknown): string {
  const u = str(v, 'username', { max: 24 });
  if (!USERNAME_RE.test(u)) throw new HttpError(400, 'De 3 a 24 caracteres: letras, números, punto o guion bajo.', 'username');
  return u;
}

function checkEmail(v: unknown): string {
  const e = str(v, 'email', { max: 254 }).toLowerCase();
  if (!EMAIL_RE.test(e)) throw new HttpError(400, 'Introduce un correo válido.', 'email');
  return e;
}

// Límite de intentos (en memoria) contra fuerza bruta
const attempts = new Map<string, { count: number; until: number }>();
function rateLimit(key: string, max = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const a = attempts.get(key);
  if (a && a.until > now && a.count >= max)
    throw new HttpError(429, `Demasiados intentos. Prueba de nuevo en ${Math.ceil((a.until - now) / 60000)} min.`);
  if (!a || a.until <= now) attempts.set(key, { count: 1, until: now + windowMs });
  else a.count++;
}

// ---------------------------------------------------------------------------
// Sesiones

interface AuthedRequest extends Request {
  user?: UserRow;
  sessionHash?: string;
}

function createSession(res: Response, req: Request, userId: number, remember: boolean) {
  const { token, hash } = newToken();
  const expires = Date.now() + (remember ? 30 * DAY : DAY);
  getDb()
    .prepare('INSERT INTO sessions (token_hash, user_id, expires_at, user_agent) VALUES (?, ?, ?, ?)')
    .run(hash, userId, sqlDate(expires), String(req.headers['user-agent'] ?? '').slice(0, 200));
  getDb().prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(userId);
  setSessionCookie(res, token, remember);
}

function loadSession(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = readCookie(req, SESSION_COOKIE);
  if (token) {
    const hash = sha256(token);
    const row = getDb()
      .prepare(
        `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = ? AND s.expires_at > datetime('now') AND u.disabled = 0`,
      )
      .get(hash) as UserRow | undefined;
    if (row) {
      req.user = row;
      req.sessionHash = hash;
    }
  }
  next();
}

function requireUser(req: AuthedRequest): UserRow {
  if (!req.user) throw new HttpError(401, 'Inicia sesión para continuar.');
  return req.user;
}

function requireAdmin(req: AuthedRequest): UserRow {
  const u = requireUser(req);
  if (u.role !== 'admin') throw new HttpError(403, 'Solo para administradores.');
  return u;
}

// ---------------------------------------------------------------------------
// Aplicación

type Handler = (req: AuthedRequest, res: Response) => unknown | Promise<unknown>;
const h =
  (fn: Handler) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req as AuthedRequest, res)).then((out) => {
      if (!res.headersSent) res.json(out ?? { ok: true });
    }, next);

export function createApp(opts: { publicUrl?: string } = {}) {
  const app = express();
  const api = express.Router();
  const db = getDb();

  api.use(express.json({ limit: '6mb' }));
  // Protección CSRF básica: las peticiones que modifican datos deben venir de la propia app
  api.use((req, _res, next) => {
    if (req.method !== 'GET' && req.headers['x-requested-with'] !== 'pianiq') return next(new HttpError(403, 'Petición no permitida.'));
    next();
  });
  api.use(loadSession);

  const baseUrl = (req: Request) => opts.publicUrl ?? `${req.protocol}://${req.headers.host}`;

  // --- Autenticación -------------------------------------------------------
  api.get(
    '/auth/me',
    h((req) => ({ user: req.user ? publicUser(req.user) : null, devMailbox: usingDevMailbox() && !isProd })),
  );

  api.post(
    '/auth/register',
    h((req, res) => {
      rateLimit(`reg:${req.ip}`, 10);
      const name = str(req.body.name, 'name', { min: 2, max: 60 });
      const username = checkUsername(req.body.username);
      const email = checkEmail(req.body.email);
      const password = checkPassword(req.body.password);
      if (db.prepare('SELECT 1 FROM users WHERE username = ?').get(username))
        throw new HttpError(409, 'Ese nombre de usuario ya está en uso.', 'username');
      if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email))
        throw new HttpError(409, 'Ya existe una cuenta con ese correo.', 'email');
      const level = LEVELS.includes(req.body.level) ? req.body.level : 'principiante';
      const info = db
        .prepare('INSERT INTO users (username, email, name, level, password_hash) VALUES (?, ?, ?, ?, ?)')
        .run(username, email, name, level, hashPassword(password));
      createSession(res, req, Number(info.lastInsertRowid), true);
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid) as unknown as UserRow;
      void sendMail({
        to: email,
        subject: 'Bienvenido a Pianiq',
        text: `Hola ${name}:\n\nTu cuenta (${username}) ya está lista. ¡Que disfrutes tocando!\n\n— Pianiq`,
      });
      return { user: publicUser(user) };
    }),
  );

  api.post(
    '/auth/login',
    h((req, res) => {
      const login = str(req.body.login, 'login', { max: 254 });
      const password = typeof req.body.password === 'string' ? req.body.password : '';
      rateLimit(`login:${req.ip}:${login.toLowerCase()}`);
      const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(login, login.toLowerCase()) as
        | UserRow
        | undefined;
      // Mismo mensaje para usuario inexistente y contraseña errónea (no revela qué cuentas existen)
      if (!user || !verifyPassword(password, user.password_hash))
        throw new HttpError(401, 'Usuario o contraseña incorrectos.', 'password');
      if (user.disabled) throw new HttpError(403, 'Esta cuenta está desactivada. Contacta con un administrador.');
      attempts.delete(`login:${req.ip}:${login.toLowerCase()}`);
      createSession(res, req, user.id, !!req.body.remember);
      return { user: publicUser(user) };
    }),
  );

  api.post(
    '/auth/logout',
    h((req, res) => {
      if (req.sessionHash) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(req.sessionHash);
      clearSessionCookie(res);
    }),
  );

  api.post(
    '/auth/forgot',
    h(async (req) => {
      rateLimit(`forgot:${req.ip}`, 5);
      const email = checkEmail(req.body.email);
      const user = db.prepare('SELECT * FROM users WHERE email = ? AND disabled = 0').get(email) as UserRow | undefined;
      if (user) {
        const { token, hash } = newToken();
        db.prepare('UPDATE password_resets SET used_at = datetime(\'now\') WHERE user_id = ? AND used_at IS NULL').run(user.id);
        db.prepare('INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(
          hash,
          user.id,
          sqlDate(Date.now() + 30 * 60 * 1000),
        );
        const link = `${baseUrl(req)}/restablecer?token=${token}`;
        await sendMail({
          to: user.email,
          subject: 'Restablecer tu contraseña de Pianiq',
          text: `Hola ${user.name}:\n\nRecibimos una solicitud para restablecer tu contraseña. Abre este enlace (válido 30 minutos):\n\n${link}\n\nSi no fuiste tú, ignora este mensaje: tu contraseña no cambiará.\n\n— Pianiq`,
          link,
        });
      }
      // Respuesta idéntica exista o no la cuenta
      return { ok: true, devMailbox: usingDevMailbox() && !isProd };
    }),
  );

  const findReset = (token: unknown) => {
    if (typeof token !== 'string' || token.length < 20) return undefined;
    return db
      .prepare(
        `SELECT r.*, u.email, u.name FROM password_resets r JOIN users u ON u.id = r.user_id
         WHERE r.token_hash = ? AND r.used_at IS NULL AND r.expires_at > datetime('now')`,
      )
      .get(sha256(token)) as { token_hash: string; user_id: number; email: string; name: string } | undefined;
  };

  api.get(
    '/auth/reset/:token',
    h((req) => {
      const r = findReset(req.params.token);
      if (!r) throw new HttpError(410, 'El enlace no es válido o ya caducó. Solicita uno nuevo.');
      const [u, d] = r.email.split('@');
      return { email: `${u.slice(0, 2)}${'•'.repeat(Math.max(1, u.length - 2))}@${d}` };
    }),
  );

  api.post(
    '/auth/reset',
    h((req, res) => {
      const r = findReset(req.body.token);
      if (!r) throw new HttpError(410, 'El enlace no es válido o ya caducó. Solicita uno nuevo.');
      const password = checkPassword(req.body.password);
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), r.user_id);
      db.prepare("UPDATE password_resets SET used_at = datetime('now') WHERE token_hash = ?").run(r.token_hash);
      // Por seguridad se cierran todas las sesiones abiertas y se inicia una nueva
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(r.user_id);
      createSession(res, req, r.user_id, false);
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(r.user_id) as unknown as UserRow;
      void sendMail({
        to: user.email,
        subject: 'Tu contraseña de Pianiq ha cambiado',
        text: `Hola ${user.name}:\n\nLa contraseña de tu cuenta se cambió correctamente. Si no fuiste tú, restablécela de inmediato.\n\n— Pianiq`,
      });
      return { user: publicUser(user) };
    }),
  );

  // --- Perfil ---------------------------------------------------------------
  api.patch(
    '/profile',
    h((req) => {
      const me = requireUser(req);
      const b = req.body ?? {};
      const name = b.name !== undefined ? str(b.name, 'name', { min: 2, max: 60 }) : me.name;
      const username = b.username !== undefined ? checkUsername(b.username) : me.username;
      const email = b.email !== undefined ? checkEmail(b.email) : me.email;
      const bio = b.bio !== undefined ? str(b.bio, 'bio', { max: 280, required: false }) : me.bio;
      const level = b.level !== undefined && LEVELS.includes(b.level) ? b.level : me.level;
      let avatar = me.avatar;
      if (b.avatar !== undefined) {
        if (b.avatar === null) avatar = null;
        else if (typeof b.avatar === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(b.avatar) && b.avatar.length < 400_000)
          avatar = b.avatar;
        else throw new HttpError(400, 'Imagen no válida (PNG, JPG o WebP, máx. 300 KB).', 'avatar');
      }
      if (username.toLowerCase() !== me.username.toLowerCase() && db.prepare('SELECT 1 FROM users WHERE username = ?').get(username))
        throw new HttpError(409, 'Ese nombre de usuario ya está en uso.', 'username');
      if (email !== me.email && db.prepare('SELECT 1 FROM users WHERE email = ?').get(email))
        throw new HttpError(409, 'Ya existe una cuenta con ese correo.', 'email');
      db.prepare('UPDATE users SET name = ?, username = ?, email = ?, bio = ?, level = ?, avatar = ? WHERE id = ?').run(
        name,
        username,
        email,
        bio,
        level,
        avatar,
        me.id,
      );
      return { user: publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(me.id) as unknown as UserRow) };
    }),
  );

  api.post(
    '/profile/password',
    h((req) => {
      const me = requireUser(req);
      rateLimit(`pwd:${me.id}`, 6);
      if (!verifyPassword(String(req.body.current ?? ''), me.password_hash))
        throw new HttpError(400, 'La contraseña actual no es correcta.', 'current');
      const next = checkPassword(req.body.next, 'next');
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(next), me.id);
      // Cierra las demás sesiones
      db.prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash <> ?').run(me.id, req.sessionHash ?? '');
    }),
  );

  api.get(
    '/profile/sessions',
    h((req) => {
      const me = requireUser(req);
      const rows = db
        .prepare("SELECT token_hash, created_at, user_agent FROM sessions WHERE user_id = ? AND expires_at > datetime('now') ORDER BY created_at DESC")
        .all(me.id) as { token_hash: string; created_at: string; user_agent: string }[];
      return { sessions: rows.map((r) => ({ createdAt: r.created_at, userAgent: r.user_agent, current: r.token_hash === req.sessionHash })) };
    }),
  );

  api.delete(
    '/profile/sessions',
    h((req) => {
      const me = requireUser(req);
      db.prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash <> ?').run(me.id, req.sessionHash ?? '');
    }),
  );

  api.delete(
    '/profile',
    h((req, res) => {
      const me = requireUser(req);
      if (!verifyPassword(String(req.body?.password ?? ''), me.password_hash))
        throw new HttpError(400, 'Contraseña incorrecta.', 'password');
      if (me.role === 'admin' && (db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'admin'").get() as { c: number }).c <= 1)
        throw new HttpError(400, 'Eres el único administrador: nombra a otro antes de borrar tu cuenta.');
      db.prepare('DELETE FROM users WHERE id = ?').run(me.id);
      clearSessionCookie(res);
    }),
  );

  // --- Datos del usuario (progreso, canciones, presets, ajustes) ------------
  api.get(
    '/data',
    h((req) => {
      const me = requireUser(req);
      const row = db.prepare('SELECT data, updated_at FROM user_data WHERE user_id = ?').get(me.id) as
        | { data: string; updated_at: string }
        | undefined;
      return { data: row ? JSON.parse(row.data) : null, updatedAt: row?.updated_at ?? null };
    }),
  );

  api.put(
    '/data',
    h((req) => {
      const me = requireUser(req);
      if (typeof req.body?.data !== 'object' || req.body.data === null) throw new HttpError(400, 'Datos no válidos.');
      db.prepare(
        `INSERT INTO user_data (user_id, data, updated_at) VALUES (?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
      ).run(me.id, JSON.stringify(req.body.data));
    }),
  );

  // --- Administración -------------------------------------------------------
  api.get(
    '/admin/users',
    h((req) => {
      requireAdmin(req);
      const rows = db
        .prepare(
          `SELECT u.*, (SELECT COUNT(*) FROM sessions s WHERE s.user_id = u.id AND s.expires_at > datetime('now')) AS sessions
           FROM users u ORDER BY u.created_at DESC`,
        )
        .all() as unknown as (UserRow & { sessions: number })[];
      return { users: rows.map((u) => ({ ...publicUser(u), disabled: !!u.disabled, sessions: u.sessions })) };
    }),
  );

  api.patch(
    '/admin/users/:id',
    h((req) => {
      const me = requireAdmin(req);
      const id = Number(req.params.id);
      const target = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
      if (!target) throw new HttpError(404, 'Usuario no encontrado.');
      if (id === me.id) throw new HttpError(400, 'No puedes cambiar tu propio rol ni desactivarte.');
      if (req.body.role === 'admin' || req.body.role === 'user') db.prepare('UPDATE users SET role = ? WHERE id = ?').run(req.body.role, id);
      if (typeof req.body.disabled === 'boolean') {
        db.prepare('UPDATE users SET disabled = ? WHERE id = ?').run(req.body.disabled ? 1 : 0, id);
        if (req.body.disabled) db.prepare('DELETE FROM sessions WHERE user_id = ?').run(id);
      }
    }),
  );

  api.delete(
    '/admin/users/:id',
    h((req) => {
      const me = requireAdmin(req);
      const id = Number(req.params.id);
      if (id === me.id) throw new HttpError(400, 'Para borrar tu propia cuenta usa tu perfil.');
      db.prepare('DELETE FROM users WHERE id = ?').run(id);
    }),
  );

  // --- Buzón de pruebas (solo desarrollo, sin SMTP) --------------------------
  api.get(
    '/dev/outbox',
    h(() => {
      if (isProd || !usingDevMailbox()) throw new HttpError(404, 'No disponible.');
      const rows = db.prepare('SELECT * FROM outbox ORDER BY id DESC LIMIT 50').all();
      return { mails: rows };
    }),
  );

  api.use((_req, _res, next) => next(new HttpError(404, 'Ruta no encontrada.')));
  api.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: err.message, field: err.field });
      return;
    }
    if (err && typeof err === 'object' && 'type' in err && (err as { type: string }).type === 'entity.too.large') {
      res.status(413).json({ error: 'Los datos son demasiado grandes.' });
      return;
    }
    console.error('[pianiq]', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  });

  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback');
  app.use('/api', api);
  return app;
}
