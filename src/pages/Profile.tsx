import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Avatar, resizeAvatar } from '../components/Avatar';
import { Field, FormError, PasswordField } from '../components/Form';
import { Icon } from '../components/Icon';
import { Select } from '../components/Controls';
import { ApiError, LEVEL_LABEL, api, formatDate, type User } from '../lib/api';
import { navigate } from '../lib/router';
import { useAuth } from '../state/auth';
import { useApp } from '../state/store';
import { ALL_LESSONS } from '../data/lessons';

type Tab = 'perfil' | 'seguridad' | 'cuenta';

const fieldErr = (e: unknown, f: string) => (e instanceof ApiError && e.field === f ? e.message : undefined);
const formErr = (e: unknown) => (e instanceof ApiError && !e.field ? e.message : undefined);

function Saved({ show }: { show: boolean }) {
  return show ? (
    <span className="saved">
      <Icon name="check" size={14} /> Guardado
    </span>
  ) : null;
}

// ---------------------------------------------------------------------------

function ProfileForm({ user }: { user: User }) {
  const setUser = useAuth((s) => s.setUser);
  const [form, setForm] = useState({ name: user.name, username: user.username, email: user.email, bio: user.bio, level: user.level });
  const [err, setErr] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty =
    form.name !== user.name || form.username !== user.username || form.email !== user.email || form.bio !== user.bio || form.level !== user.level;

  const save = async (patch: Record<string, unknown>) => {
    setBusy(true);
    setErr(null);
    try {
      const { user: u } = await api.patch<{ user: User }>('/profile', patch);
      setUser(u);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e) {
      setErr(e);
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (f?: File) => {
    if (!f) return;
    try {
      await save({ avatar: await resizeAvatar(f) });
    } catch (e) {
      setErr(e instanceof ApiError ? e : new ApiError(400, (e as Error).message));
    }
  };

  return (
    <form
      className="settings-form"
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        save(form);
      }}
      noValidate
    >
      <div className="avatar-edit">
        <Avatar user={user} size={84} />
        <div>
          <b>Foto de perfil</b>
          <p className="muted small">PNG, JPG o WebP. Se recorta en cuadrado.</p>
          <div className="row">
            <button type="button" className="btn small" onClick={() => fileRef.current?.click()}>
              <Icon name="upload" size={14} /> Subir foto
            </button>
            {user.avatar && (
              <button type="button" className="btn small ghost" onClick={() => save({ avatar: null })}>
                Quitar
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      </div>
      <FormError>{formErr(err) ?? fieldErr(err, 'avatar')}</FormError>
      <div className="field-row-2">
        <Field label="Nombre" value={form.name} onChange={(name) => setForm({ ...form, name })} error={fieldErr(err, 'name')} />
        <Field
          label="Usuario"
          value={form.username}
          onChange={(v) => setForm({ ...form, username: v.replace(/\s/g, '') })}
          error={fieldErr(err, 'username')}
        />
      </div>
      <div className="field-row-2">
        <Field label="Correo electrónico" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} error={fieldErr(err, 'email')} />
        <label className="field">
          <span className="field-label">Nivel</span>
          <Select
            value={form.level}
            options={(Object.keys(LEVEL_LABEL) as User['level'][]).map((l) => ({ value: l, label: LEVEL_LABEL[l] }))}
            onChange={(level) => setForm({ ...form, level })}
          />
        </label>
      </div>
      <label className={`field ${fieldErr(err, 'bio') ? 'has-error' : ''}`}>
        <span className="field-label">
          Sobre ti <span className="muted small">{form.bio.length}/280</span>
        </span>
        <textarea rows={3} maxLength={280} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Qué música te gusta, qué quieres aprender…" />
        {fieldErr(err, 'bio') && <span className="field-error">{fieldErr(err, 'bio')}</span>}
      </label>
      <div className="form-actions">
        <Saved show={saved} />
        <button type="button" className="btn ghost" disabled={!dirty || busy} onClick={() => setForm({ name: user.name, username: user.username, email: user.email, bio: user.bio, level: user.level })}>
          Descartar
        </button>
        <button className="btn primary" disabled={!dirty || busy}>
          {busy ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------

function SecurityForm() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [err, setErr] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sessions, setSessions] = useState<{ createdAt: string; userAgent: string; current: boolean }[]>([]);

  const loadSessions = () => api.get<{ sessions: typeof sessions }>('/profile/sessions').then((r) => setSessions(r.sessions));
  useEffect(() => {
    loadSessions();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.next !== form.confirm) return setErr(new ApiError(400, 'Las contraseñas no coinciden.', 'confirm'));
    setBusy(true);
    setErr(null);
    try {
      await api.post('/profile/password', { current: form.current, next: form.next });
      setForm({ current: '', next: '', confirm: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      loadSessions();
    } catch (ex) {
      setErr(ex);
    } finally {
      setBusy(false);
    }
  };

  const device = (ua: string) => {
    const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Navegador';
    const os = /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : '';
    return `${browser}${os ? ` · ${os}` : ''}`;
  };

  return (
    <>
      <form className="settings-form" onSubmit={submit} noValidate>
        <h3>Cambiar contraseña</h3>
        <FormError>{formErr(err)}</FormError>
        <PasswordField label="Contraseña actual" value={form.current} onChange={(current) => setForm({ ...form, current })} error={fieldErr(err, 'current')} />
        <div className="field-row-2">
          <PasswordField label="Contraseña nueva" value={form.next} onChange={(next) => setForm({ ...form, next })} error={fieldErr(err, 'next')} meter autoComplete="new-password" />
          <PasswordField label="Repite la nueva" value={form.confirm} onChange={(confirm) => setForm({ ...form, confirm })} error={fieldErr(err, 'confirm')} autoComplete="new-password" />
        </div>
        <div className="form-actions">
          <Saved show={saved} />
          <button className="btn primary" disabled={busy || !form.current || !form.next}>
            {busy ? 'Guardando…' : 'Cambiar contraseña'}
          </button>
        </div>
        <p className="muted small">Al cambiarla se cierran las sesiones abiertas en otros dispositivos.</p>
      </form>

      <section className="settings-form">
        <h3>Sesiones abiertas</h3>
        <ul className="session-list">
          {sessions.map((s, i) => (
            <li key={i}>
              <Icon name="system" size={18} />
              <div>
                <b>{device(s.userAgent)}</b>
                <span className="muted small">Desde {formatDate(s.createdAt, true)}</span>
              </div>
              {s.current && <span className="tag">Este dispositivo</span>}
            </li>
          ))}
        </ul>
        {sessions.length > 1 && (
          <div className="form-actions">
            <button className="btn" onClick={() => api.del('/profile/sessions').then(loadSessions)}>
              Cerrar las demás sesiones
            </button>
          </div>
        )}
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------

function AccountPanel({ user }: { user: User }) {
  const logout = useAuth((s) => s.logout);
  const app = useApp();
  const [confirm, setConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<unknown>(null);

  const exportData = () => {
    const { progress, userSongs, presets, ui, sound, metronome } = useApp.getState();
    const blob = new Blob([JSON.stringify({ user, progress, userSongs, presets, ui, sound, metronome }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pianiq-${user.username}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const remove = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.del('/profile', { password });
      await logout();
      navigate('/login', true);
    } catch (ex) {
      setErr(ex);
    }
  };

  return (
    <>
      <section className="settings-form">
        <h3>Tus datos</h3>
        <p className="muted">
          Tu progreso del curso, tus canciones, presets y ajustes se guardan en tu cuenta y te siguen en cualquier navegador. Tienes{' '}
          {app.userSongs.length} canción{app.userSongs.length === 1 ? '' : 'es'} propia{app.userSongs.length === 1 ? '' : 's'} y {app.presets.length} preset
          {app.presets.length === 1 ? '' : 's'}.
        </p>
        <div className="form-actions start">
          <button className="btn" onClick={exportData}>
            <Icon name="upload" size={15} /> Descargar mis datos (JSON)
          </button>
        </div>
      </section>
      <section className="settings-form danger-zone">
        <h3>Eliminar cuenta</h3>
        <p className="muted">Se borran tu perfil, tu progreso y tus canciones guardadas. No se puede deshacer.</p>
        {!confirm ? (
          <div className="form-actions start">
            <button className="btn danger" onClick={() => setConfirm(true)}>
              Eliminar mi cuenta…
            </button>
          </div>
        ) : (
          <form onSubmit={remove} noValidate className="auth-form">
            <FormError>{formErr(err)}</FormError>
            <PasswordField label="Escribe tu contraseña para confirmar" value={password} onChange={setPassword} error={fieldErr(err, 'password')} />
            <div className="form-actions start">
              <button type="button" className="btn ghost" onClick={() => setConfirm(false)}>
                Cancelar
              </button>
              <button className="btn danger solid" disabled={!password}>
                Eliminar definitivamente
              </button>
            </div>
          </form>
        )}
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------

export function ProfilePage() {
  const user = useAuth((s) => s.user)!;
  const progress = useApp((s) => s.progress);
  const [tab, setTab] = useState<Tab>('perfil');
  const done = ALL_LESSONS.filter((r) => progress.completed[r.lesson.id]).length;
  const exercises = Object.keys(progress.exercises).length;
  const ear = progress.ear.total ? Math.round((progress.ear.correct / progress.ear.total) * 100) : null;

  return (
    <div className="page profile">
      <aside className="profile-card">
        <Avatar user={user} size={96} />
        <h2>{user.name}</h2>
        <p className="muted">@{user.username}</p>
        <div className="profile-tags">
          <span className="tag">{LEVEL_LABEL[user.level]}</span>
          {user.role === 'admin' && <span className="tag accent">Administrador</span>}
        </div>
        {user.bio && <p className="profile-bio">{user.bio}</p>}
        <dl className="profile-stats">
          <div>
            <dt>Lecciones</dt>
            <dd>
              {done}
              <small>/{ALL_LESSONS.length}</small>
            </dd>
          </div>
          <div>
            <dt>Ejercicios</dt>
            <dd>{exercises}</dd>
          </div>
          <div>
            <dt>Oído</dt>
            <dd>{ear === null ? '—' : `${ear}%`}</dd>
          </div>
        </dl>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${(done / ALL_LESSONS.length) * 100}%` }} />
        </div>
        <p className="muted small">Miembro desde {formatDate(user.createdAt)}</p>
      </aside>
      <main className="profile-main">
        <h1>Tu cuenta</h1>
        <div className="tabs">
          {(
            [
              ['perfil', 'Perfil'],
              ['seguridad', 'Seguridad'],
              ['cuenta', 'Datos y cuenta'],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
        {tab === 'perfil' && <ProfileForm user={user} />}
        {tab === 'seguridad' && <SecurityForm />}
        {tab === 'cuenta' && <AccountPanel user={user} />}
      </main>
    </div>
  );
}
