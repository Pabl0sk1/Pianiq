import * as Tone from 'tone';
import { DEFAULT_SOUND, useLive, type MetronomeSettings, type SoundSettings } from '../state/store';
import { createVoice, type Voice } from './instruments';

/**
 * Motor de audio. Cadena de señal:
 * voz → filtro → EQ3 → distorsión → chorus → phaser → vibrato → trémolo → delay → reverb
 *     → panorama → ancho estéreo → volumen → limitador → salida
 */
class AudioEngine {
  private ready = false;
  private settings: SoundSettings = DEFAULT_SOUND;
  private voice: Voice | null = null;
  private voiceId: string | null = null;

  private input!: Tone.Gain;
  private chainKey = '';
  private analysis = false;
  private filter!: Tone.Filter;
  private eq!: Tone.EQ3;
  private distortion!: Tone.Distortion;
  private chorus!: Tone.Chorus;
  private phaser!: Tone.Phaser;
  private vibrato!: Tone.Vibrato;
  private tremolo!: Tone.Tremolo;
  private delay!: Tone.FeedbackDelay;
  private reverb!: Tone.Reverb;
  private panner!: Tone.Panner;
  private widener!: Tone.StereoWidener;
  private volume!: Tone.Volume;
  private compressor!: Tone.Compressor;
  private limiter!: Tone.Limiter;
  waveform!: Tone.Analyser;
  fft!: Tone.Analyser;

  private reverbDecay = 0;
  private reverbTimer: number | undefined;

  /** midi de entrada → frecuencia con la que sonó (para soltarla igual aunque cambie la afinación) */
  private held = new Map<number, number>();
  private sustained = new Map<number, number>();
  private pedal = false;

  private initPromise: Promise<void> | null = null;

  init(): Promise<void> {
    if (!this.initPromise) this.initPromise = this.doInit();
    return this.initPromise;
  }

  private async doInit() {
    // Búfer de audio "balanced": algo más de margen para que el navegador nunca se quede sin
    // muestras (los microcortes/crujidos aparecen con el búfer mínimo "interactive").
    // lookAhead amplio para la reproducción programada; las notas en vivo usan Tone.immediate().
    Tone.setContext(new Tone.Context({ latencyHint: 'balanced', lookAhead: 0.12 }));
    await Tone.start();

    this.input = new Tone.Gain(1);

    this.filter = new Tone.Filter({ type: 'lowpass', frequency: 20000, Q: 0.7, rolloff: -24 });
    this.eq = new Tone.EQ3({ low: 0, mid: 0, high: 0 });
    this.distortion = new Tone.Distortion({ distortion: 0.3, wet: 0 });
    this.chorus = new Tone.Chorus({ frequency: 1.5, delayTime: 3.5, depth: 0.6, wet: 0 }).start();
    this.phaser = new Tone.Phaser({ frequency: 0.5, octaves: 3, baseFrequency: 400, wet: 0 });
    this.vibrato = new Tone.Vibrato({ frequency: 5, depth: 0.15, wet: 0 });
    this.tremolo = new Tone.Tremolo({ frequency: 5, depth: 0.7, wet: 0 }).start();
    this.delay = new Tone.FeedbackDelay({ delayTime: 0.3, feedback: 0.3, wet: 0 });
    this.reverb = new Tone.Reverb({ decay: 2.8, preDelay: 0.02, wet: 0.22 });
    this.reverbDecay = 2.8;
    this.panner = new Tone.Panner(0);
    this.widener = new Tone.StereoWidener(0.5);
    this.volume = new Tone.Volume(-4);
    this.compressor = new Tone.Compressor({ threshold: -20, ratio: 2.2, knee: 12, attack: 0.02, release: 0.3 });
    this.limiter = new Tone.Limiter(-1);
    this.waveform = new Tone.Analyser('waveform', 1024);
    this.fft = new Tone.Analyser('fft', 128);

    this.ready = true;
    metronome.init();
    this.apply(this.settings, true);
    useLive.setState({ audioReady: true });
  }

  get isReady() {
    return this.ready;
  }

