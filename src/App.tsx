import { useEffect, useState } from 'react';
import { engine, metronome } from './audio/engine';
import { input, installComputerKeyboard, installMidi } from './audio/input';
import { useApp, useLive } from './state/store';
import { useAuth } from './state/auth';
import { Metronome } from './components/Metronome';
import { Select, Toggle } from './components/Controls';
import { useOutsideClose } from './components/useOutsideClose';
import { PianiqMark, Wordmark } from './components/Brand';
import { Icon, type IconName } from './components/Icon';
import { UserMenu } from './components/UserMenu';
import { linkProps, navigate, useLocation } from './lib/router';
import { FreePlay } from './pages/FreePlay';
import { Learn } from './pages/Learn';
import { Songs } from './pages/Songs';
import { Ear } from './pages/Ear';
import { Dictionary } from './pages/Dictionary';
import { ForgotPage, LoginPage, RegisterPage, ResetPage } from './pages/Auth';
import { ProfilePage } from './pages/Profile';
import { AdminPage } from './pages/Admin';
import { DevMailbox } from './pages/DevMailbox';

const TABS: { path: string; name: string; icon: IconName }[] = [
  { path: '/', name: 'Tocar', icon: 'keys' },
  { path: '/aprender', name: 'Aprender', icon: 'learn' },
  { path: '/canciones', name: 'Canciones', icon: 'songs' },
  { path: '/oido', name: 'Oído', icon: 'ear' },
  { path: '/diccionario', name: 'Diccionario', icon: 'book' },
];

/** Rutas que no necesitan sesión */
const PUBLIC = ['/login', '/registro', '/recuperar', '/restablecer', '/dev/buzon'];
const PRIVATE = [...TABS.map((t) => t.path), '/perfil', '/admin'];

const THEMES = ['ink', 'sage', 'wine'] as const;

