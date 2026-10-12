import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Naming } from '../lib/music';
import type { Song } from '../lib/notation';

export type InstrumentId =
  | 'pro'
  | 'grand'
  | 'upright'
  | 'epiano'
  | 'rhodes'
  | 'harpsichord'
  | 'organ'
  | 'synth'
  | 'pad'
  | 'toy';

export type OscType =
  | 'sine'
  | 'triangle'
  | 'square'
  | 'sawtooth'
  | 'fatsine'
  | 'fattriangle'
  | 'fatsquare'
  | 'fatsawtooth'
  | 'pulse'
  | 'pwm';

export interface SoundSettings {
  instrument: InstrumentId;
  volume: number; // dB
  transpose: number; // semitonos
  octave: number; // octavas
  fineTune: number; // cents
  a4: number; // Hz de referencia
  velocitySensitive: boolean;
  fixedVelocity: number;
  // Envolvente
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  // Sintetizador
  oscType: OscType;
  detuneSpread: number; // para osciladores "fat"
  // Filtro
  filterType: 'lowpass' | 'highpass' | 'bandpass' | 'notch';
  filterCutoff: number;
  filterQ: number;
  // Ecualizador
  eqLow: number;
  eqMid: number;
  eqHigh: number;
  // Efectos
  reverbWet: number;
  reverbDecay: number;
  delayWet: number;
  delayTime: number;
  delayFeedback: number;
  chorusWet: number;
  chorusFreq: number;
  chorusDepth: number;
  phaserWet: number;
  phaserFreq: number;
  tremoloWet: number;
  tremoloFreq: number;
  vibratoWet: number;
  vibratoFreq: number;
  distortion: number;
  distortionWet: number;
  pan: number;
  width: number;
}

export const DEFAULT_SOUND: SoundSettings = {
  instrument: 'pro',
  volume: -4,
  transpose: 0,
  octave: 0,
  fineTune: 0,
  a4: 440,
  velocitySensitive: true,
  fixedVelocity: 0.75,
  attack: 0.005,
  decay: 0.8,
  sustain: 0.4,
  release: 1.2,
  oscType: 'triangle',
  detuneSpread: 20,
  filterType: 'lowpass',
  filterCutoff: 20000,
  filterQ: 0.7,
  eqLow: 0,
  eqMid: 0,
  eqHigh: 0,
  reverbWet: 0.22,
  reverbDecay: 2.8,
  delayWet: 0,
  delayTime: 0.3,
  delayFeedback: 0.3,
  chorusWet: 0,
  chorusFreq: 1.5,
  chorusDepth: 0.6,
  phaserWet: 0,
  phaserFreq: 0.5,
  tremoloWet: 0,
  tremoloFreq: 5,
  vibratoWet: 0,
  vibratoFreq: 5,
  distortion: 0.3,
  distortionWet: 0,
  pan: 0,
  width: 0.5,
};

export interface SoundPreset {
  name: string;
  sound: SoundSettings;
  builtin?: boolean;
}

export const BUILTIN_PRESETS: SoundPreset[] = [
  { name: 'Concierto (por defecto)', builtin: true, sound: DEFAULT_SOUND },
  {
    name: 'Sala de cámara íntima',
    builtin: true,
    sound: { ...DEFAULT_SOUND, reverbWet: 0.12, reverbDecay: 1.4, eqHigh: -3, filterCutoff: 9000 },
  },
  {
    name: 'Catedral',
    builtin: true,
    sound: { ...DEFAULT_SOUND, reverbWet: 0.55, reverbDecay: 7, release: 2.5, eqLow: 2 },
  },
  {
    name: 'Lo-fi chill',
    builtin: true,
    sound: {
      ...DEFAULT_SOUND,
      filterCutoff: 3200,
      filterQ: 1.2,
      eqHigh: -6,
      chorusWet: 0.35,
      vibratoWet: 0.15,
      vibratoFreq: 0.8,
      reverbWet: 0.3,
      fineTune: -15,
    },
  },
  {
    name: 'Ecos espaciales',
    builtin: true,
    sound: { ...DEFAULT_SOUND, instrument: 'pad', delayWet: 0.35, delayTime: 0.45, delayFeedback: 0.55, reverbWet: 0.5, reverbDecay: 6 },
  },
  {
    name: 'Rhodes con trémolo',
    builtin: true,
    sound: { ...DEFAULT_SOUND, instrument: 'rhodes', tremoloWet: 0.6, tremoloFreq: 4.5, chorusWet: 0.2, reverbWet: 0.18 },
  },
  {
    name: 'Synth Lead',
    builtin: true,
    sound: {
      ...DEFAULT_SOUND,
      instrument: 'synth',
      oscType: 'fatsawtooth',
      detuneSpread: 30,
      attack: 0.01,
      decay: 0.3,
      sustain: 0.7,
      release: 0.4,
      filterCutoff: 4500,
      filterQ: 4,
      delayWet: 0.2,
      delayTime: 0.25,
    },
  },
  {
    name: 'Piano roto (distorsión)',
    builtin: true,
    sound: { ...DEFAULT_SOUND, distortion: 0.6, distortionWet: 0.5, phaserWet: 0.3, eqMid: 3 },
  },
  {
    name: 'Afinación 432 Hz',
    builtin: true,
    sound: { ...DEFAULT_SOUND, a4: 432 },
  },
];

