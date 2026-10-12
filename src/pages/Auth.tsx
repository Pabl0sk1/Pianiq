import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { PianiqMark } from '../components/Brand';
import { Field, FormError, PasswordField } from '../components/Form';
import { Icon } from '../components/Icon';
import { Select, Toggle } from '../components/Controls';
import { ApiError, api, type User } from '../lib/api';
import { linkProps, navigate, useLocation } from '../lib/router';
import { useAuth } from '../state/auth';

function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="auth">
      <aside className="auth-brand">
        <div className="auth-brand-top">
          <PianiqMark size={44} />
          <span className="wordmark-text">PIANIQ</span>
        </div>
        <blockquote>
          «El piano no tiene secretos: tiene paciencia.»
          <cite>Cuaderno de estudio</cite>
        </blockquote>
        <ul className="auth-points">
          <li>Un curso de 70 lecciones, de cero a avanzado</li>
          <li>Piano de cola real con sonido a tu medida</li>
          <li>Tu progreso y tus canciones, en tu cuenta</li>
        </ul>
        <div className="auth-keys" aria-hidden="true">
          {Array.from({ length: 15 }, (_, i) => (
            <i key={i} className={[1, 2, 4, 5, 6, 8, 9, 11, 12, 13].includes(i) ? 'has-black' : ''} />
          ))}
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-card">
          <h1>{title}</h1>
          {subtitle && <p className="auth-sub">{subtitle}</p>}
          {children}
        </div>
        {footer && <div className="auth-footer">{footer}</div>}
      </main>
    </div>
  );
}

const fieldErr = (e: unknown, field: string) => (e instanceof ApiError && e.field === field ? e.message : undefined);
const formErr = (e: unknown) => (e instanceof ApiError ? (e.field ? undefined : e.message) : e ? String(e) : undefined);

// ---------------------------------------------------------------------------

export function LoginPage() {
  const login = useAuth((s) => s.login);
  const { query } = useLocation();
  const [form, setForm] = useState({ login: '', password: '', remember: true });
  const [err, setErr] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await login(form.login, form.password, form.remember);
      navigate(query.get('next') ?? '/', true);
    } catch (ex) {
      setErr(ex);
    } finally {
      setBusy(false);
    }
  };

  const pwErr = fieldErr(err, 'password');
  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para seguir donde lo dejaste."
      footer={
        <>
          ¿Aún no tienes cuenta? <a {...linkProps('/registro')}>Crea una gratis</a>
        </>
      }
    >
      <form onSubmit={submit} className="auth-form" noValidate>
        <FormError>{formErr(err) ?? pwErr}</FormError>
        <Field label="Usuario o correo" value={form.login} onChange={(login) => setForm({ ...form, login })} autoComplete="username" autoFocus />
        <PasswordField
          label="Contraseña"
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
          aside={
            <a className="field-link" {...linkProps('/recuperar')}>
              ¿La olvidaste?
            </a>
          }
        />
        <Toggle label="Mantener la sesión iniciada" checked={form.remember} onChange={(remember) => setForm({ ...form, remember })} />
        <button className="btn primary big block" disabled={busy || !form.login || !form.password}>
          {busy ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>
    </AuthLayout>
  );
}

// ---------------------------------------------------------------------------

export function RegisterPage() {
  const register = useAuth((s) => s.register);
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '', level: 'principiante' });
  const [err, setErr] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setErr(new ApiError(400, 'Las contraseñas no coinciden.', 'confirm'));
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await register(form);
      navigate('/aprender', true);
    } catch (ex) {
      setErr(ex);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Gratis. Tu progreso, tus canciones y tu sonido quedan guardados."
      footer={
        <>
          ¿Ya tienes cuenta? <a {...linkProps('/login')}>Inicia sesión</a>
        </>
      }
    >
      <form onSubmit={submit} className="auth-form" noValidate>
        <FormError>{formErr(err)}</FormError>
        <Field label="Nombre" value={form.name} onChange={set('name')} error={fieldErr(err, 'name')} autoComplete="name" autoFocus />
        <div className="field-row-2">
          <Field
            label="Usuario"
            value={form.username}
            onChange={(v) => set('username')(v.replace(/\s/g, ''))}
            error={fieldErr(err, 'username')}
            autoComplete="username"
            hint="Letras, números, punto o guion bajo"
          />
          <label className="field">
            <span className="field-label">Tu nivel</span>
            <Select
              value={form.level}
              options={[
                { value: 'principiante', label: 'Empiezo de cero' },
                { value: 'elemental', label: 'Sé lo básico' },
                { value: 'intermedio', label: 'Intermedio' },
                { value: 'avanzado', label: 'Avanzado' },
              ]}
              onChange={set('level')}
            />
          </label>
        </div>
        <Field label="Correo electrónico" type="email" value={form.email} onChange={set('email')} error={fieldErr(err, 'email')} autoComplete="email" />
        <PasswordField label="Contraseña" value={form.password} onChange={set('password')} error={fieldErr(err, 'password')} meter autoComplete="new-password" />
        <PasswordField label="Repite la contraseña" value={form.confirm} onChange={set('confirm')} error={fieldErr(err, 'confirm')} autoComplete="new-password" />
        <button className="btn primary big block" disabled={busy}>
          {busy ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  );
}

