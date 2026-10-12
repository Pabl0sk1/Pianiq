import { api } from '../lib/api';
import { DEFAULT_SOUND, useApp } from './store';

// Sincroniza con la cuenta lo que pertenece al usuario: progreso, canciones, presets y ajustes.

type Synced = Pick<ReturnType<typeof useApp.getState>, 'progress' | 'userSongs' | 'presets' | 'ui' | 'sound' | 'metronome'>;

const pick = (): Synced => {
  const s = useApp.getState();
  return { progress: s.progress, userSongs: s.userSongs, presets: s.presets, ui: s.ui, sound: s.sound, metronome: s.metronome };
};

let unsubscribe: (() => void) | null = null;
let timer: number | undefined;
let pending = false;

async function push() {
  pending = false;
  try {
    await api.put('/data', { data: pick() });
  } catch (e) {
    console.warn('[pianiq] no se pudieron guardar los datos', e);
  }
}

export async function startSync() {
  await stopSync(false);
  try {
    const { data } = await api.get<{ data: Partial<Synced> | null }>('/data');
    if (data) {
      const cur = useApp.getState();
      useApp.setState({
        progress: { ...cur.progress, ...(data.progress ?? {}) },
        userSongs: data.userSongs ?? [],
        presets: data.presets ?? [],
        ui: { ...cur.ui, ...(data.ui ?? {}) },
        sound: { ...DEFAULT_SOUND, ...(data.sound ?? {}) },
        metronome: { ...cur.metronome, ...(data.metronome ?? {}) },
      });
    } else {
      // Primera vez con esta cuenta: se lleva lo que ya había en este navegador
      await push();
    }
  } catch (e) {
    console.warn('[pianiq] no se pudieron cargar los datos de la cuenta', e);
  }
  unsubscribe = useApp.subscribe((s, prev) => {
    if (s.progress === prev.progress && s.userSongs === prev.userSongs && s.presets === prev.presets && s.ui === prev.ui && s.sound === prev.sound && s.metronome === prev.metronome)
      return;
    pending = true;
    window.clearTimeout(timer);
    timer = window.setTimeout(push, 1200);
  });
}

/** Al cerrar sesión: guarda lo pendiente y deja el navegador limpio para el siguiente usuario. */
export async function stopSync(clearLocal: boolean) {
  unsubscribe?.();
  unsubscribe = null;
  window.clearTimeout(timer);
  if (pending) await push();
  if (clearLocal) {
    useApp.setState({
      progress: { completed: {}, exercises: {}, ear: { correct: 0, total: 0 } },
      userSongs: [],
      presets: [],
    });
  }
}

// Si se cierra la pestaña con cambios sin guardar, se envían igualmente (keepalive)
window.addEventListener('pagehide', () => {
  if (!pending) return;
  fetch('/api/data', {
    method: 'PUT',
    keepalive: true,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'pianiq' },
    body: JSON.stringify({ data: pick() }),
  }).catch(() => {});
});
