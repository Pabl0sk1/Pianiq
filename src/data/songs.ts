import { rep, type NoteEvent, type Song } from '../lib/notation';
import mountainEvents from './pd-midi/mountain-king.json';
import { CLASSICAL_EXTRA } from './classical-extra';

// Todas las duraciones están en negras (q=1, e=0.5, s=0.25, h=2, w=4, t=1/3).
// Para añadir una canción nueva basta con escribir sus manos en este formato.

// ---------------------------------------------------------------------------
// Für Elise — Beethoven (WoO 59)
const FE_A_R = `E5:s D#5 E5 B4 D5 C5 | A4:e r:s C4:s E4 A4 | B4:e r:s E4:s G#4 B4 | C5:e r:s E4:s E5 D#5 |
  E5:s D#5 E5 B4 D5 C5 | A4:e r:s C4:s E4 A4 | B4:e r:s E4:s C5 B4`;
const FE_A_L = `r:q. | A2:s E3 A3 r r r | E2:s E3 G#3 r r r | A2:s E3 A3 r r r |
  r:q. | A2:s E3 A3 r r r | E2:s E3 G#3 r r r`;
const FE_B_R = `E5:e. G4:s F5 E5 | D5:e. F4:s E5 D5 | C5:e. E4:s D5 C5 | B4:e r:s E4:s E5 r |
  r:s E5 E6 r r D#5 | E5:s r r D#5 E5 D#5`;
const FE_B_L = `C3:s G3 C4 r r r | G2:s G3 B3 r r r | A2:s E3 A3 r r r | E2:s E3 r r r r | r:q. | r:q.`;