  apply(s: SoundSettings, force = false) {
    const prev = this.settings;
    this.settings = s;
    if (!this.ready) return;

    if (force || this.voiceId !== s.instrument || !this.voice) {
      this.releaseAll();
      const old = this.voice;
      this.voice = createVoice(s.instrument, (loading, error) =>
        useLive.setState({ samplesLoading: loading, samplesError: error }),
      );
      this.voice.output.connect(this.input);
      this.voiceId = s.instrument;
      if (old) setTimeout(() => old.dispose(), 3000);
    }
    this.voice.configure(s);

    this.filter.type = s.filterType;
    this.filter.frequency.rampTo(s.filterCutoff, 0.05);
    this.filter.Q.value = s.filterQ;
    this.eq.low.value = s.eqLow;
    this.eq.mid.value = s.eqMid;
    this.eq.high.value = s.eqHigh;
    this.distortion.distortion = s.distortion;
    this.distortion.wet.value = s.distortionWet;
    this.chorus.wet.value = s.chorusWet;
    this.chorus.frequency.value = s.chorusFreq;
    this.chorus.depth = s.chorusDepth;
    this.phaser.wet.value = s.phaserWet;
    this.phaser.frequency.value = s.phaserFreq;
    this.vibrato.wet.value = s.vibratoWet;
    this.vibrato.frequency.value = s.vibratoFreq;
    this.tremolo.wet.value = s.tremoloWet;
    this.tremolo.frequency.value = s.tremoloFreq;
    this.delay.wet.value = s.delayWet;
    this.delay.delayTime.rampTo(s.delayTime, 0.05);
    this.delay.feedback.value = s.delayFeedback;
    this.reverb.wet.value = s.reverbWet;
    this.panner.pan.value = s.pan;
    this.widener.width.value = s.width;
    this.volume.volume.rampTo(s.volume, 0.05);

    this.rewire(s);

    if (s.reverbDecay !== this.reverbDecay) {
      window.clearTimeout(this.reverbTimer);
      this.reverbTimer = window.setTimeout(() => {
        this.reverbDecay = s.reverbDecay;
        this.reverb.decay = s.reverbDecay; // regenera la respuesta de impulso
      }, 250);
    }

    // Si cambia la afinación con notas mantenidas, las soltamos para evitar notas colgadas.
    if (prev.transpose !== s.transpose || prev.octave !== s.octave) this.releaseAll();
  }

  /**
   * Conecta solo los efectos que están en uso. Un efecto con mezcla 0 no se oye pero sigue
   * consumiendo CPU; con todos activos a la vez el navegador puede quedarse sin tiempo y cortar.
   */
  private rewire(s: SoundSettings) {
    const stages: [string, Tone.ToneAudioNode, boolean][] = [
      ['filter', this.filter, s.filterCutoff < 19900 || s.filterType !== 'lowpass'],
      ['eq', this.eq, s.eqLow !== 0 || s.eqMid !== 0 || s.eqHigh !== 0],
      ['dist', this.distortion, s.distortionWet > 0],
      ['chorus', this.chorus, s.chorusWet > 0],
      ['phaser', this.phaser, s.phaserWet > 0],
      ['vibrato', this.vibrato, s.vibratoWet > 0],
      ['tremolo', this.tremolo, s.tremoloWet > 0],
      ['delay', this.delay, s.delayWet > 0],
      ['reverb', this.reverb, s.reverbWet > 0],
      ['pan', this.panner, s.pan !== 0],
      ['width', this.widener, s.width !== 0.5],
    ];
    const active = stages.filter(([, , on]) => on);
    const key = active.map(([k]) => k).join(',') + (this.analysis ? '+an' : '');
    if (key === this.chainKey) return;
    this.chainKey = key;
    for (const n of [this.input, ...stages.map(([, n]) => n), this.volume, this.compressor, this.limiter]) n.disconnect();
    this.input.chain(...active.map(([, n]) => n), this.volume, this.compressor, this.limiter, Tone.getDestination());
    if (this.analysis) {
      this.limiter.connect(this.waveform);
      this.limiter.connect(this.fft);
    }
  }

  /** El osciloscopio/espectro solo se conecta cuando está visible. */
  setAnalysis(on: boolean) {
    this.analysis = on;
    if (this.ready) this.rewire(this.settings);
  }

  /** Frecuencia final de una tecla aplicando transposición, octava, afinación fina y La de referencia. */
  freqFor(midi: number): number {
    const s = this.settings;
    const sounding = midi + s.transpose + s.octave * 12;
    return s.a4 * Math.pow(2, (sounding - 69) / 12 + s.fineTune / 1200);
  }

