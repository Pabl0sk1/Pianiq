import { useEffect, useState } from 'react';
import { engine, metronome } from './audio/engine';
import { input, installComputerKeyboard, installMidi } from './audio/input';
import { useApp, useLive } from './state/store';
import { Metronome } from './components/Metronome';
import { Select, Toggle } from './components/Controls';
import { useOutsideClose } from './components/useOutsideClose';
import { Wordmark } from './components/Brand';
import { Icon, type IconName } from './components/Icon';
import { FreePlay } from './pages/FreePlay';
import { Learn } from './pages/Learn';
import { Songs } from './pages/Songs';
import { Ear } from './pages/Ear';
import { Dictionary } from './pages/Dictionary';

type Tab = 'play' | 'learn' | 'songs' | 'ear' | 'dict';

const TABS: { id: Tab; name: string; icon: IconName }[] = [
  { id: 'play', name: 'Tocar', icon: 'keys' },
  { id: 'learn', name: 'Aprender', icon: 'learn' },
  { id: 'songs', name: 'Canciones', icon: 'songs' },
  { id: 'ear', name: 'Oído', icon: 'ear' },
  { id: 'dict', name: 'Diccionario', icon: 'book' },
];

const THEMES = ['ink', 'sage', 'wine'] as const;

export default function App() {
  const [tab, setTab] = useState<Tab>(() => (localStorage.getItem('piano-pro-tab') as Tab) ?? 'play');
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

  useEffect(() => localStorage.setItem('piano-pro-tab', tab), [tab]);
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
  }, [tab]);

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

  return (
    <div className={`app theme-${(THEMES as readonly string[]).includes(ui.theme) ? ui.theme : 'ink'}`}>
      <header className="topbar">
        <div className="brand">
          <Wordmark size={30} />
        </div>
        <nav className="nav">
          {TABS.map((t) => (
            <button key={t.id} className={`nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} size={17} /> {t.name}
            </button>
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
                    { value: 'sage', label: <span className="swatch-label"><i style={{ background: '#2f4a3f' }} /><i style={{ background: '#c08a5b' }} />Salvia</span> },
                    { value: 'wine', label: <span className="swatch-label"><i style={{ background: '#4a2430' }} /><i style={{ background: '#c79a52' }} />Burdeos</span> },
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
      </header>

      <div className="content">
        {tab === 'play' && <FreePlay />}
        {tab === 'learn' && <Learn />}
        {tab === 'songs' && <Songs />}
        {tab === 'ear' && <Ear />}
        {tab === 'dict' && <Dictionary />}
      </div>
    </div>
  );
}