const furElise: Song = {
  id: 'fur-elise',
  title: 'Para Elisa (Für Elise)',
  composer: 'Ludwig van Beethoven',
  period: 'Clásico / Romántico · 1810',
  difficulty: 3,
  bpm: 66,
  timeSignature: [3, 8],
  pickup: 0.5,
  description:
    'Bagatela en La menor. Sección A con su famoso vaivén Mi–Re#, y sección B en Do mayor. Mantén la mano izquierda ligera y el pedal en cada arpegio.',
  tracks: [
    {
      hand: 'R',
      notes: `E5:s D#5 | ${FE_A_R} | A4:e r:e E5:s D#5 | ${FE_A_R} | A4:e r:s B4:s C5 D5 | ${FE_B_R} | ${FE_A_R} | A4:q.`,
    },
    {
      hand: 'L',
      notes: `r:e | ${FE_A_L} | A2:s E3 A3 r r r | ${FE_A_L} | A2:s E3 A3 r r r | ${FE_B_L} | ${FE_A_L} | A2:s E3:s A3:q`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Himno a la Alegría — Beethoven (9ª Sinfonía), versión en Do
const odeA = 'E4:q E4 F4 G4 | G4 F4 E4 D4 | C4 C4 D4 E4';
const ode: Song = {
  id: 'ode-to-joy',
  title: 'Himno a la Alegría',
  composer: 'Ludwig van Beethoven',
  period: 'Clásico / Romántico · 1824',
  difficulty: 1,
  bpm: 100,
  timeSignature: [4, 4],
  description: 'Tema del final de la Novena Sinfonía. Perfecto para la posición de Do: cinco dedos, cinco notas.',
  tracks: [
    {
      hand: 'R',
      notes: `${odeA} | E4:q. D4:e D4:h | ${odeA} | D4:q. C4:e C4:h |
        D4:q D4 E4 C4 | D4:q E4:e F4:e E4:q C4:q | D4:q E4:e F4:e E4:q D4:q | C4:q D4:q G3:h |
        ${odeA} | D4:q. C4:e C4:h`,
    },
    {
      hand: 'L',
      notes: `C3+G3:w | G2+G3:w | C3+G3:w | G2+B2:h G2+D3:h |
        C3+G3:w | G2+G3:w | C3+G3:w | G2+D3:h C3+G3:h |
        G2+D3:h C3+G3:h | G2+D3:h C3+G3:h | G2+D3:h G2+B2:h | C3+E3:h G2+D3:h |
        C3+G3:w | G2+G3:w | C3+G3:w | G2+D3:h C3+G3+C4:h`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Minueto en Sol — Christian Petzold (Cuaderno de Anna Magdalena Bach, BWV Anh. 114)
const minuetPhrase = `D5:q G4:e A4 B4 C5 | D5:q G4 G4 | E5:q C5:e D5 E5 F#5 | G5:q G4 G4 |
  C5:q D5:e C5 B4 A4 | B4:q C5:e B4 A4 G4`;
const minuet: Song = {
  id: 'minuet-g',
  title: 'Minueto en Sol mayor',
  composer: 'Christian Petzold (atrib. J. S. Bach)',
  period: 'Barroco · c. 1725',
  difficulty: 2,
  bpm: 112,
  timeSignature: [3, 4],
  description:
    'Del Cuaderno de Anna Magdalena Bach. Danza elegante en 3/4: articula las corcheas con claridad y marca ligeramente el primer tiempo.',
  tracks: [
    {
      hand: 'R',
      notes: `${minuetPhrase} | F#4:q G4:e A4 B4 G4 | A4:h. | ${minuetPhrase} | A4:q B4:e A4 G4 F#4 | G4:h.`,
    },
    {
      hand: 'L',
      notes: `G3+B3+D4:h A3:q | B3:h. | C4:h. | B3:h. | A3:h. | G3:h. | D4:q B3 G3 | D4:q D3:e C4 B3 A3 |
        B3:h A3:q | G3:q B3 G3 | C4:h. | B3:q C4:e B3 A3 G3 | A3:h F#3:q | G3:h B3:q | C4:q D4 D3 | G3:h G2:q`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Canon en Re — Johann Pachelbel (arreglo)
const canonBass = 'D3+A3:h A2+E3 B2+F#3 F#2+C#3 G2+D3 D2+A2 G2+D3 A2+E3';
const canon: Song = {
  id: 'canon-d',
  title: 'Canon en Re',
  composer: 'Johann Pachelbel',
  period: 'Barroco · c. 1680',
  difficulty: 2,
  bpm: 66,
  timeSignature: [4, 4],
  description:
    'Un bajo de ocho notas que se repite (bajo ostinato) mientras la melodía se va enriqueciendo: blancas, negras y luego más movimiento.',
  tracks: [
    {
      hand: 'R',
      notes: `r:w r:w r:w r:w |
        F#5:h E5 D5 C#5 B4 A4 B4 C#5 |
        D5:h C#5 B4 A4 G4 F#4 G4 E4 |
        D4:q F#4 A4 G4 | F#4 D4 F#4 E4 | D4 B3 D4 A4 | G4 B4 A4 G4 |
        F#4 D4 E4 C#5 | D5 F#5 A5 A4 | B4 G4 A4 F#4 | D4 D5 D5:h |
        D5+F#5+A5:w`,
    },
    { hand: 'L', notes: `${rep(canonBass, 5)} | D2+D3:w` },
  ],
};

// ---------------------------------------------------------------------------
// Gymnopédie n.º 1 — Erik Satie
const gymG = 'G2:q F#3+B3+D4:h';
const gymD = 'D2:q F#3+A3+C#4:h';
const gymnopedie: Song = {
  id: 'gymnopedie-1',
  title: 'Gymnopédie n.º 1',
  composer: 'Erik Satie',
  period: 'Impresionismo · 1888',
  difficulty: 2,
  bpm: 72,
  timeSignature: [3, 4],
  description:
    '"Lent et douloureux". Acordes de séptima mayor que se balancean (Sol maj7 – Re maj7) y una melodía flotante. Usa el pedal en cada compás.',
  tracks: [
    {
      hand: 'R',
      notes: `r:h. r:h. r:h. r:h. |
        r:q F#5 A5 | G5 F#5 C#5 | B4 C#5 D5 | A4:h. | F#4:12 |
        r:q F#5 A5 | G5 F#5 C#5 | B4 C#5 D5 | A4:h. | C#5:h. | F#5:h. | E5:6 |
        D5:h.`,
    },
    { hand: 'L', notes: `${rep(`${gymG} ${gymD}`, 10)} | G2+D3:h.` },
  ],
};

// ---------------------------------------------------------------------------
// Preludio en Do mayor — J. S. Bach (El clave bien temperado I, BWV 846)
const preludeChords = [
  'C4 E4 G4 C5 E5', 'C4 D4 A4 D5 F5', 'B3 D4 G4 D5 F5', 'C4 E4 G4 C5 E5',
  'C4 E4 A4 E5 A5', 'C4 D4 F#4 A4 D5', 'B3 D4 G4 D5 G5', 'B3 C4 E4 G4 C5',
  'A3 C4 E4 G4 C5', 'D3 A3 D4 F#4 C5', 'G3 B3 D4 G4 B4', 'G3 Bb3 E4 G4 C#5',
  'F3 A3 D4 A4 D5', 'F3 Ab3 D4 F4 B4', 'E3 G3 C4 G4 C5', 'E3 F3 A3 C4 F4',
  'D3 F3 A3 C4 F4', 'G2 D3 G3 B3 F4', 'C3 E3 G3 C4 E4', 'C3 G3 Bb3 C4 E4',
  'F2 F3 A3 C4 E4', 'F#2 C3 A3 C4 Eb4', 'Ab2 F3 B3 C4 D4', 'G2 F3 G3 B3 D4',
  'G2 E3 G3 C4 E4', 'G2 D3 G3 C4 F4', 'G2 D3 G3 B3 F4', 'G2 Eb3 A3 C4 F#4',
  'G2 E3 G3 C4 G4', 'G2 D3 G3 C4 F4', 'G2 D3 G3 B3 F4', 'C2 C3 G3 Bb3 E4',
].map((c) => c.split(' '));
const preludeR = preludeChords.map(([, , a, b, c]) => rep(`r:e ${a}:s ${b} ${c} ${a} ${b} ${c}`, 2)).join(' | ');
const preludeL1 = preludeChords.map(([n1]) => `${n1}:h ${n1}:h`).join(' | ');
const preludeL2 = preludeChords.map(([, n2]) => `r:s ${n2}:1.75 r:s ${n2}:1.75`).join(' | ');
const prelude: Song = {
  id: 'prelude-c',
  title: 'Preludio en Do mayor',
  composer: 'Johann Sebastian Bach',
  period: 'Barroco · 1722',
  difficulty: 3,
  bpm: 66,
  timeSignature: [4, 4],
  description:
    'Primer preludio de "El clave bien temperado". Cada compás es un acorde arpegiado con el mismo dibujo: un estudio perfecto de armonía en movimiento.',
  tracks: [
    { hand: 'R', notes: `${preludeR} | C4+E4+G4+C5:w` },
    { hand: 'L', notes: `${preludeL1} | C2+C3:w` },
    { hand: 'L', notes: `${preludeL2} | r:w`, velocity: 0.5 },
  ],
};


// ---------------------------------------------------------------------------
// Pequeña Serenata Nocturna — Mozart (K. 525, tema inicial)
const nachtmusik: Song = {
  id: 'nachtmusik',
  title: 'Pequeña Serenata Nocturna (tema)',
  composer: 'Wolfgang Amadeus Mozart',
  period: 'Clásico · 1787',
  difficulty: 2,
  bpm: 120,
  timeSignature: [4, 4],
  description: 'Eine kleine Nachtmusik, K. 525. Notas cortas y enérgicas: piensa en un "staccato" alegre y preciso.',
  tracks: [
    {
      hand: 'R',
      notes: `G4:q r:e D4:e G4:q r:e D4:e | G4:e D4 G4 B4 D5:q r:q |
        C5:q r:e A4:e C5:q r:e A4:e | C5:e A4 F#4 A4 D4:q r:q |
        G4:q r:e D4:e G4:q r:e D4:e | G4:e D4 G4 B4 D5:q r:q |
        C5:q r:e A4:e C5:q r:e A4:e | C5:e A4 F#4 A4 G4:h`,
    },
    {
      hand: 'L',
      notes: `G2+G3:q r:e D3:e G2+G3:q r:e D3:e | G2:e D3 G3 B3 D3:q r:q |
        D3+C4:q r:e A3:e D3+C4:q r:e A3:e | D3+C4:e A3 F#3 A3 D3:q r:q |
        G2+G3:q r:e D3:e G2+G3:q r:e D3:e | G2:e D3 G3 B3 D3:q r:q |
        D3+C4:q r:e A3:e D3+C4:q r:e A3:e | D3:e F#3 D3 C3 B2+G3:h`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Canción de cuna — Brahms (Wiegenlied, Op. 49 n.º 4)
const ump = (root: string, chord: string) => `${root}:q ${chord}:q ${chord}:q`;
const brahms: Song = {
  id: 'brahms-lullaby',
  title: 'Canción de cuna',
  composer: 'Johannes Brahms',
  period: 'Romántico · 1868',
  difficulty: 1,
  bpm: 92,
  timeSignature: [3, 4],
  description: 'Wiegenlied. Balanceo de vals suave: la mano izquierda hace "bajo-acorde-acorde" y la derecha canta.',
  tracks: [
    {
      hand: 'R',
      notes: `r:q r:q E4:e E4:e | G4:h E4:e E4:e | G4:h E4:e G4:e | C5:q B4:q. A4:e | A4:q G4:q D4:e E4:e |
        F4:q D4:q D4:e E4:e | F4:h D4:e F4:e | B4:e A4:e G4:q B4:q | C5:h C4:e C4:e |
        C5:h A4:e F4:e | G4:h E4:e C4:e | F4:q G4:q A4:q | G4:h C4:e C4:e |
        C5:h A4:e F4:e | G4:h E4:e C4:e | F4:q E4:q D4:q | C4:h.`,
    },
    {
      hand: 'L',
      notes: `r:h. | ${ump('C3', 'E3+G3')} | ${ump('C3', 'E3+G3')} | ${ump('G2', 'D3+F3')} | ${ump('G2', 'D3+F3')} |
        ${ump('G2', 'D3+F3')} | ${ump('G2', 'D3+F3')} | ${ump('G2', 'D3+F3')} | ${ump('C3', 'E3+G3')} |
        ${ump('F2', 'C3+F3')} | ${ump('C3', 'E3+G3')} | ${ump('F2', 'C3+F3')} | ${ump('C3', 'E3+G3')} |
        ${ump('F2', 'C3+F3')} | ${ump('C3', 'E3+G3')} | ${ump('G2', 'D3+F3')} | C3+E3+G3:h.`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Estrellita (Ah! vous dirai-je, maman) — tema de las Variaciones K. 265 de Mozart
const twA = 'C4:q C4 G4 G4 | A4 A4 G4:h | F4:q F4 E4 E4 | D4 D4 C4:h';
const twB = 'G4:q G4 F4 F4 | E4 E4 D4:h';
const twinkle: Song = {
  id: 'twinkle',
  title: 'Estrellita, ¿dónde estás? (tema de Mozart)',
  composer: 'Tradicional francés / W. A. Mozart (K. 265)',
  period: 'Clásico · 1781',
  difficulty: 1,
  bpm: 100,
  timeSignature: [4, 4],
  description: 'Tema sobre el que Mozart escribió 12 variaciones. La primera pieza ideal para empezar.',
  tracks: [
    { hand: 'R', notes: `${twA} | ${twB} | ${twB} | ${twA}` },
    {
      hand: 'L',
      notes: `C3:h E3 | F3 E3 | D3 C3 | G2 C3 |
        E3 D3 | C3 G2 | E3 D3 | C3 G2 |
        C3 E3 | F3 E3 | D3 C3 | G2 C3`,
    },
  ],
};

// ---------------------------------------------------------------------------
// La Primavera — Vivaldi (Las cuatro estaciones, tema del Allegro)
const spring: Song = {
  id: 'spring',
  title: 'La Primavera (Allegro)',
  composer: 'Antonio Vivaldi',
  period: 'Barroco · 1725',
  difficulty: 2,
  bpm: 100,
  timeSignature: [4, 4],
  description: 'Tema del primer movimiento de "La Primavera". Alegre, en Mi mayor, con los famosos trinos de pájaros.',
  tracks: [
    {
      hand: 'R',
      notes: `r:h. E4:q | G#4:q G#4 G#4 F#4:e E4:e | B4:h. B4:e A4:e | G#4:q G#4 G#4 F#4:e E4:e | B4:h. B4:e A4:e |
        G#4:q A4:e B4:e A4:q G#4:q | F#4:h. E4:q | G#4:q G#4 G#4 F#4:e E4:e | B4:h. B4:e A4:e |
        G#4:q G#4 G#4 F#4:e E4:e | B4:h. B4:e A4:e | G#4:q A4:e B4:e A4:q G#4:q | F#4:h E4:h`,
    },
    {
      hand: 'L',
      notes: `r:w | E3+B3:h E3+B3:h | E3+G#3:h E3+G#3:h | E3+B3:h E3+B3:h | E3+G#3:h E3+G#3:h |
        E3+B3:h F#3+A3:h | B2+F#3:h B2+D#3:h | E3+B3:h E3+B3:h | E3+G#3:h E3+G#3:h |
        E3+B3:h E3+B3:h | E3+G#3:h E3+G#3:h | E3+B3:h F#3+A3:h | B2+F#3:h E2+E3:h`,
    },
  ],
};

// ---------------------------------------------------------------------------
// En la gruta del rey de la montaña — Grieg (Peer Gynt)
const hall: Song = {
  id: 'mountain-king',
  title: 'En la gruta del rey de la montaña',
  composer: 'Edvard Grieg',
  period: 'Romántico · 1875 · versión para piano del autor',
  difficulty: 4,
  bpm: 138,
  timeSignature: [4, 4],
  description:
    'De "Peer Gynt", en la versión para piano del propio Grieg (Mutopia Project, dominio público). Un motivo sigiloso en Si menor que se repite cada vez más fuerte y más rápido hasta estallar: practica el crescendo y el accelerando.',
  events: mountainEvents as NoteEvent[],
  source: 'midi',
};

export const CLASSICAL_SONGS: Song[] = [
  twinkle,
  ode,
  brahms,
  minuet,
  nachtmusik,
  canon,
  spring,
  hall,
  gymnopedie,
  furElise,
  prelude,
  ...CLASSICAL_EXTRA,
];