export type KeyCount = 25 | 37 | 49 | 61 | 76 | 88;

export interface UiSettings {
  naming: Naming;
  showNoteLabels: boolean;
  showKeyboardLabels: boolean;
  keyCount: KeyCount;
  lowestC: number; // octava de la primera tecla en teclados que empiezan en Do
  keyboardBaseOctave: number; // octava de la fila inferior del teclado del ordenador
  theme: 'ink' | 'sage' | 'wine';
  colorMode: 'system' | 'light' | 'dark';
  scoreVisible: boolean;
  autoPedal: boolean;
  scorePos: 'top' | 'side' | 'float';
  scoreFloat: { x: number; y: number };
}

export interface MetronomeSettings {
  bpm: number;
  beatsPerBar: number;
  beatUnit: number;
  accent: boolean;
  volume: number; // dB
  subdivision: 1 | 2 | 3 | 4;
  sound: 'click' | 'wood' | 'beep';
}

export interface Progress {
  completed: Record<string, boolean>;
  exercises: Record<string, boolean>;
  ear: { correct: number; total: number };
}

interface AppState {
  sound: SoundSettings;
  setSound: (p: Partial<SoundSettings>) => void;
  resetSound: () => void;
  presets: SoundPreset[];
  savePreset: (name: string) => void;
  deletePreset: (name: string) => void;

  ui: UiSettings;
  setUi: (p: Partial<UiSettings>) => void;

  metronome: MetronomeSettings;
  setMetronome: (p: Partial<MetronomeSettings>) => void;

  progress: Progress;
  markLesson: (id: string, done: boolean) => void;
  markExercise: (id: string) => void;
  addEarResult: (ok: boolean) => void;
  resetProgress: () => void;

  userSongs: Song[];
  addUserSong: (s: Song) => void;
  removeUserSong: (id: string) => void;
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      sound: DEFAULT_SOUND,
      setSound: (p) => set((s) => ({ sound: { ...s.sound, ...p } })),
      resetSound: () => set({ sound: DEFAULT_SOUND }),
      presets: [],
      savePreset: (name) =>
        set((s) => ({ presets: [...s.presets.filter((p) => p.name !== name), { name, sound: { ...s.sound } }] })),
      deletePreset: (name) => set((s) => ({ presets: s.presets.filter((p) => p.name !== name) })),

      ui: {
        naming: 'latin',
        showNoteLabels: true,
        showKeyboardLabels: true,
        keyCount: 61,
        lowestC: 2,
        keyboardBaseOctave: 3,
        theme: 'ink',
        colorMode: 'system',
        scoreVisible: false,
        autoPedal: true,
        scorePos: 'top',
        scoreFloat: { x: 80, y: 140 },
      },
      setUi: (p) => set((s) => ({ ui: { ...s.ui, ...p } })),

      metronome: { bpm: 90, beatsPerBar: 4, beatUnit: 4, accent: true, volume: -8, subdivision: 1, sound: 'click' },
      setMetronome: (p) => set((s) => ({ metronome: { ...s.metronome, ...p } })),

      progress: { completed: {}, exercises: {}, ear: { correct: 0, total: 0 } },
      markLesson: (id, done) =>
        set((s) => ({ progress: { ...s.progress, completed: { ...s.progress.completed, [id]: done } } })),
      markExercise: (id) =>
        set((s) => ({ progress: { ...s.progress, exercises: { ...s.progress.exercises, [id]: true } } })),
      addEarResult: (ok) =>
        set((s) => ({
          progress: {
            ...s.progress,
            ear: { correct: s.progress.ear.correct + (ok ? 1 : 0), total: s.progress.ear.total + 1 },
          },
        })),
      resetProgress: () => set({ progress: { completed: {}, exercises: {}, ear: { correct: 0, total: 0 } } }),

      userSongs: [],
      addUserSong: (song) => set((s) => ({ userSongs: [...s.userSongs.filter((x) => x.id !== song.id), song] })),
      removeUserSong: (id) => set((s) => ({ userSongs: s.userSongs.filter((x) => x.id !== id) })),
    }),
    {
      name: 'piano-pro',
      version: 1,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...p,
          sound: { ...current.sound, ...(p.sound ?? {}) },
          ui: { ...current.ui, ...(p.ui ?? {}) },
          metronome: { ...current.metronome, ...(p.metronome ?? {}) },
          progress: { ...current.progress, ...(p.progress ?? {}) },
        };
      },
    },
  ),
);

// Estado en vivo (no persistente)
interface LiveState {
  audioReady: boolean;
  samplesLoading: boolean;
  samplesError: boolean;
  active: Record<number, number>; // midi -> número de fuentes que lo mantienen
  sustain: boolean;
  beat: number; // pulso actual del metrónomo (-1 parado)
  metronomeOn: boolean;
  midiDevices: string[];
}

export const useLive = create<LiveState>(() => ({
  audioReady: false,
  samplesLoading: false,
  samplesError: false,
  active: {},
  sustain: false,
  beat: -1,
  metronomeOn: false,
  midiDevices: [],
}));
