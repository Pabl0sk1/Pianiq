import type { NoteEvent, Song } from '../lib/notation';
import danubeEvents from './pd-midi/danube.json';
import fifthEvents from './pd-midi/fifth.json';
import entertainerEvents from './pd-midi/entertainer.json';
import allaTurcaEvents from './pd-midi/alla-turca.json';
import mapleEvents from './pd-midi/maple-leaf.json';
import starsEvents from './pd-midi/stars-stripes.json';
import weddingEvents from './pd-midi/wedding-march.json';
import toccataEvents from './pd-midi/toccata.json';
import carmenEvents from './pd-midi/carmen.json';

// Música de dominio público que los dibujos animados clásicos hicieron famosa.
// Arreglos propios para piano a dos manos. Duraciones en negras (q=1, e=0.5, s=0.25).

// ---------------------------------------------------------------------------
// Can-can (Galop infernal) — Offenbach
const ccA1 = 'C5:q D5:s F5 E5 D5 | G5:q G5:q | G5:s A5 E5 F5 D5:q | D5:q D5:s F5 E5 D5 | C5:s C6 B5 A5 G5 F5 E5 D5';
const ccA2 = 'C5:q D5:s F5 E5 D5 | G5:q G5:q | G5:s A5 E5 F5 D5:q | D5:q D5:s F5 E5 D5 | C5:s G5 D5 E5 C5:q';
const ccC = 'C3:e E3+G3 G2 E3+G3';
const ccG = 'G2:e F3+B3 D3 F3+B3';
const ccL = [ccC, ccG, ccG, ccG, ccC, ccC, ccG, ccG, ccG, ccC].join(' | ');
const cancan: Song = {
  id: 'cartoon-cancan',
  title: 'Can-can (tema principal)',
  composer: 'Jacques Offenbach',
  period: 'Orfeo en los infiernos · 1858',
  difficulty: 2,
  bpm: 132,
  timeSignature: [2, 4],
  description:
    'El galope más reconocible de los cortos de Looney Tunes y Tom y Jerry: suena cada vez que alguien baila, corre o persigue. Toca las semicorcheas ligeras y los "golpes" de Sol bien marcados.',
  tracks: [
    { hand: 'R', notes: `${ccA1} | ${ccA2} | ${ccA1} | ${ccA2} | C5+E5+G5+C6:q r:q` },
    { hand: 'L', notes: `${ccL} | ${ccL} | C2+C3:q r:q` },
  ],
};

// ---------------------------------------------------------------------------
// La cabalgata de las valquirias — Wagner
const valk = [
  'B4:e. F#4:s B4:e D5:q. B4:q.',
  'D5:e. B4:s D5:e F#5:q. D5:q.',
  'F#5:e. D5:s F#5:e A5:q. A4:q.',
  'D5:e. A4:s D5:e F#5:q. D5:q.',
  'F#5:e. D5:s F#5:e A5:q. F#5:q.',
  'F#5:e. C#5:s F#5:e A#5:q. F#5:q.',
].join(' | ');
const vBm = 'B2+F#3:q. B2+F#3:q. B2+F#3:q.';
const vD = 'D3+A3:q. D3+A3:q. D3+A3:q.';
const vF = 'F#2+C#3+A#3:q. F#2+C#3:q. F#2+C#3+A#3:q.';
const valkL = [vBm, vBm, vD, vD, vD, vF].join(' | ');
const valkyries: Song = {
  id: 'cartoon-valkyries',
  title: 'La cabalgata de las valquirias (tema principal)',
  composer: 'Richard Wagner',
  period: 'La valquiria · 1856',
  difficulty: 3,
  bpm: 100,
  timeSignature: [9, 8],
  description:
    'La música de "What\'s Opera, Doc?" (1957), donde Elmer persigue a Bugs Bunny cantando "¡Mata al conejo!". El ritmo galopante (corchea con puntillo, semicorchea) es la clave: marca bien la nota larga.',
  tracks: [
    { hand: 'R', notes: `${valk} | ${valk} | B5:q. F#5:q. B4:q. | B4+D5+F#5+B5:q. r:h.` },
    { hand: 'L', notes: `${valkL} | ${valkL} | B1+B2:q. F#2:q. B1+B2:q. | B1+F#2+B2:q. r:h.` },
  ],
};

// ---------------------------------------------------------------------------
// El Danubio azul — Johann Strauss II
// Arreglo para piano de N. Kouremenos (Mutopia Project, CC BY-SA 4.0).
const danube: Song = {
  id: 'cartoon-danube',
  title: 'El Danubio azul',
  composer: 'Johann Strauss II',
  period: 'Vals · 1866 · arreglo de N. Kouremenos',
  difficulty: 2,
  bpm: 150,
  timeSignature: [3, 4],
  description:
    'El vals por excelencia, recurso habitual en los cortos clásicos de animación para escenas de baile, patinaje o elegancia exagerada. Arreglo para piano del tema principal (Mutopia Project, CC BY-SA 4.0).',
  events: danubeEvents as NoteEvent[],
  source: 'midi',
};

