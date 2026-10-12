// Utilidades de teoría musical: nombres de notas, MIDI, escalas y acordes.

export type Naming = 'latin' | 'english';

export const NOTE_NAMES_EN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTE_NAMES_LATIN = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

const LETTER_SEMITONE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const LETTER_INDEX: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const LATIN_TO_LETTER: Record<string, string> = { do: 'C', re: 'D', mi: 'E', fa: 'F', sol: 'G', la: 'A', si: 'B' };
const LETTER_TO_LATIN: Record<string, string> = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };

export interface ParsedNote {
  letter: string; // C..B
  accidental: number; // -2..2
  octave: number;
  midi: number;
}

/** Interpreta "C#4", "Bb3", "Ebb5", "Fx4" (doble sostenido), "Do#4", "Sib3". */
export function parseNote(name: string): ParsedNote {
  const s = name.trim();
  let m = /^([A-Ga-g])(##|x|#|bb|b)?(-?\d+)$/.exec(s);
  let letter: string;
  let acc: string | undefined;
  let octave: number;
  if (m) {
    letter = m[1].toUpperCase();
    acc = m[2];
    octave = parseInt(m[3], 10);
  } else {
    m = /^(do|re|mi|fa|sol|la|si)(##|x|#|bb|b)?(-?\d+)$/i.exec(s);
    if (!m) throw new Error(`Nota no válida: "${name}"`);
    letter = LATIN_TO_LETTER[m[1].toLowerCase()];
    acc = m[2];
    octave = parseInt(m[3], 10);
  }
  const accidental = acc === '#' ? 1 : acc === '##' || acc === 'x' ? 2 : acc === 'b' ? -1 : acc === 'bb' ? -2 : 0;
  const midi = (octave + 1) * 12 + LETTER_SEMITONE[letter] + accidental;
  return { letter, accidental, octave, midi };
}

export function noteToMidi(name: string): number {
  return parseNote(name).midi;
}

export function midiToName(midi: number, naming: Naming = 'latin', withOctave = true): string {
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const base = naming === 'latin' ? NOTE_NAMES_LATIN[pc] : NOTE_NAMES_EN[pc];
  return withOctave ? `${base}${octave}` : base;
}

/** Convierte un nombre escrito ("Bb3") al sistema elegido conservando la ortografía (Sib3). */
export function spellName(name: string, naming: Naming, withOctave = true): string {
  try {
    const p = parseNote(name);
    const acc = p.accidental === 1 ? '#' : p.accidental === 2 ? '𝄪' : p.accidental === -1 ? 'b' : p.accidental === -2 ? 'bb' : '';
    const base = naming === 'latin' ? LETTER_TO_LATIN[p.letter] : p.letter;
    return `${base}${acc}${withOctave ? p.octave : ''}`;
  } catch {
    return name;
  }
}

export function isBlack(midi: number): boolean {
  return [1, 3, 6, 8, 10].includes(((midi % 12) + 12) % 12);
}

/** Paso diatónico absoluto (C0 = 0, D0 = 1 …) para dibujar en el pentagrama. */
export function diatonicStep(p: ParsedNote): number {
  return p.octave * 7 + LETTER_INDEX[p.letter];
}

export function midiToFreq(midi: number, a4 = 440): number {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

// ---------------------------------------------------------------------------
// Escalas y acordes (intervalos en semitonos desde la tónica)

export interface Formula {
  id: string;
  name: string;
  intervals: number[];
  description: string;
}

export const SCALES: Formula[] = [
  { id: 'major', name: 'Mayor (Jónica)', intervals: [0, 2, 4, 5, 7, 9, 11], description: 'T-T-S-T-T-T-S. Brillante y estable; base de la música tonal.' },
  { id: 'natural-minor', name: 'Menor natural (Eólica)', intervals: [0, 2, 3, 5, 7, 8, 10], description: 'T-S-T-T-S-T-T. Relativa menor de la escala mayor.' },
  { id: 'harmonic-minor', name: 'Menor armónica', intervals: [0, 2, 3, 5, 7, 8, 11], description: 'Menor natural con la 7ª elevada: crea sensible y dominante mayor.' },
  { id: 'melodic-minor', name: 'Menor melódica (ascendente)', intervals: [0, 2, 3, 5, 7, 9, 11], description: '6ª y 7ª elevadas al subir. En clásico desciende como menor natural.' },
  { id: 'dorian', name: 'Dórica', intervals: [0, 2, 3, 5, 7, 9, 10], description: 'Menor con 6ª mayor. Muy usada en jazz, funk y folk.' },
  { id: 'phrygian', name: 'Frigia', intervals: [0, 1, 3, 5, 7, 8, 10], description: 'Menor con 2ª menor. Sonido flamenco / español.' },
  { id: 'lydian', name: 'Lidia', intervals: [0, 2, 4, 6, 7, 9, 11], description: 'Mayor con 4ª aumentada. Sonido etéreo, de bandas sonoras.' },
  { id: 'mixolydian', name: 'Mixolidia', intervals: [0, 2, 4, 5, 7, 9, 10], description: 'Mayor con 7ª menor. Rock, blues y dominantes.' },
  { id: 'locrian', name: 'Locria', intervals: [0, 1, 3, 5, 6, 8, 10], description: 'Con 5ª disminuida. Muy inestable; sobre acordes m7b5.' },
  { id: 'major-pentatonic', name: 'Pentatónica mayor', intervals: [0, 2, 4, 7, 9], description: 'Cinco notas sin semitonos. Ideal para improvisar.' },
  { id: 'minor-pentatonic', name: 'Pentatónica menor', intervals: [0, 3, 5, 7, 10], description: 'La escala del rock y el blues.' },
  { id: 'blues', name: 'Blues', intervals: [0, 3, 5, 6, 7, 10], description: 'Pentatónica menor + la "blue note" (5ª disminuida).' },
  { id: 'chromatic', name: 'Cromática', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], description: 'Los 12 semitonos.' },
  { id: 'whole-tone', name: 'Tonos enteros', intervals: [0, 2, 4, 6, 8, 10], description: 'Simétrica; sonido de ensueño (Debussy).' },
  { id: 'diminished-hw', name: 'Disminuida (semitono-tono)', intervals: [0, 1, 3, 4, 6, 7, 9, 10], description: 'Simétrica; para dominantes 7(b9).' },
  { id: 'diminished-wh', name: 'Disminuida (tono-semitono)', intervals: [0, 2, 3, 5, 6, 8, 9, 11], description: 'Simétrica; para acordes disminuidos.' },
];

export const CHORDS: Formula[] = [
  { id: 'maj', name: 'Mayor', intervals: [0, 4, 7], description: '3ª mayor + 3ª menor. Alegre y estable.' },
  { id: 'min', name: 'Menor', intervals: [0, 3, 7], description: '3ª menor + 3ª mayor. Melancólico.' },
  { id: 'dim', name: 'Disminuido', intervals: [0, 3, 6], description: 'Dos 3ªs menores. Tenso.' },
  { id: 'aug', name: 'Aumentado', intervals: [0, 4, 8], description: 'Dos 3ªs mayores. Suspendido, misterioso.' },
  { id: 'sus2', name: 'Sus2', intervals: [0, 2, 7], description: '2ª en lugar de 3ª. Abierto.' },
  { id: 'sus4', name: 'Sus4', intervals: [0, 5, 7], description: '4ª en lugar de 3ª. Pide resolver a la 3ª.' },
  { id: '6', name: 'Sexta (6)', intervals: [0, 4, 7, 9], description: 'Mayor con 6ª añadida.' },
  { id: 'm6', name: 'Menor sexta (m6)', intervals: [0, 3, 7, 9], description: 'Menor con 6ª mayor añadida.' },
  { id: 'maj7', name: 'Séptima mayor (maj7)', intervals: [0, 4, 7, 11], description: 'Suave y sofisticado.' },
  { id: '7', name: 'Dominante (7)', intervals: [0, 4, 7, 10], description: 'Mayor con 7ª menor. Tensión que resuelve a la tónica.' },
  { id: 'm7', name: 'Menor séptima (m7)', intervals: [0, 3, 7, 10], description: 'Acorde ii en el ii-V-I.' },
  { id: 'mMaj7', name: 'Menor 7ª mayor (mMaj7)', intervals: [0, 3, 7, 11], description: 'Sonido cinematográfico/noir.' },
  { id: 'm7b5', name: 'Semidisminuido (m7b5)', intervals: [0, 3, 6, 10], description: 'ii en tonalidad menor.' },
  { id: 'dim7', name: 'Disminuido 7 (dim7)', intervals: [0, 3, 6, 9], description: 'Simétrico; cuatro 3ªs menores.' },
  { id: 'add9', name: 'Add9', intervals: [0, 4, 7, 14], description: 'Mayor con 9ª añadida (sin 7ª).' },
  { id: 'maj9', name: 'Novena mayor (maj9)', intervals: [0, 4, 7, 11, 14], description: 'maj7 + 9ª.' },
  { id: '9', name: 'Dominante 9', intervals: [0, 4, 7, 10, 14], description: '7 + 9ª.' },
  { id: 'm9', name: 'Menor 9 (m9)', intervals: [0, 3, 7, 10, 14], description: 'm7 + 9ª. Muy usado en neo-soul.' },
  { id: '11', name: 'Oncena (11)', intervals: [0, 7, 10, 14, 17], description: 'Normalmente sin 3ª.' },
  { id: '13', name: 'Treceava (13)', intervals: [0, 4, 10, 14, 21], description: 'Dominante con 9ª y 13ª.' },
  { id: '7b9', name: '7(b9)', intervals: [0, 4, 7, 10, 13], description: 'Dominante alterado, típico en menor.' },
  { id: '7#9', name: '7(#9) "Hendrix"', intervals: [0, 4, 7, 10, 15], description: 'Mezcla 3ª mayor y menor.' },
];

export function buildFromRoot(rootMidi: number, intervals: number[]): number[] {
  return intervals.map((i) => rootMidi + i);
}

export const INTERVAL_NAMES: { semitones: number; name: string; short: string }[] = [
  { semitones: 0, name: 'Unísono', short: 'U' },
  { semitones: 1, name: '2ª menor', short: '2m' },
  { semitones: 2, name: '2ª mayor', short: '2M' },
  { semitones: 3, name: '3ª menor', short: '3m' },
  { semitones: 4, name: '3ª mayor', short: '3M' },
  { semitones: 5, name: '4ª justa', short: '4J' },
  { semitones: 6, name: 'Tritono (4ª aum / 5ª dism)', short: 'TT' },
  { semitones: 7, name: '5ª justa', short: '5J' },
  { semitones: 8, name: '6ª menor', short: '6m' },
  { semitones: 9, name: '6ª mayor', short: '6M' },
  { semitones: 10, name: '7ª menor', short: '7m' },
  { semitones: 11, name: '7ª mayor', short: '7M' },
  { semitones: 12, name: 'Octava', short: '8J' },
];
