import * as Tone from 'tone';
import type { InstrumentId, SoundSettings } from '../state/store';

export interface InstrumentInfo {
  id: InstrumentId;
  name: string;
  short: string;
  description: string;
  sampled: boolean;
  /** Qué controles de envolvente/oscilador afectan a este modelo */
  envelope: 'full' | 'attack-release';
  oscillator: boolean;
  color: string;
}

export const INSTRUMENTS: InstrumentInfo[] = [
  {
    id: 'pro',
    name: 'Pianiq Studio',
    short: 'PRO',
    description:
      'Piano de cola muestreado nota a nota (Salamander Grand, 16 capas) con todos los controles: envolvente, filtro, EQ, efectos, afinación y transposición.',
    sampled: true,
    envelope: 'attack-release',
    oscillator: false,
    color: '#b07a43',
  },
  {
    id: 'grand',
    name: 'Gran Cola de Concierto',
    short: 'COLA',
    description: 'El mismo piano real con una voz brillante de sala de conciertos y resonancia natural.',
    sampled: true,
    envelope: 'attack-release',
    oscillator: false,
    color: '#8f6aa8',
  },
  {
    id: 'upright',
    name: 'Vertical Honky-Tonk',
    short: 'VERT',
    description: 'Piano vertical de bar: cuerdas ligeramente desafinadas entre sí y timbre más opaco.',
    sampled: true,
    envelope: 'attack-release',
    oscillator: false,
    color: '#b46e38',
  },
  {
    id: 'epiano',
    name: 'Piano Eléctrico FM',
    short: 'EP',
    description: 'Piano eléctrico de síntesis FM al estilo de los años 80.',
    sampled: false,
    envelope: 'full',
    oscillator: false,
    color: '#5d8c69',
  },
  {
    id: 'rhodes',
    name: 'Rhodes Tine',
    short: 'RHD',
    description: 'Sonido de "tine" campaneante, cálido; perfecto para soul, jazz y lo-fi.',
    sampled: false,
    envelope: 'full',
    oscillator: false,
    color: '#b05a48',
  },
  {
    id: 'harpsichord',
    name: 'Clavecín Barroco',
    short: 'CLV',
    description: 'Cuerdas pulsadas, brillante y sin sostenido: ideal para Bach y el Barroco.',
    sampled: false,
    envelope: 'full',
    oscillator: false,
    color: '#a88a3c',
  },
  {
    id: 'organ',
    name: 'Órgano de Tubos',
    short: 'ORG',
    description: 'Registros aditivos (8\', 4\', 2 2/3\', 2\'): sostenido infinito mientras mantienes la tecla.',
    sampled: false,
    envelope: 'full',
    oscillator: false,
    color: '#4f8597',
  },
  {
    id: 'synth',
    name: 'Sintetizador Pro',
    short: 'SYN',
    description: 'Sintetizador polifónico totalmente configurable: forma de onda, desafinación, ADSR y filtro.',
    sampled: false,
    envelope: 'full',
    oscillator: true,
    color: '#8c6a9c',
  },
  {
    id: 'pad',
    name: 'Pad Atmosférico',
    short: 'PAD',
    description: 'Colchón sonoro amplio y lento para ambientes y bandas sonoras.',
    sampled: false,
    envelope: 'full',
    oscillator: false,
    color: '#6577a8',
  },
  {
    id: 'toy',
    name: 'Piano de Juguete / Celesta',
    short: 'TOY',
    description: 'Timbre metálico y campanero de caja de música.',
    sampled: false,
    envelope: 'full',
    oscillator: false,
    color: '#c09a4a',
  },
];

export const instrumentInfo = (id: InstrumentId) => INSTRUMENTS.find((i) => i.id === id) ?? INSTRUMENTS[0];

// ---------------------------------------------------------------------------
// Muestras del piano de cola (Salamander Grand Piano, licencia CC-BY)

const SALAMANDER_BASE = 'https://tonejs.github.io/audio/salamander/';

function salamanderFiles(): Record<string, string> {
  const files: Record<string, string> = { A0: 'A0.mp3', C8: 'C8.mp3' };
  for (let o = 1; o <= 7; o++) {
    files[`C${o}`] = `C${o}.mp3`;
    files[`D#${o}`] = `Ds${o}.mp3`;
    files[`F#${o}`] = `Fs${o}.mp3`;
    files[`A${o}`] = `A${o}.mp3`;
  }
  return files;
}

let pianoBuffers: Record<string, Tone.ToneAudioBuffer> | null = null;
let pianoPromise: Promise<Record<string, Tone.ToneAudioBuffer>> | null = null;

export function loadPianoSamples(): Promise<Record<string, Tone.ToneAudioBuffer>> {
  if (pianoBuffers) return Promise.resolve(pianoBuffers);
  if (!pianoPromise) {
    const entries = Object.entries(salamanderFiles());
    pianoPromise = Promise.all(
      entries.map(async ([note, file]) => [note, await Tone.ToneAudioBuffer.fromUrl(SALAMANDER_BASE + file)] as const),
    ).then((list) => {
      pianoBuffers = Object.fromEntries(list);
      return pianoBuffers;
    });
    pianoPromise.catch(() => {
      pianoPromise = null;
    });
  }
  return pianoPromise;
}

