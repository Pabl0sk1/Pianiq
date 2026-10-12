// Transcripción automática audio → notas con Basic Pitch (Spotify, Apache-2.0).
// Se carga bajo demanda: TensorFlow.js y el modelo solo se descargan al convertir.
import { midiToName } from './music';
import type { Hand, NoteEvent, Song } from './notation';

export type SourceKind = 'piano' | 'mix';

export interface ConvertOptions {
  kind: SourceKind;
  /** 0 = conservador (menos notas), 1 = sensible (más notas) */
  sensitivity: number;
  /** BPM conocido; si es 0 se estima automáticamente */
  bpm: number;
  onProgress?: (stage: string, pct: number) => void;
}

const SAMPLE_RATE = 22050;
const MODEL_URL = `${import.meta.env.BASE_URL}basic-pitch/model.json`;

async function decodeTo22k(file: File): Promise<AudioBuffer> {
  const data = await file.arrayBuffer();
  const ctx = new AudioContext();
  const decoded = await ctx.decodeAudioData(data);
  ctx.close();
  const length = Math.ceil(decoded.duration * SAMPLE_RATE);
  const off = new OfflineAudioContext(1, length, SAMPLE_RATE);
  const src = off.createBufferSource();
  src.buffer = decoded;
  src.connect(off.destination); // la mezcla a mono es automática al tener 1 canal
  src.start();
  return off.startRendering();
}

/** Estima el tempo por autocorrelación de los ataques (60–180 BPM). */
export function estimateBpm(onsets: number[]): number {
  if (onsets.length < 8) return 100;
  const res = 0.01;
  const len = Math.ceil(Math.max(...onsets) / res) + 1;
  const env = new Float32Array(len);
  for (const t of onsets) {
    const i = Math.round(t / res);
    env[i] += 1;
    if (i + 1 < len) env[i + 1] += 0.5;
    if (i > 0) env[i - 1] += 0.5;
  }
  let best = 100;
  let bestScore = -1;
  for (let bpm = 60; bpm <= 180; bpm++) {
    const lag = 60 / bpm / res;
    let score = 0;
    // Pulso, doble y medio pulso refuerzan el candidato
    for (const mult of [1, 2, 0.5]) {
      const L = Math.round(lag * mult);
      if (L < 2 || L >= len) continue;
      let s = 0;
      for (let i = 0; i + L < len; i++) s += env[i] * env[i + L];
      score += s * (mult === 1 ? 1 : 0.5);
    }
    // Ligera preferencia por tempos moderados
    score *= 1 - Math.abs(bpm - 110) / 400;
    if (score > bestScore) {
      bestScore = score;
      best = bpm;
    }
  }
  return best;
}

const STREAMING = /(^|\.)(youtube\.com|youtu\.be|spotify\.com|music\.apple\.com|soundcloud\.com|tiktok\.com|instagram\.com|deezer\.com|tidal\.com)$/i;

/** Descarga un audio desde un enlace directo y lo devuelve como archivo. */
export async function fetchAudioFromUrl(link: string): Promise<File> {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    throw new Error('El enlace no es válido.');
  }
  if (STREAMING.test(url.hostname))
    throw new Error(
      `${url.hostname} no permite descargar su audio (sus condiciones de uso lo prohíben). Usa un enlace directo a un archivo .mp3/.wav/.ogg o sube el archivo desde tu equipo.`,
    );
  // Enlaces de Dropbox y Google Drive → descarga directa
  if (url.hostname.endsWith('dropbox.com')) url.searchParams.set('dl', '1');
  const drive = /drive\.google\.com\/file\/d\/([^/]+)/.exec(url.href);
  if (drive) url = new URL(`https://drive.google.com/uc?export=download&id=${drive[1]}`);

  let res: Response;
  try {
    res = await fetch(`/__fetch?url=${encodeURIComponent(url.href)}`);
    if (res.status === 404) res = await fetch(url.href); // versión compilada sin servidor de desarrollo
  } catch {
    res = await fetch(url.href);
  }
  if (!res.ok) throw new Error(await res.text().catch(() => `Error ${res.status}`));
  const blob = await res.blob();
  const name = decodeURIComponent(url.pathname.split('/').pop() || 'audio') || 'audio';
  return new File([blob], name, { type: blob.type });
}