// ---------------------------------------------------------------------------
// Quinta sinfonía, 1.er movimiento completo — Beethoven
// Partitura orquestal de Mutopia Project (dominio público), reducida a piano.
const fifthSym: Song = {
  id: 'cartoon-fifth',
  title: 'Quinta sinfonía · I. Allegro con brio',
  composer: 'Ludwig van Beethoven',
  period: 'Sinfonía n.º 5 · 1808 · reducción para piano',
  difficulty: 5,
  bpm: 192,
  timeSignature: [2, 4],
  description:
    '"Ta-ta-ta-TAAA": el golpe dramático de los dibujos animados cuando algo sale terriblemente mal. Aquí el primer movimiento completo, reducido a piano desde la partitura orquestal (Mutopia Project, dominio público). Desactiva el pedal automático si quieres oír los silencios dramáticos más secos.',
  events: fifthEvents as NoteEvent[],
  source: 'midi',
};

// ---------------------------------------------------------------------------
// The Entertainer — Scott Joplin (versión completa)
// Edición original de 1902 (Mutopia Project, dominio público).
const entertainer: Song = {
  id: 'cartoon-entertainer',
  title: 'The Entertainer',
  composer: 'Scott Joplin',
  period: 'Ragtime · 1902 · edición original completa',
  difficulty: 4,
  bpm: 72,
  timeSignature: [2, 4],
  description:
    'El ragtime más famoso, inseparable del cine mudo y de los cortos de animación de época. Versión completa de la edición original (Mutopia Project, dominio público). La mano izquierda salta entre bajo y acorde; Joplin pedía tocarlo "no rápido".',
  events: entertainerEvents as NoteEvent[],
  source: 'midi',
};

// ---------------------------------------------------------------------------
// La mañana (Peer Gynt) — Grieg
const mm1 = 'G#5:q E5:e D#5 C#5 D#5';
const mm = `${mm1} | ${mm1} | D#5:e E5 D#5 E5 G#5 E5 | G#5:e A5 G#5 E5 D#5 C#5 | B4:h.`;
const mmL = 'E3+B3:h. | E3+B3:h. | E3+G#3+B3:h. | A2+E3+C#4:h. | B2+F#3+D#4:h.';
const morning: Song = {
  id: 'cartoon-morning',
  title: 'La mañana (tema principal)',
  composer: 'Edvard Grieg',
  period: 'Peer Gynt · 1875',
  difficulty: 1,
  bpm: 84,
  timeSignature: [6, 8],
  description:
    'La música del amanecer en los dibujos animados: sale el sol, cantan los pájaros… y algo está a punto de salir mal. Melodía de flauta muy cantada, sobre un pedal tranquilo.',
  tracks: [
    { hand: 'R', notes: `${mm} | ${mm.replace('B4:h.', 'E5:h.')}` },
    { hand: 'L', notes: `${mmL} | ${mmL.replace(/B2\+F#3\+D#4:h\.$/, 'E2+B2+E3:h.')}` },
  ],
};

// ---------------------------------------------------------------------------
// Pop Goes the Weasel — tradicional inglesa
const popR = `C4:q C4:e D4:q D4:e | E4:e G4 E4 C4:q. | C4:q C4:e D4:q D4:e | E4:q. C4:q. |
  C4:q C4:e D4:q D4:e | E4:e G4 E4 C4:q. | A4:q. D4:q F4:e | E4:q. C4:q.`;
const popL = `C3+G3:q. C3+G3:q. | C3+G3:q. C3+E3:q. | G2+D3:q. G2+B2:q. | C3+G3:q. C3+E3:q. |
  C3+G3:q. C3+G3:q. | C3+G3:q. C3+E3:q. | F2+C3:q. G2+D3:q. | C3+G3:q. C2+C3:q.`;
const weasel: Song = {
  id: 'cartoon-weasel',
  title: 'Pop Goes the Weasel',
  composer: 'Tradicional inglesa',
  period: 'Siglo XIX',
  difficulty: 1,
  bpm: 112,
  timeSignature: [6, 8],
  description:
    'La melodía de las cajas sorpresa: la manivela gira, la música suena… y en el "¡POP!" (el La largo) salta el muñeco. Clásico en las escenas de juguetes de los dibujos animados.',
  tracks: [
    { hand: 'R', notes: `${popR} | ${popR}` },
    { hand: 'L', notes: `${popL} | ${popL}` },
  ],
};

// ---------------------------------------------------------------------------
// Obras completas del Mutopia Project (convertidas desde MIDI en src/data/pd-midi)

const mutopia = (s: Omit<Song, 'events' | 'source'>, events: unknown): Song => ({ ...s, events: events as NoteEvent[], source: 'midi' });

const allaTurca = mutopia(
  {
    id: 'cartoon-alla-turca',
    title: 'Marcha turca (Rondo alla turca)',
    composer: 'Wolfgang Amadeus Mozart',
    period: 'Sonata K. 331 · 1783 · obra completa',
    difficulty: 4,
    bpm: 60,
    timeSignature: [2, 4],
    description:
      'Las semicorcheas traviesas que acompañan carreras, persecuciones y travesuras en los dibujos animados. Tercer movimiento completo de la Sonata K. 331 (Mutopia Project, dominio público).',
  },
  allaTurcaEvents,
);

