import type { Song } from '../lib/notation';

// Música de dominio público que el cine hizo famosa.
// Las obras ya incluidas en Pianiq se enlazan por su id; aquí solo se añade la película.

export const FILM_LINKS: { id: string; film: string }[] = [
  { id: 'film-zarathustra', film: '2001: Odisea del espacio (1968)' },
  { id: 'cartoon-danube', film: '2001: Odisea del espacio (1968)' },
  { id: 'cartoon-valkyries', film: 'Apocalypse Now (1979)' },
  { id: 'ode-to-joy', film: 'La naranja mecánica (1971)' },
  { id: 'cartoon-entertainer', film: 'El golpe (1973)' },
  { id: 'joplin-solace', film: 'El golpe (1973)' },
  { id: 'debussy-clair-de-lune', film: "Ocean's Eleven (2001)" },
  { id: 'canon-d', film: 'Gente corriente (1980)' },
  { id: 'mountain-king', film: 'La red social (2010)' },
  { id: 'cartoon-toccata', film: 'Fantasía (1940)' },
];

// ---------------------------------------------------------------------------
// Así habló Zaratustra — Richard Strauss (1896), "Amanecer". Arreglo propio.
// Pedal grave de Do todo el tiempo; trompetas Do–Sol–Do; acorde mayor que se vuelve
// menor (y al revés), timbales, y en la tercera llamada el ascenso hasta el gran Do mayor.
const pedal = 'C1+C2:w';
const call = 'C4:h G4:h | C5:w';
const timpani = 'C2:e G1 C2 G1 C2 G1 C2:q';
const R = [
  'r:w | r:w | r:w | r:w',
  call,
  'C4+E4+G4+C5+E5:q. C4+Eb4+G4+C5+Eb5:h r:e',
  'r:w',
  call,
  'C4+Eb4+G4+C5+Eb5:q. C4+E4+G4+C5+E5:h r:e',
  'r:w',
  call,
  'C4+E4+G4+C5+E5:h C4+F4+A4+C5+F5:h',
  'D4+F4+A4+D5:h G3+D4+G4+B4+D5:h',
  'C4+E4+G4+C5+E5+G5+C6:w',
  'C4+E4+G4+C5+E5+G5+C6:w',
].join(' | ');
const L = [
  [pedal, pedal, pedal, pedal].join(' | '),
  `${pedal} | ${pedal}`,
  pedal,
  timpani,
  `${pedal} | ${pedal}`,
  pedal,
  timpani,
  `${pedal} | ${pedal}`,
  pedal,
  'C1+C2:h G1+G2:h',
  'C1+C2+G2:w',
  'C1+C2+G2:w',
].join(' | ');

export const FILM_SONGS: Song[] = [
  {
    id: 'film-zarathustra',
    title: 'Así habló Zaratustra (Amanecer)',
    composer: 'Richard Strauss',
    period: 'Poema sinfónico, Op. 30 · 1896 · arreglo propio',
    difficulty: 2,
    bpm: 56,
    timeSignature: [4, 4],
    description:
      'El amanecer que abre "2001: Odisea del espacio": un Do grave inmóvil, la llamada de las trompetas (Do–Sol–Do), el acorde que pasa de mayor a menor, los timbales y, a la tercera, el estallido final. Arreglo propio del comienzo de la obra. Suena impresionante con el Órgano de Tubos y mucha reverb.',
    tracks: [
      { hand: 'R', notes: R, velocity: 0.9 },
      { hand: 'L', notes: L, velocity: 0.8 },
    ],
  },
];