export async function convertAudio(file: File, opts: ConvertOptions): Promise<Song> {
  const report = opts.onProgress ?? (() => {});
  report('Leyendo y preparando el audio…', 0);
  const audio = await decodeTo22k(file);

  report('Cargando el modelo de IA…', 0);
  const bp = await import('@spotify/basic-pitch');
  const model = new bp.BasicPitch(MODEL_URL);

  const frames: number[][] = [];
  const onsets: number[][] = [];
  const contours: number[][] = [];
  await model.evaluateModel(
    audio,
    (f, o, c) => {
      frames.push(...f);
      onsets.push(...o);
      contours.push(...c);
    },
    (p) => report('Escuchando y detectando notas…', p),
  );

  report('Limpiando la transcripción…', 1);
  const s = Math.max(0, Math.min(1, opts.sensitivity));
  const mix = opts.kind === 'mix';
  const onsetThresh = (mix ? 0.65 : 0.55) - s * 0.3;
  const frameThresh = (mix ? 0.45 : 0.35) - s * 0.2;
  const minLen = mix ? 11 : 6; // frames (~11.6 ms cada uno)
  const raw = bp.noteFramesToTime(
    bp.addPitchBendsToNoteEvents(
      contours,
      bp.outputToNotesPoly(frames, onsets, onsetThresh, frameThresh, minLen, true, mix ? 2100 : null, mix ? 55 : null, true),
    ),
  );

  // Filtrado: fuera notas muy débiles y, en mezclas, limita la polifonía por ataque
  const maxAmp = Math.max(0.01, ...raw.map((n) => n.amplitude));
  let notes = raw.filter((n) => n.amplitude / maxAmp > (mix ? 0.3 : 0.15) && n.pitchMidi >= 21 && n.pitchMidi <= 108);
  if (mix) {
    const groups = new Map<number, typeof notes>();
    for (const n of notes) {
      const k = Math.round(n.startTimeSeconds / 0.05);
      groups.set(k, [...(groups.get(k) ?? []), n]);
    }
    notes = [...groups.values()].flatMap((g) => g.sort((a, b) => b.amplitude - a.amplitude).slice(0, 5));
  }
  notes.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);

  // Quita armónicos fantasma: notas a 8ª, 12ª, 15ª, 17ª o 19ª por encima de otra que empieza
  // a la vez (±60 ms) y que suenan más débiles que ella. El oído las percibe como timbre, no como notas.
  const HARMONICS: Record<number, number> = { 12: 0.75, 19: 1.1, 24: 1.2, 28: 1.3, 31: 1.3, 34: 1.4, 36: 1.4 };
  notes = notes.filter(
    (n) =>
      !notes.some((m) => {
        if (m === n || Math.abs(m.startTimeSeconds - n.startTimeSeconds) > 0.06) return false;
        const ratio = HARMONICS[n.pitchMidi - m.pitchMidi];
        return ratio !== undefined && n.amplitude < m.amplitude * ratio;
      }),
  );
  if (!notes.length) throw new Error('No se detectaron notas. Prueba con más sensibilidad o con un audio de piano más limpio.');

  const t0 = notes[0].startTimeSeconds;
  const bpm = opts.bpm > 0 ? opts.bpm : estimateBpm(notes.map((n) => n.startTimeSeconds - t0));
  const bps = bpm / 60;
  const events: NoteEvent[] = notes.map((n) => {
    const hand: Hand = n.pitchMidi >= 60 ? 'R' : 'L';
    return {
      midi: n.pitchMidi,
      name: midiToName(n.pitchMidi, 'english'),
      time: (n.startTimeSeconds - t0) * bps,
      duration: Math.max(0.1, n.durationSeconds * bps),
      hand,
      velocity: Math.max(0.3, Math.min(1, 0.35 + (n.amplitude / maxAmp) * 0.65)),
    };
  });

  return {
    id: `audio-${Date.now()}`,
    title: file.name.replace(/\.[^.]+$/, ''),
    composer: 'Transcrito de audio',
    difficulty: 3,
    bpm,
    timeSignature: [4, 4],
    description: `Transcripción automática (${mix ? 'mezcla completa' : 'piano solo'}) de ${file.name} · ${events.length} notas · ${Math.round(audio.duration)} s`,
    events,
    user: true,
    source: 'audio',
  };
}
