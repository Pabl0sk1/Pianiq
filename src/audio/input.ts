import { engine } from './engine';
import { useApp, useLive } from '../state/store';

export type InputEvent =
  | { type: 'on'; midi: number; velocity: number; t: number }
  | { type: 'off'; midi: number; t: number }
  | { type: 'pedal'; down: boolean; t: number };

type Listener = (e: InputEvent) => void;
const listeners = new Set<Listener>();

/** Bus central: ratón, teclado del ordenador y MIDI pasan por aquí. */
export const input = {
  noteOn(midi: number, velocity = 0.8) {
    if (midi < 21 || midi > 108) return;
    if (engine.isReady) engine.noteOn(midi, velocity);
    // Primera nota: el audio aún se está activando; suena en cuanto esté listo si sigue pulsada
    else engine.init().then(() => useLive.getState().active[midi] && engine.noteOn(midi, velocity));
    useLive.setState((s) => ({ active: { ...s.active, [midi]: (s.active[midi] ?? 0) + 1 } }));
    emit({ type: 'on', midi, velocity, t: performance.now() });
  },
  noteOff(midi: number) {
    const count = useLive.getState().active[midi];
    if (!count) return;
    if (count <= 1) {
      engine.noteOff(midi);
      useLive.setState((s) => {
        const active = { ...s.active };
        delete active[midi];
        return { active };
      });
    } else useLive.setState((s) => ({ active: { ...s.active, [midi]: count - 1 } }));
    emit({ type: 'off', midi, t: performance.now() });
  },
  pedal(down: boolean) {
    if (useLive.getState().sustain === down) return;
    engine.setPedal(down);
    emit({ type: 'pedal', down, t: performance.now() });
  },
  releaseEverything() {
    for (const k of Object.keys(useLive.getState().active)) engine.noteOff(Number(k));
    useLive.setState({ active: {} });
    engine.setPedal(false);
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

function emit(e: InputEvent) {
  listeners.forEach((l) => l(e));
}

// ---------------------------------------------------------------------------
// Teclado del ordenador (usa event.code → independiente del idioma del teclado)

/** Desplazamiento en semitonos respecto al Do de la fila inferior. */
export const KEY_MAP: Record<string, number> = {
  // Fila inferior: Z S X D C V G B H N J M , L . Ñ -
  KeyZ: 0, KeyS: 1, KeyX: 2, KeyD: 3, KeyC: 4, KeyV: 5, KeyG: 6, KeyB: 7, KeyH: 8, KeyN: 9, KeyJ: 10, KeyM: 11,
  Comma: 12, KeyL: 13, Period: 14, Semicolon: 15, Slash: 16,
  // Fila superior: Q 2 W 3 E R 5 T 6 Y 7 U I 9 O 0 P
  KeyQ: 12, Digit2: 13, KeyW: 14, Digit3: 15, KeyE: 16, KeyR: 17, Digit5: 18, KeyT: 19, Digit6: 20, KeyY: 21,
  Digit7: 22, KeyU: 23, KeyI: 24, Digit9: 25, KeyO: 26, Digit0: 27, KeyP: 28, BracketLeft: 29, Equal: 30, BracketRight: 31,
};

export const KEY_LABEL: Record<string, string> = {
  KeyZ: 'Z', KeyS: 'S', KeyX: 'X', KeyD: 'D', KeyC: 'C', KeyV: 'V', KeyG: 'G', KeyB: 'B', KeyH: 'H', KeyN: 'N', KeyJ: 'J', KeyM: 'M',
  Comma: ',', KeyL: 'L', Period: '.', Semicolon: 'Ñ', Slash: '-',
  KeyQ: 'Q', Digit2: '2', KeyW: 'W', Digit3: '3', KeyE: 'E', KeyR: 'R', Digit5: '5', KeyT: 'T', Digit6: '6', KeyY: 'Y',
  Digit7: '7', KeyU: 'U', KeyI: 'I', Digit9: '9', KeyO: 'O', Digit0: '0', KeyP: 'P', BracketLeft: '`', Equal: '¡', BracketRight: '+',
};

/** Etiquetas por nota MIDI para mostrarlas sobre las teclas (la fila superior tiene prioridad). */
export function computerKeyLabels(baseOctave: number): Record<number, string> {
  const base = (baseOctave + 1) * 12;
  const out: Record<number, string> = {};
  const codes = Object.keys(KEY_MAP).reverse();
  for (const code of codes) out[base + KEY_MAP[code]] = KEY_LABEL[code];
  return out;
}

const pressedCodes = new Map<string, number>();

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
}

export function installComputerKeyboard() {
  const down = (e: KeyboardEvent) => {
    if (isTyping(e) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code === 'Space') {
      e.preventDefault();
      input.pedal(true);
      return;
    }
    const ui = useApp.getState().ui;
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      e.preventDefault();
      const d = e.code === 'ArrowLeft' ? -1 : 1;
      useApp.getState().setUi({ keyboardBaseOctave: Math.max(0, Math.min(6, ui.keyboardBaseOctave + d)) });
      return;
    }
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      e.preventDefault();
      const s = useApp.getState().sound;
      const d = e.code === 'ArrowUp' ? 1 : -1;
      useApp.getState().setSound({ transpose: Math.max(-12, Math.min(12, s.transpose + d)) });
      return;
    }
    if (!(e.code in KEY_MAP)) return;
    e.preventDefault();
    if (e.repeat || pressedCodes.has(e.code)) return;
    const midi = (ui.keyboardBaseOctave + 1) * 12 + KEY_MAP[e.code];
    pressedCodes.set(e.code, midi);
    input.noteOn(midi, e.shiftKey ? 1 : 0.75);
  };
  const up = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      input.pedal(false);
      return;
    }
    const midi = pressedCodes.get(e.code);
    if (midi === undefined) return;
    pressedCodes.delete(e.code);
    input.noteOff(midi);
  };
  const blur = () => {
    for (const midi of pressedCodes.values()) input.noteOff(midi);
    pressedCodes.clear();
    input.pedal(false);
  };
  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  window.addEventListener('blur', blur);
  return () => {
    window.removeEventListener('keydown', down);
    window.removeEventListener('keyup', up);
    window.removeEventListener('blur', blur);
  };
}

// ---------------------------------------------------------------------------
// Teclados MIDI físicos (Web MIDI API: Chrome, Edge, Opera)

export async function installMidi(): Promise<() => void> {
  if (!('requestMIDIAccess' in navigator)) return () => {};
  try {
    const access = await navigator.requestMIDIAccess();
    const handler = (msg: MIDIMessageEvent) => {
      const data = msg.data;
      if (!data) return;
      const [status, d1, d2] = data;
      const cmd = status & 0xf0;
      if (cmd === 0x90 && d2 > 0) input.noteOn(d1, d2 / 127);
      else if (cmd === 0x80 || (cmd === 0x90 && d2 === 0)) input.noteOff(d1);
      else if (cmd === 0xb0 && d1 === 64) input.pedal(d2 >= 64);
    };
    const bind = () => {
      const names: string[] = [];
      access.inputs.forEach((inp) => {
        inp.onmidimessage = handler;
        names.push(inp.name ?? 'Dispositivo MIDI');
      });
      useLive.setState({ midiDevices: names });
    };
    bind();
    access.onstatechange = bind;
    return () => {
      access.inputs.forEach((inp) => (inp.onmidimessage = null));
      access.onstatechange = null;
    };
  } catch {
    return () => {};
  }
}