const mapleLeaf = mutopia(
  {
    id: 'cartoon-maple-leaf',
    title: 'Maple Leaf Rag',
    composer: 'Scott Joplin',
    period: 'Ragtime · 1899 · obra completa',
    difficulty: 5,
    bpm: 120,
    timeSignature: [2, 4],
    description:
      'El ragtime que puso de moda a Joplin y el sonido del piano de saloon en los cortos del Oeste. Obra completa (Mutopia Project, dominio público). Mano izquierda "stride" de saltos amplios.',
  },
  mapleEvents,
);

const starsStripes = mutopia(
  {
    id: 'cartoon-stars-stripes',
    title: 'The Stars and Stripes Forever',
    composer: 'John Philip Sousa',
    period: 'Marcha · 1896 · versión para piano completa',
    difficulty: 4,
    bpm: 240,
    timeSignature: [2, 2],
    description:
      'La marcha de los desfiles, los finales triunfales y los personajes que se ponen firmes con la bandera de fondo. Versión para piano completa (Mutopia Project, dominio público), con el famoso trío del flautín.',
  },
  starsEvents,
);

const weddingMarch = mutopia(
  {
    id: 'cartoon-wedding-march',
    title: 'Marcha nupcial',
    composer: 'Felix Mendelssohn',
    period: 'El sueño de una noche de verano · 1842 · arreglo para órgano de Th. Dubois',
    difficulty: 4,
    bpm: 130,
    timeSignature: [4, 4],
    description:
      'Suena en todas las bodas de los dibujos animados (a menudo justo antes de que el novio huya). Arreglo para órgano de Théodore Dubois (Mutopia Project, CC BY-SA 4.0); el pedalero va en la mano izquierda. Pruébala con el Órgano de Tubos.',
  },
  weddingEvents,
);

const toccata = mutopia(
  {
    id: 'cartoon-toccata',
    title: 'Tocata y fuga en re menor',
    composer: 'Johann Sebastian Bach',
    period: 'BWV 565 · obra completa para órgano',
    difficulty: 5,
    bpm: 60,
    timeSignature: [4, 4],
    description:
      'Abre la película "Fantasía" de Disney (1940) y es la música del villano tocando el órgano en su castillo encantado. Obra completa para órgano (Mutopia Project, dominio público); el pedalero va en la mano izquierda. Escúchala con el Órgano de Tubos y la reverb al máximo.',
  },
  toccataEvents,
);

const carmen = mutopia(
  {
    id: 'cartoon-carmen',
    title: 'Carmen: preludio',
    composer: 'Georges Bizet',
    period: 'Carmen · 1875 · versión para piano',
    difficulty: 4,
    bpm: 116,
    timeSignature: [2, 4],
    description:
      'La música de las corridas de toros de los dibujos animados, con Bugs Bunny haciendo de torero: la fiesta inicial y, en medio, la marcha del torero. Versión para piano (Mutopia Project, CC BY-SA 2.5).',
  },
  carmenEvents,
);

// ---------------------------------------------------------------------------
// Marcha fúnebre — Chopin (Sonata n.º 2, Op. 35), tema principal. Arreglo propio.
const fmM1 = 'Bb3+Bb4:q Bb3+Bb4:e. Bb3+Bb4:s Bb3+Bb4:h';
const fmM2 = 'Db4+Db5:e. C4+C5:s C4+C5:e. Bb3+Bb4:s Bb3+Bb4:e. A3+A4:s Bb3+Bb4:q';
const fmL = 'Bb1+F2:q Gb1+Db2:q Bb1+F2:q Gb1+Db2:q';
const funeral: Song = {
  id: 'cartoon-funeral',
  title: 'Marcha fúnebre (tema principal)',
  composer: 'Frédéric Chopin',
  period: 'Sonata n.º 2, Op. 35 · 1839',
  difficulty: 1,
  bpm: 50,
  timeSignature: [4, 4],
  description:
    'El "tan, tan, ta-tan" del personaje que se da por muerto en los dibujos animados (y que siempre resucita). Tema principal en Si bemol menor sobre el balanceo grave de la mano izquierda. Arreglo propio.',
  tracks: [
    { hand: 'R', notes: `${fmM1} | ${fmM2} | ${fmM1} | ${fmM2} | ${fmM1} | ${fmM2} | ${fmM1} | ${fmM2} | Bb3+Db4+F4+Bb4:w`, velocity: 0.7 },
    { hand: 'L', notes: `${[fmL, fmL, fmL, fmL, fmL, fmL, fmL, fmL].join(' | ')} | Bb1+F2+Bb2:w`, velocity: 0.55 },
  ],
};

export const CARTOON_SONGS: Song[] = [
  weasel,
  funeral,
  morning,
  cancan,
  danube,
  weddingMarch,
  carmen,
  valkyries,
  allaTurca,
  starsStripes,
  entertainer,
  mapleLeaf,
  fifthSym,
  toccata,
];

/** Obras de la sección clásica que también son famosas por los dibujos animados. */
export const CARTOON_ALSO = ['mountain-king'];