export const pianoSamplesReady = () => pianoBuffers !== null;

// ---------------------------------------------------------------------------
// Voces

export interface Voice {
  output: Tone.ToneAudioNode;
  attack(freq: number, time: number, velocity: number): void;
  release(freq: number, time: number): void;
  attackRelease(freq: number, duration: number, time: number, velocity: number): void;
  releaseAll(): void;
  configure(s: SoundSettings): void;
  dispose(): void;
}

class PolyVoice implements Voice {
  output: Tone.ToneAudioNode;
  constructor(
    private synth: Tone.PolySynth,
    private configureFn: (synth: Tone.PolySynth, s: SoundSettings) => void,
    extraOut?: Tone.ToneAudioNode,
  ) {
    synth.maxPolyphony = 48;
    this.output = extraOut ?? synth;
    if (extraOut) synth.connect(extraOut);
  }
  attack(freq: number, time: number, velocity: number) {
    this.synth.triggerAttack(freq, time, velocity);
  }
  release(freq: number, time: number) {
    this.synth.triggerRelease(freq, time);
  }
  attackRelease(freq: number, duration: number, time: number, velocity: number) {
    this.synth.triggerAttackRelease(freq, duration, time, velocity);
  }
  releaseAll() {
    this.synth.releaseAll();
  }
  configure(s: SoundSettings) {
    this.configureFn(this.synth, s);
  }
  dispose() {
    this.synth.dispose();
    if (this.output !== this.synth) this.output.dispose();
  }
}

/** Piano muestreado. "detunes" permite capas desafinadas (honky-tonk). */
class SampledVoice implements Voice {
  output: Tone.ToneAudioNode;
  private sampler: Tone.Sampler | null = null;
  private fallback: Tone.PolySynth;
  private outGain: Tone.Gain;
  private voicing: Tone.ToneAudioNode[] = [];
  private disposed = false;
  private settings: SoundSettings | null = null;

  constructor(
    private kind: 'pro' | 'grand' | 'upright',
    onLoadState: (loading: boolean, error: boolean) => void,
  ) {
    this.outGain = new Tone.Gain(1);
    let input: Tone.ToneAudioNode = this.outGain;
    if (kind === 'upright') {
      const lp = new Tone.Filter({ type: 'lowpass', frequency: 2600, rolloff: -12 });
      const mid = new Tone.EQ3({ low: 1, mid: 3, high: -4, lowFrequency: 300, highFrequency: 2500 });
      lp.chain(mid, this.outGain);
      this.voicing = [lp, mid];
      input = lp;
    } else if (kind === 'grand') {
      const eq = new Tone.EQ3({ low: 2, mid: -1, high: 3, lowFrequency: 200, highFrequency: 3500 });
      eq.connect(this.outGain);
      this.voicing = [eq];
      input = eq;
    }
    this.output = this.outGain;
    this.fallback = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 1.2, sustain: 0.15, release: 1 },
    });
    this.fallback.maxPolyphony = 48;
    this.fallback.volume.value = -8;
    this.fallback.connect(input);

    const ready = pianoSamplesReady();
    onLoadState(!ready, false);
    loadPianoSamples()
      .then((buffers) => {
        if (this.disposed) return;
        this.sampler = new Tone.Sampler({ urls: buffers, release: 1.2, attack: 0, curve: 'exponential' });
        this.sampler.volume.value = -3;
        this.sampler.connect(input);
        if (this.settings) this.configure(this.settings);
        onLoadState(false, false);
      })
      .catch(() => {
        if (!this.disposed) onLoadState(false, true);
      });
  }

  private freqs(freq: number): number[] {
    if (this.kind !== 'upright') return [freq];
    return [freq * Math.pow(2, 9 / 1200), freq * Math.pow(2, -7 / 1200)];
  }
  attack(freq: number, time: number, velocity: number) {
    if (this.sampler) {
      const v = this.kind === 'upright' ? velocity * 0.75 : velocity;
      for (const f of this.freqs(freq)) this.sampler.triggerAttack(f, time, v);
    } else this.fallback.triggerAttack(freq, time, velocity);
  }
  release(freq: number, time: number) {
    if (this.sampler) this.sampler.triggerRelease(freq, time);
    this.fallback.triggerRelease(freq, time);
  }
  attackRelease(freq: number, duration: number, time: number, velocity: number) {
    if (this.sampler) {
      const v = this.kind === 'upright' ? velocity * 0.75 : velocity;
      for (const f of this.freqs(freq)) this.sampler.triggerAttackRelease(f, duration, time, v);
    } else this.fallback.triggerAttackRelease(freq, duration, time, velocity);
  }
  releaseAll() {
    this.sampler?.releaseAll();
    this.fallback.releaseAll();
  }
  configure(s: SoundSettings) {
    this.settings = s;
    if (!this.sampler) return;
    if (this.kind === 'pro') {
      this.sampler.attack = s.attack;
      this.sampler.release = s.release;
    } else {
      this.sampler.attack = 0;
      this.sampler.release = this.kind === 'grand' ? 1.6 : 0.9;
    }
  }
  dispose() {
    this.disposed = true;
    this.sampler?.dispose();
    this.fallback.dispose();
    this.voicing.forEach((n) => n.dispose());
    this.outGain.dispose();
  }
}