  /** Curva de velocidad suave: evita notas casi inaudibles y ataques demasiado duros. */
  private vel(v: number) {
    if (!this.settings.velocitySensitive) return this.settings.fixedVelocity;
    const x = Math.max(0, Math.min(1, v));
    return 0.18 + 0.72 * Math.pow(x, 0.85);
  }

  noteOn(midi: number, velocity = 0.8) {
    if (!this.ready || !this.voice) return;
    const now = Tone.immediate();
    const prev = this.held.get(midi) ?? this.sustained.get(midi);
    if (prev !== undefined) this.voice.release(prev, now);
    this.sustained.delete(midi);
    const f = this.freqFor(midi);
    this.held.set(midi, f);
    this.voice.attack(f, now, this.vel(velocity));
  }

  noteOff(midi: number) {
    if (!this.ready || !this.voice) return;
    const f = this.held.get(midi);
    if (f === undefined) return;
    this.held.delete(midi);
    if (this.pedal) this.sustained.set(midi, f);
    else this.voice.release(f, Tone.immediate());
  }

  setPedal(down: boolean) {
    this.pedal = down;
    useLive.setState({ sustain: down });
    if (!down && this.voice) {
      const now = Tone.immediate();
      for (const f of this.sustained.values()) this.voice.release(f, now);
      this.sustained.clear();
    }
  }

  /** Nota programada (reproducción de canciones / demostraciones). */
  playScheduled(midi: number, duration: number, time: number, velocity = 0.75) {
    if (!this.ready || !this.voice) return;
    this.voice.attackRelease(this.freqFor(midi), Math.max(0.05, duration), time, this.vel(velocity));
  }

  releaseAll() {
    this.voice?.releaseAll();
    this.held.clear();
    this.sustained.clear();
  }
}

export const engine = new AudioEngine();

// ---------------------------------------------------------------------------
// Metrónomo independiente del transporte (puede sonar junto a canciones)

class Metronome {
  private clock: Tone.Clock | null = null;
  private synth: Tone.Synth | null = null;
  private vol: Tone.Volume | null = null;
  private tick = 0;
  private s: MetronomeSettings = { bpm: 90, beatsPerBar: 4, beatUnit: 4, accent: true, volume: -8, subdivision: 1, sound: 'click' };

  init() {
    this.vol = new Tone.Volume(this.s.volume).toDestination();
    this.synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 },
    }).connect(this.vol);
    this.clock = new Tone.Clock((time) => this.onTick(time), this.freq());
  }

  private freq() {
    return (this.s.bpm / 60) * this.s.subdivision;
  }

  private onTick(time: number) {
    if (!this.synth) return;
    const sub = this.s.subdivision;
    const isBeat = this.tick % sub === 0;
    const beat = Math.floor(this.tick / sub) % this.s.beatsPerBar;
    const accent = isBeat && beat === 0 && this.s.accent;
    const base = this.s.sound === 'wood' ? 900 : this.s.sound === 'beep' ? 880 : 1600;
    const f = accent ? base * 1.5 : isBeat ? base : base * 0.75;
    const v = accent ? 1 : isBeat ? 0.7 : 0.35;
    this.synth.triggerAttackRelease(f, 0.03, time, v);
    if (isBeat) Tone.getDraw().schedule(() => useLive.setState({ beat }), time);
    this.tick++;
  }

  configure(s: MetronomeSettings) {
    this.s = s;
    if (!this.synth || !this.clock || !this.vol) return;
    const type = s.sound === 'wood' ? 'triangle' : s.sound === 'beep' ? 'sine' : 'square';
    this.synth.oscillator.type = type;
    this.synth.envelope.decay = s.sound === 'beep' ? 0.08 : 0.04;
    this.vol.volume.value = s.volume;
    this.clock.frequency.value = this.freq();
  }

  start() {
    if (!this.clock) return;
    this.tick = 0;
    this.clock.start(Tone.now() + 0.05);
    useLive.setState({ metronomeOn: true });
  }

  stop() {
    this.clock?.stop();
    useLive.setState({ metronomeOn: false, beat: -1 });
  }

  toggle() {
    if (useLive.getState().metronomeOn) this.stop();
    else this.start();
  }
}

export const metronome = new Metronome();