export default function App() {
  const { path } = useLocation();
  const status = useAuth((s) => s.status);
  const user = useAuth((s) => s.user);
  const initAuth = useAuth((s) => s.init);
  const sound = useApp((s) => s.sound);
  const metro = useApp((s) => s.metronome);
  const ui = useApp((s) => s.ui);
  const setUi = useApp((s) => s.setUi);
  const ready = useLive((s) => s.audioReady);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useOutsideClose<HTMLDivElement>(settingsOpen, () => setSettingsOpen(false));

  // Modo claro/oscuro: por defecto sigue al sistema operativo y reacciona si este cambia
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const mode = ui.colorMode === 'system' ? (systemDark ? 'dark' : 'light') : ui.colorMode;
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);
  useEffect(() => engine.apply(sound), [sound, ready]);
  useEffect(() => metronome.configure(metro), [metro, ready]);
  useEffect(() => installComputerKeyboard(), []);
  useEffect(() => {
    let cleanup = () => {};
    installMidi().then((c) => (cleanup = c));
    return () => cleanup();
  }, []);
  useEffect(() => {
    input.releaseEverything();
  }, [path]);

  // El navegador solo permite activar el audio tras un gesto del usuario:
  // se activa en silencio con el primer clic o tecla, sin pantallas de aviso.
  useEffect(() => {
    if (ready) return;
    const start = () => engine.init();
    window.addEventListener('pointerdown', start, { once: true });
    window.addEventListener('keydown', start, { once: true });
    return () => {
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };
  }, [ready]);

  // Protección de rutas: sin sesión → login (recordando a dónde ibas); con sesión → fuera de las pantallas de acceso
  const isPublic = PUBLIC.includes(path);
  useEffect(() => {
    if (status === 'guest' && !isPublic) navigate(path === '/' ? '/login' : `/login?next=${encodeURIComponent(path)}`, true);
    if (status === 'user' && isPublic && path !== '/dev/buzon') navigate('/', true);
    if (status === 'user' && path === '/admin' && user?.role !== 'admin') navigate('/', true);
  }, [status, isPublic, path, user?.role]);

  const themeClass = `app theme-${(THEMES as readonly string[]).includes(ui.theme) ? ui.theme : 'ink'}`;

  if (status === 'loading')
    return (
      <div className={`${themeClass} splash`}>
        <PianiqMark size={56} />
      </div>
    );

  if (path === '/dev/buzon')
    return (
      <div className={`${themeClass} scroll-page`}>
        <DevMailbox />
      </div>
    );

  if (status === 'guest' || isPublic) {
    const page =
      path === '/registro' ? <RegisterPage /> : path === '/recuperar' ? <ForgotPage /> : path === '/restablecer' ? <ResetPage /> : <LoginPage />;
    return <div className={`${themeClass} scroll-page`}>{page}</div>;
  }

  return (
    <div className={themeClass}>
      <header className="topbar">
        <a className="brand" {...linkProps('/')}>
          <Wordmark size={30} />
        </a>
        <nav className="nav">
          {TABS.map((t) => (
            <a key={t.path} className={`nav-btn ${path === t.path ? 'active' : ''}`} {...linkProps(t.path)}>
              <Icon name={t.icon} size={17} /> {t.name}
            </a>
          ))}
        </nav>
        <Metronome />
        <button
          className="btn ghost small mode-btn"
          title={`Modo de color: ${{ system: 'del sistema', light: 'claro', dark: 'oscuro' }[ui.colorMode]}`}
          onClick={() => setUi({ colorMode: ui.colorMode === 'system' ? 'light' : ui.colorMode === 'light' ? 'dark' : 'system' })}
        >
          <Icon name={({ system: 'system', light: 'sun', dark: 'moon' } as const)[ui.colorMode]} size={17} />
        </button>
        <div className="settings" ref={settingsRef}>
          <button className={`btn ghost small ${settingsOpen ? 'active' : ''}`} onClick={() => setSettingsOpen((o) => !o)}>
            <Icon name="gear" size={16} /> Ajustes
          </button>
          {settingsOpen && (
            <div className="settings-pop">
              <div className="pop-grid">
                <span>Apariencia</span>
                <Select
                  value={ui.colorMode}
                  options={[
                    { value: 'system', label: 'Según el sistema', hint: systemDark ? 'ahora oscuro' : 'ahora claro' },
                    { value: 'light', label: 'Claro · papel' },
                    { value: 'dark', label: 'Oscuro · noche' },
                  ]}
                  onChange={(colorMode) => setUi({ colorMode })}
                />
                <span>Color de acento</span>
                <Select
                  value={(THEMES as readonly string[]).includes(ui.theme) ? ui.theme : 'ink'}
                  options={[
                    { value: 'ink', label: <span className="swatch-label"><i style={{ background: '#1f3044' }} /><i style={{ background: '#b9814a' }} />Tinta y latón</span> },
                    { value: 'sage', label: <span className="swatch-label"><i style={{ background: '#2c4a3e' }} /><i style={{ background: '#4f8a66' }} />Salvia</span> },
                    { value: 'wine', label: <span className="swatch-label"><i style={{ background: '#4b2532' }} /><i style={{ background: '#a8485e' }} />Burdeos</span> },
                  ]}
                  onChange={(theme) => setUi({ theme })}
                />
                <span>Nombres de notas</span>
                <Select
                  value={ui.naming}
                  options={[
                    { value: 'latin', label: 'Do Re Mi', hint: 'latino' },
                    { value: 'english', label: 'C D E', hint: 'anglosajón' },
                  ]}
                  onChange={(naming) => setUi({ naming })}
                />
              </div>
              <Toggle label="Mostrar nombres en las teclas" checked={ui.showNoteLabels} onChange={(v) => setUi({ showNoteLabels: v })} />
              <Toggle label="Mostrar teclas del ordenador" checked={ui.showKeyboardLabels} onChange={(v) => setUi({ showKeyboardLabels: v })} />
            </div>
          )}
        </div>
        <UserMenu />
      </header>

      <div className="content">
        {path === '/' && <FreePlay />}
        {path === '/aprender' && <Learn />}
        {path === '/canciones' && <Songs />}
        {path === '/oido' && <Ear />}
        {path === '/diccionario' && <Dictionary />}
        {path === '/perfil' && <ProfilePage />}
        {path === '/admin' && user?.role === 'admin' && <AdminPage />}
        {!PRIVATE.includes(path) && (
          <div className="page not-found">
            <h1>Esta página no existe</h1>
            <p className="muted">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
            <a className="btn primary" {...linkProps('/')}>
              Ir a tocar el piano
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