const env = (s: SoundSettings) => ({ attack: s.attack, decay: s.decay, sustain: s.sustain, release: s.release });

export function createVoice(id: InstrumentId, onLoadState: (loading: boolean, error: boolean) => void): Voice {
  switch (id) {
    case 'pro':
    case 'grand':
    case 'upright':
      return new SampledVoice(id, onLoadState);

    case 'epiano': {
      onLoadState(false, false);
      const synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 1,
        modulationIndex: 3.2,
        oscillator: { type: 'sine' },
        modulation: { type: 'sine' },
        envelope: { attack: 0.002, decay: 1.6, sustain: 0.1, release: 0.9 },
        modulationEnvelope: { attack: 0.002, decay: 0.35, sustain: 0.05, release: 0.4 },
      });
      synth.volume.value = -6;
      return new PolyVoice(synth, (sy, s) => sy.set({ envelope: env(s) }));
    }

    case 'rhodes': {
      onLoadState(false, false);
      const synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 7.01,
        modulationIndex: 1.4,
        oscillator: { type: 'sine' },
        modulation: { type: 'sine' },
        envelope: { attack: 0.003, decay: 2.2, sustain: 0.25, release: 1.1 },
        modulationEnvelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.3 },
      });
      synth.volume.value = -5;
      const warm = new Tone.Filter({ type: 'lowpass', frequency: 3800, rolloff: -12 });
      return new PolyVoice(synth, (sy, s) => sy.set({ envelope: env(s) }), warm);
    }

    case 'harpsichord': {
      onLoadState(false, false);
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fatsawtooth', count: 2, spread: 6 },
        envelope: { attack: 0.001, decay: 1.1, sustain: 0, release: 0.25 },
      });
      synth.volume.value = -16;
      const body = new Tone.Filter({ type: 'highpass', frequency: 180 });
      return new PolyVoice(
        synth,
        (sy, s) => sy.set({ envelope: { attack: Math.min(s.attack, 0.01), decay: s.decay + 0.3, sustain: 0, release: Math.min(s.release, 0.4) } }),
        body,
      );
    }

    case 'organ': {
      onLoadState(false, false);
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'custom', partials: [1, 0.7, 0.45, 0.35, 0.12, 0.2, 0, 0.1] },
        envelope: { attack: 0.02, decay: 0.1, sustain: 1, release: 0.15 },
      });
      synth.volume.value = -14;
      return new PolyVoice(synth, (sy, s) =>
        sy.set({ envelope: { attack: Math.max(s.attack, 0.01), decay: 0.1, sustain: 1, release: Math.min(s.release, 0.6) } }),
      );
    }

    case 'synth': {
      onLoadState(false, false);
      const synth = new Tone.PolySynth(Tone.Synth);
      synth.volume.value = -12;
      return new PolyVoice(synth, (sy, s) => {
        const osc: Record<string, unknown> = { type: s.oscType };
        if (s.oscType.startsWith('fat')) {
          osc.count = 3;
          osc.spread = s.detuneSpread;
        }
        if (s.oscType === 'pulse') osc.width = 0.3;
        if (s.oscType === 'pwm') osc.modulationFrequency = 0.6;
        sy.set({ oscillator: osc as never, envelope: env(s) });
      });
    }

    case 'pad': {
      onLoadState(false, false);
      const synth = new Tone.PolySynth(Tone.AMSynth, {
        harmonicity: 2,
        oscillator: { type: 'fatsawtooth', count: 3, spread: 25 } as never,
        modulation: { type: 'sine' },
        envelope: { attack: 0.8, decay: 1, sustain: 0.8, release: 2.5 },
      });
      synth.volume.value = -18;
      const soft = new Tone.Filter({ type: 'lowpass', frequency: 2200, rolloff: -24 });
      return new PolyVoice(
        synth,
        (sy, s) => sy.set({ envelope: { attack: Math.max(s.attack, 0.25), decay: s.decay, sustain: Math.max(s.sustain, 0.5), release: Math.max(s.release, 1.2) } }),
        soft,
      );
    }

    case 'toy': {
      onLoadState(false, false);
      const synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 5.07,
        modulationIndex: 6,
        oscillator: { type: 'sine' },
        modulation: { type: 'triangle' },
        envelope: { attack: 0.001, decay: 0.9, sustain: 0, release: 0.6 },
        modulationEnvelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
      });
      synth.volume.value = -10;
      return new PolyVoice(synth, (sy, s) =>
        sy.set({ envelope: { attack: Math.min(s.attack, 0.02), decay: s.decay + 0.2, sustain: 0, release: s.release * 0.5 } }),
      );
    }
  }
}
