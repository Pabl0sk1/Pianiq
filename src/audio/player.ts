import * as Tone from 'tone';
import { engine } from './engine';
import type { Hand, NoteEvent } from '../lib/notation';

export interface PlayerCallbacks {
  onNote?: (e: NoteEvent, on: boolean) => void;
  onEnd?: () => void;
}

/**
 * Reproduce una lista de eventos usando el Transport de Tone.js.
 * Los tiempos de los eventos están en negras; la velocidad real = bpm × speed.
 */
export class SongPlayer {
  private events: NoteEvent[] = [];
  private bpm = 100;
  private speed = 1;
  private startBeat = 0;
  private length = 0;
  private playing = false;
  private pausedAt = 0;
  muted = new Set<Hand>();
  private cb: PlayerCallbacks = {};

  load(events: NoteEvent[], bpm: number, cb: PlayerCallbacks = {}) {
    this.stop();
    this.events = events;
    this.bpm = bpm;
    this.cb = cb;
    this.length = events.reduce((m, e) => Math.max(m, e.time + e.duration), 0);
    this.pausedAt = 0;
  }

  get isPlaying() {
    return this.playing;
  }
  get totalBeats() {
    return this.length;
  }
  get secondsPerBeat() {
    return 60 / (this.bpm * this.speed);
  }

  getBeat(): number {
    if (!this.playing) return this.pausedAt;
    const t = Tone.getTransport();
    return this.startBeat + Math.max(0, t.seconds) / this.secondsPerBeat;
  }

  play(fromBeat = this.pausedAt) {
    if (!engine.isReady) {
      engine.init().then(() => this.play(fromBeat));
      this.playing = true;
      return;
    }
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel(0);
    transport.position = 0;
    this.startBeat = fromBeat;
    const spb = this.secondsPerBeat;
    const draw = Tone.getDraw();

    for (const ev of this.events) {
      if (ev.time + 0.001 < fromBeat) continue;
      const at = (ev.time - fromBeat) * spb;
      const dur = ev.duration * spb;
      const soundDur = (ev.sound ?? ev.duration) * spb;
      transport.schedule((time) => {
        if (!this.muted.has(ev.hand)) engine.playScheduled(ev.midi, soundDur, time, ev.velocity);
        draw.schedule(() => this.cb.onNote?.(ev, true), time);
        draw.schedule(() => this.cb.onNote?.(ev, false), time + dur);
      }, at);
    }
    transport.schedule((time) => {
      draw.schedule(() => {
        this.playing = false;
        this.pausedAt = 0;
        transport.stop();
        this.cb.onEnd?.();
      }, time);
    }, Math.max(0, (this.length - fromBeat) * spb + 0.3));

    transport.start('+0.08');
    this.playing = true;
  }

  pause() {
    if (!this.playing) return;
    this.pausedAt = Math.min(this.getBeat(), this.length);
    this.halt();
  }

  stop() {
    this.pausedAt = 0;
    this.halt();
  }

  private halt() {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel(0);
    this.playing = false;
    engine.releaseAll();
  }

  seek(beat: number) {
    const b = Math.max(0, Math.min(beat, this.length));
    if (this.playing) {
      this.halt();
      this.play(b);
    } else this.pausedAt = b;
  }

  setSpeed(speed: number) {
    if (speed === this.speed) return;
    if (this.playing) {
      const b = this.getBeat();
      this.halt();
      this.speed = speed;
      this.play(b);
    } else this.speed = speed;
  }

  setMuted(hands: Hand[]) {
    this.muted = new Set(hands);
  }
}

/** Reproduce rápidamente una secuencia (demostraciones de lecciones, diccionario, oído). */
export function playSequence(
  steps: { midis: number[]; duration: number }[],
  bpm = 90,
  onStep?: (i: number) => void,
): () => void {
  if (!engine.isReady) {
    let stop = () => {};
    let cancelled = false;
    engine.init().then(() => {
      if (!cancelled) stop = playSequence(steps, bpm, onStep);
    });
    return () => {
      cancelled = true;
      stop();
    };
  }
  const spb = 60 / bpm;
  let t = Tone.immediate() + 0.05;
  const draw = Tone.getDraw();
  const timers: number[] = [];
  let cancelled = false;
  steps.forEach((st, i) => {
    st.midis.forEach((m) => engine.playScheduled(m, st.duration * spb * 0.95, t, 0.75));
    const at = t;
    draw.schedule(() => !cancelled && onStep?.(i), at);
    t += st.duration * spb;
  });
  const endMs = (t - Tone.immediate()) * 1000;
  timers.push(window.setTimeout(() => onStep?.(-1), endMs));
  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
    engine.releaseAll();
    onStep?.(-1);
  };
}
