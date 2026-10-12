// Notación de texto para escribir música de forma compacta.
//
//   Formato de cada elemento:  NOTAS:DURACIÓN
//     NOTAS     "C4", "F#3", "Bb2", acorde "C4+E4+G4", silencio "r"
//     DURACIÓN  en negras: w=4 (redonda), h=2 (blanca), q=1 (negra), e=0.5 (corchea),
//               s=0.25 (semicorchea), t=1/3 (corchea de tresillo), o número libre (1.5, 0.75…).
//               Un punto al final añade la mitad (h. = 3, q. = 1.5, e. = 0.75).
//     Si se omite la duración se reutiliza la anterior.
//   Las barras "|" y los saltos de línea son decorativos (se ignoran).
//
//   Ejemplo:  E5:s D#5 E5 B4 D5 C5 | A4:e r:s C4:s E4 A4

import { noteToMidi } from './music';

export type Hand = 'R' | 'L';

export interface NoteEvent {
  midi: number;
  name: string; // ortografía original (p. ej. "Bb3")
  time: number; // en negras desde el inicio
  duration: number; // en negras
  /** Duración real de sonido si el pedal automático la alarga (la visual sigue siendo `duration`) */
  sound?: number;
  hand: Hand;
  velocity: number;
}

export interface TrackDef {
  hand: Hand;
  notes: string;
  velocity?: number;
}

export interface Song {
  id: string;
  title: string;
  composer: string;
  period?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  bpm: number; // negras por minuto
  timeSignature: [number, number];
  description?: string;
  tracks?: TrackDef[];
  events?: NoteEvent[]; // canciones importadas / grabadas
  user?: boolean;
  source?: 'notation' | 'midi' | 'recording' | 'audio';
  /** false = estilo con acompañamiento seco (cumbia, rock): no usar el pedal automático */
  pedal?: boolean;
  /** Negras de anacrusa antes del primer compás completo */
  pickup?: number;
  /** Canción guardada en src/data/library (biblioteca permanente) */
  pinned?: boolean;
}

const DUR: Record<string, number> = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25, t: 1 / 3, x: 0.125 };

export function parseDuration(token: string): number {
  let t = token.trim();
  let dotted = false;
  if (t.endsWith('.') && t.length > 1) {
    dotted = true;
    t = t.slice(0, -1);
  }
  let base: number;
  if (t in DUR) base = DUR[t];
  else if (/^\d+\/\d+$/.test(t)) {
    const [a, b] = t.split('/').map(Number);
    base = a / b;
  } else {
    base = parseFloat(t);
    if (!isFinite(base) || base <= 0) throw new Error(`Duración no válida: "${token}"`);
  }
  return dotted ? base * 1.5 : base;
}

export interface ParsedToken {
  names: string[]; // vacío = silencio
  duration: number;
}

export function tokenize(text: string): ParsedToken[] {
  const out: ParsedToken[] = [];
  let lastDur = 1;
  const cleaned = text.replace(/\/\/[^\n]*/g, ' ').replace(/\|/g, ' ');
  for (const raw of cleaned.split(/\s+/)) {
    if (!raw) continue;
    const [notesPart, durPart] = raw.split(':');
    const duration = durPart !== undefined && durPart !== '' ? parseDuration(durPart) : lastDur;
    lastDur = duration;
    const lower = notesPart.toLowerCase();
    if (lower === 'r' || lower === 'rest' || lower === '-') {
      out.push({ names: [], duration });
      continue;
    }
    const names = notesPart.split('+').filter(Boolean);
    names.forEach((n) => noteToMidi(n)); // valida
    out.push({ names, duration });
  }
  return out;
}

export function parseTrack(text: string, hand: Hand, velocity = 0.75, legato = 0.96): NoteEvent[] {
  const events: NoteEvent[] = [];
  let time = 0;
  for (const tok of tokenize(text)) {
    for (const name of tok.names) {
      events.push({ midi: noteToMidi(name), name, time, duration: tok.duration * legato, hand, velocity });
    }
    time += tok.duration;
  }
  return events;
}

const cache = new WeakMap<Song, NoteEvent[]>();

export function songEvents(song: Song): NoteEvent[] {
  const hit = cache.get(song);
  if (hit) return hit;
  let events: NoteEvent[];
  if (song.events) events = [...song.events];
  else
    events = (song.tracks ?? []).flatMap((t) => {
      // Matiz expresivo: la mano izquierda un poco más suave por defecto.
      const vel = t.velocity ?? (t.hand === 'L' ? 0.6 : 0.78);
      return parseTrack(t.notes, t.hand, vel);
    });
  events.sort((a, b) => a.time - b.time || a.midi - b.midi);
  cache.set(song, events);
  return events;
}

export function songLength(events: NoteEvent[]): number {
  return events.reduce((m, e) => Math.max(m, e.time + e.duration), 0);
}

/**
 * Pedal automático: imita cómo pedalea un pianista para que la reproducción suene ligada.
 * - Mano izquierda (bajos, arpegios, acordes): cada nota resuena hasta el final de su compás,
 *   como si el pedal se cambiara en cada armonía.
 * - Mano derecha (melodía): legato; cada nota se une con la siguiente si el hueco es pequeño,
 *   sin emborronar las notas por grado conjunto.
 * Nunca se alarga una nota por encima del siguiente ataque de la misma tecla.
 */
export function applyAutoPedal(events: NoteEvent[], barLen: number, pickup = 0): NoteEvent[] {
  const nextSame = new Map<NoteEvent, number>();
  const lastByMidi = new Map<number, NoteEvent>();
  for (const e of events) {
    const prev = lastByMidi.get(e.midi);
    if (prev) nextSame.set(prev, e.time);
    lastByMidi.set(e.midi, e);
  }
  const onsets: Record<Hand, number[]> = { R: [], L: [] };
  for (const e of events) {
    const arr = onsets[e.hand];
    if (arr[arr.length - 1] !== e.time) arr.push(e.time);
  }
  const nextOnset = (hand: Hand, t: number) => {
    const arr = onsets[hand];
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] <= t + 1e-6) lo = mid + 1;
      else hi = mid;
    }
    return arr[lo] ?? Infinity;
  };
  return events.map((e) => {
    const end = e.time + e.duration;
    let target: number;
    if (e.hand === 'L') {
      const barEnd = pickup + (Math.floor((e.time - pickup) / barLen + 1e-6) + 1) * barLen;
      target = Math.max(end, barEnd);
    } else {
      const next = nextOnset('R', e.time);
      // Une con la siguiente nota (hasta 2 negras de hueco) con un pequeño solapamiento
      target = next - end < 2 ? Math.max(end, next + 0.15) : end + 0.5;
    }
    const limit = (nextSame.get(e) ?? Infinity) - 0.02;
    const newEnd = Math.max(end, Math.min(target, limit));
    return newEnd === end ? e : { ...e, sound: newEnd - e.time };
  });
}

/** Pasos de un ejercicio: cada elemento (nota o acorde) es un paso a tocar. */
export function parseSteps(text: string): { names: string[]; midis: number[]; duration: number }[] {
  return tokenize(text)
    .filter((t) => t.names.length > 0)
    .map((t) => ({ names: t.names, midis: t.names.map(noteToMidi), duration: t.duration }));
}

/** Repite un fragmento n veces (útil para escribir canciones). */
export const rep = (s: string, n: number) => Array.from({ length: n }, () => s).join(' ');
