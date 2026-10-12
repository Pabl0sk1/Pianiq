import { Midi } from '@tonejs/midi';
import { midiToName } from './music';
import type { Hand, NoteEvent, Song } from './notation';

/** Importa un archivo .mid y lo convierte en una canción de la biblioteca. */
export async function importMidiFile(file: File): Promise<Song> {
  const midi = new Midi(await file.arrayBuffer());
  const bpm = Math.round(midi.header.tempos[0]?.bpm ?? 120);
  const spb = 60 / bpm;
  const ts = midi.header.timeSignatures[0]?.timeSignature as [number, number] | undefined;

  const tracks = midi.tracks.filter((t) => t.notes.length > 0 && t.channel !== 9); // sin percusión
  // Si hay 2+ pistas: la de tono medio más agudo = mano derecha. Si hay una, se divide por el Do central.
  const avg = (t: (typeof tracks)[number]) => t.notes.reduce((a, n) => a + n.midi, 0) / t.notes.length;
  const sorted = [...tracks].sort((a, b) => avg(b) - avg(a));
  const events: NoteEvent[] = [];
  sorted.forEach((t, ti) => {
    for (const n of t.notes) {
      const hand: Hand = tracks.length > 1 ? (ti === 0 ? 'R' : 'L') : n.midi >= 60 ? 'R' : 'L';
      events.push({
        midi: n.midi,
        name: midiToName(n.midi, 'english'),
        time: n.time / spb,
        duration: Math.max(0.05, n.duration / spb),
        hand,
        velocity: n.velocity,
      });
    }
  });
  events.sort((a, b) => a.time - b.time || a.midi - b.midi);
  return {
    id: `midi-${Date.now()}`,
    title: midi.name || file.name.replace(/\.midi?$/i, ''),
    composer: 'Importado (MIDI)',
    difficulty: 3,
    bpm,
    timeSignature: ts && ts.length === 2 ? ts : [4, 4],
    description: `Importado desde ${file.name} · ${events.length} notas`,
    events,
    user: true,
    source: 'midi',
  };
}

/** Exporta eventos (en negras) a un archivo .mid descargable. */
export function exportMidi(events: NoteEvent[], bpm: number, title: string) {
  const midi = new Midi();
  midi.header.setTempo(bpm);
  midi.name = title;
  const spb = 60 / bpm;
  for (const hand of ['R', 'L'] as Hand[]) {
    const evs = events.filter((e) => e.hand === hand);
    if (!evs.length) continue;
    const track = midi.addTrack();
    track.name = hand === 'R' ? 'Mano derecha' : 'Mano izquierda';
    for (const e of evs) track.addNote({ midi: e.midi, time: e.time * spb, duration: e.duration * spb, velocity: e.velocity });
  }
  const blob = new Blob([midi.toArray() as BlobPart], { type: 'audio/midi' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${title.replace(/[^\w\- áéíóúñÁÉÍÓÚÑ]/g, '_')}.mid`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/** Convierte eventos a notación de texto (para editar grabaciones o MIDI importados). */
export function eventsToNotation(events: NoteEvent[], hand: Hand, grid = 0.25): string {
  const evs = events.filter((e) => e.hand === hand);
  const q = (x: number) => Math.round(x / grid) * grid;
  const groups = new Map<number, NoteEvent[]>();
  for (const e of evs) {
    const t = q(e.time);
    groups.set(t, [...(groups.get(t) ?? []), e]);
  }
  const times = [...groups.keys()].sort((a, b) => a - b);
  const out: string[] = [];
  let cursor = 0;
  times.forEach((t, i) => {
    if (t > cursor) out.push(`r:${+(t - cursor).toFixed(3)}`);
    const next = times[i + 1] ?? t + Math.max(grid, q(Math.max(...groups.get(t)!.map((e) => e.duration))));
    const dur = +Math.max(grid, next - t).toFixed(3);
    out.push(`${groups.get(t)!.map((e) => midiToName(e.midi, 'english')).join('+')}:${dur}`);
    cursor = t + dur;
  });
  return out.join(' ');
}
