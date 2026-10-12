// Cliente de la API de Pianiq (misma origen, cookie de sesión httpOnly).

export class ApiError extends Error {
  status: number;
  field?: string;
  constructor(status: number, message: string, field?: string) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'pianiq' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'No hay conexión con el servidor. Comprueba que Pianiq se está ejecutando.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? `Error ${res.status}`, data.field);
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body ?? {}),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  del: <T>(path: string, body?: unknown) => request<T>('DELETE', path, body ?? {}),
};

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  bio: string;
  level: 'principiante' | 'elemental' | 'intermedio' | 'avanzado';
  avatar: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt: string | null;
}

export const LEVEL_LABEL: Record<User['level'], string> = {
  principiante: 'Principiante',
  elemental: 'Elemental',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

/** Fecha de SQLite (UTC) → texto local legible. */
export function formatDate(sql: string | null, withTime = false): string {
  if (!sql) return '—';
  const d = new Date(sql.replace(' ', 'T') + 'Z');
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}) });
}