// ---------------------------------------------------------------------------

export function ForgotPage() {
  const devMailbox = useAuth((s) => s.devMailbox);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await api.post('/auth/forgot', { email });
      setSent(true);
    } catch (ex) {
      setErr(ex);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title={sent ? 'Revisa tu correo' : 'Recuperar contraseña'}
      subtitle={
        sent ? (
          <>
            Si existe una cuenta con <b>{email}</b>, te enviamos un enlace para crear una contraseña nueva. Caduca en 30 minutos.
          </>
        ) : (
          'Escribe el correo de tu cuenta y te enviaremos un enlace para restablecerla.'
        )
      }
      footer={<a {...linkProps('/login')}>Volver a iniciar sesión</a>}
    >
      {sent ? (
        <div className="auth-form">
          {devMailbox && (
            <div className="dev-note">
              <b>Modo desarrollo:</b> no hay servidor de correo configurado, así que los correos se guardan en el buzón de pruebas.
              <a className="btn block" {...linkProps('/dev/buzon')}>
                <Icon name="book" size={15} /> Abrir el buzón de pruebas
              </a>
            </div>
          )}
          <button className="btn ghost block" onClick={() => setSent(false)}>
            Usar otro correo
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="auth-form" noValidate>
          <FormError>{formErr(err)}</FormError>
          <Field label="Correo electrónico" type="email" value={email} onChange={setEmail} error={fieldErr(err, 'email')} autoComplete="email" autoFocus />
          <button className="btn primary big block" disabled={busy || !email}>
            {busy ? 'Enviando…' : 'Enviar enlace'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

// ---------------------------------------------------------------------------

export function ResetPage() {
  const signedIn = useAuth((s) => s.signedIn);
  const { query } = useLocation();
  const token = query.get('token') ?? '';
  const [state, setState] = useState<{ email?: string; invalid?: string }>({});
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [err, setErr] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<{ email: string }>(`/auth/reset/${encodeURIComponent(token)}`)
      .then(({ email }) => setState({ email }))
      .catch((e) => setState({ invalid: e.message }));
  }, [token]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setErr(new ApiError(400, 'Las contraseñas no coinciden.', 'confirm'));
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const { user } = await api.post<{ user: User }>('/auth/reset', { token, password: form.password });
      await signedIn(user);
      navigate('/', true);
    } catch (ex) {
      setErr(ex);
    } finally {
      setBusy(false);
    }
  };

  if (state.invalid)
    return (
      <AuthLayout title="Enlace no válido" subtitle={state.invalid} footer={<a {...linkProps('/login')}>Volver a iniciar sesión</a>}>
        <a className="btn primary big block" {...linkProps('/recuperar')}>
          Pedir un enlace nuevo
        </a>
      </AuthLayout>
    );

  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle={state.email ? <>Para la cuenta <b>{state.email}</b>. Al guardarla se cerrarán las demás sesiones.</> : 'Comprobando el enlace…'}
    >
      <form onSubmit={submit} className="auth-form" noValidate>
        <FormError>{formErr(err)}</FormError>
        <PasswordField label="Contraseña nueva" value={form.password} onChange={(password) => setForm({ ...form, password })} error={fieldErr(err, 'password')} meter autoComplete="new-password" />
        <PasswordField label="Repite la contraseña" value={form.confirm} onChange={(confirm) => setForm({ ...form, confirm })} error={fieldErr(err, 'confirm')} autoComplete="new-password" />
        <button className="btn primary big block" disabled={busy || !state.email}>
          {busy ? 'Guardando…' : 'Guardar y entrar'}
        </button>
      </form>
    </AuthLayout>
  );
}
