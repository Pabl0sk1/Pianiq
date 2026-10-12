import type { NoteEvent, Song } from '../lib/notation';
import nocturne92 from './pd-midi/classical/nocturne-9-2.json';
import nocturne93 from './pd-midi/classical/nocturne-9-3.json';
import minuteWaltz from './pd-midi/classical/minute-waltz.json';
import raindrop from './pd-midi/classical/raindrop.json';
import preludeEm from './pd-midi/classical/prelude-e-minor.json';
import fantaisie from './pd-midi/classical/fantaisie-impromptu.json';
import clairDeLune from './pd-midi/classical/clair-de-lune.json';
import arabesque from './pd-midi/classical/arabesque-1.json';
import moonlight1 from './pd-midi/classical/moonlight-1.json';
import moonlight2 from './pd-midi/classical/moonlight-2.json';
import moonlight3 from './pd-midi/classical/moonlight-3.json';
import pathetique from './pd-midi/classical/pathetique-1.json';
import k545 from './pd-midi/classical/k545-1.json';
import invention1 from './pd-midi/classical/invention-1.json';
import invention8 from './pd-midi/classical/invention-8.json';
import gnossienne from './pd-midi/classical/gnossienne-1.json';
import solace from './pd-midi/classical/solace.json';
import easyWinners from './pd-midi/classical/easy-winners.json';
import eliteSync from './pd-midi/classical/elite-syncopations.json';

// Obras completas del Mutopia Project (www.mutopiaproject.org), convertidas desde sus MIDI.
// La licencia de cada una figura en la descripción. El "bpm" corrige los MIDI cuyo tempo
// de referencia no corresponde al de una interpretación habitual.

type Info = Omit<Song, 'events' | 'source'>;
const piece = (info: Info, events: unknown): Song => ({ ...info, events: events as NoteEvent[], source: 'midi' });

export const CLASSICAL_EXTRA: Song[] = [
  // Chopin
  piece(
    { id: 'chopin-nocturne-9-2', title: 'Nocturno en mi bemol mayor, Op. 9 n.º 2', composer: 'Frédéric Chopin', period: 'Romántico · 1832', difficulty: 4, bpm: 53, timeSignature: [12, 8],
      description: 'El nocturno más famoso de Chopin: una melodía de bel canto que se adorna cada vez que vuelve, sobre un vaivén de la mano izquierda. Mutopia Project, CC BY-SA 3.0.' },
    nocturne92,
  ),
  piece(
    { id: 'chopin-nocturne-9-3', title: 'Nocturno en si mayor, Op. 9 n.º 3', composer: 'Frédéric Chopin', period: 'Romántico · 1832', difficulty: 5, bpm: 99, timeSignature: [6, 8],
      description: 'Juguetón al principio y tormentoso en la sección central. Mutopia Project, CC BY-SA 4.0.' },
    nocturne93,
  ),
  piece(
    { id: 'chopin-minute-waltz', title: 'Vals del minuto, Op. 64 n.º 1', composer: 'Frédéric Chopin', period: 'Romántico · 1847', difficulty: 5, bpm: 280, timeSignature: [3, 4],
      description: 'Inspirado, según la leyenda, en un perrito persiguiendo su cola. "Del minuto" significa "pequeño", no que dure un minuto. Mutopia Project, dominio público.' },
    minuteWaltz,
  ),
  piece(
    { id: 'chopin-raindrop', title: 'Preludio "Gota de agua", Op. 28 n.º 15', composer: 'Frédéric Chopin', period: 'Romántico · 1839', difficulty: 4, bpm: 80, timeSignature: [4, 4],
      description: 'Un La bemol repetido sin parar, como gotas de lluvia en el tejado de Valldemossa, bajo una melodía serena que se oscurece en el centro. Mutopia Project, dominio público.' },
    raindrop,
  ),
  piece(
    { id: 'chopin-prelude-e-minor', title: 'Preludio en mi menor, Op. 28 n.º 4', composer: 'Frédéric Chopin', period: 'Romántico · 1839', difficulty: 3, bpm: 56, timeSignature: [2, 2],
      description: 'Una melodía casi inmóvil sobre acordes que bajan por semitonos. Se tocó en el funeral de Chopin. Mutopia Project, dominio público.' },
    preludeEm,
  ),
  piece(
    { id: 'chopin-fantaisie', title: 'Fantasía-Impromptu, Op. 66', composer: 'Frédéric Chopin', period: 'Romántico · 1834', difficulty: 5, bpm: 168, timeSignature: [4, 4],
      description: 'Cuatro notas contra tres a toda velocidad y, en el centro, una de las melodías más cantables de Chopin. Mutopia Project, dominio público.' },
    fantaisie,
  ),
  // Debussy
  piece(
    { id: 'debussy-clair-de-lune', title: 'Claro de luna (Suite bergamasque)', composer: 'Claude Debussy', period: 'Impresionismo · 1905', difficulty: 4, bpm: 60, timeSignature: [9, 8],
      description: 'Luz de luna sobre el agua: acordes suspendidos, arpegios ondulantes y mucho pedal. Mutopia Project, dominio público.' },
    clairDeLune,
  ),
  piece(
    { id: 'debussy-arabesque-1', title: 'Arabesca n.º 1', composer: 'Claude Debussy', period: 'Impresionismo · 1891', difficulty: 4, bpm: 144, timeSignature: [4, 4],
      description: 'Tresillos que fluyen como agua entre las dos manos. Mutopia Project, dominio público.' },
    arabesque,
  ),
  // Beethoven
  piece(
    { id: 'moonlight', title: 'Sonata "Claro de Luna" · I. Adagio sostenuto', composer: 'Ludwig van Beethoven', period: 'Op. 27 n.º 2 · 1801', difficulty: 3, bpm: 53, timeSignature: [2, 2],
      description: 'El primer movimiento completo: tresillos continuos, octavas graves y una melodía que apenas se mueve. Muy legato y pianissimo. Mutopia Project, CC BY-SA 2.5.' },
    moonlight1,
  ),
  piece(
    { id: 'moonlight-2', title: 'Sonata "Claro de Luna" · II. Allegretto', composer: 'Ludwig van Beethoven', period: 'Op. 27 n.º 2 · 1801', difficulty: 3, bpm: 80, timeSignature: [3, 4],
      description: '"Una flor entre dos abismos", según Liszt: un minueto ligero entre los dos movimientos sombríos. Mutopia Project, CC BY-SA 2.5.' },
    moonlight2,
  ),
  piece(
    { id: 'moonlight-3', title: 'Sonata "Claro de Luna" · III. Presto agitato', composer: 'Ludwig van Beethoven', period: 'Op. 27 n.º 2 · 1801', difficulty: 5, bpm: 117, timeSignature: [4, 4],
      description: 'La tormenta después de la calma: arpegios furiosos que suben y acordes que estallan. Mutopia Project, CC BY-SA 2.5.' },
    moonlight3,
  ),
  piece(
    { id: 'beethoven-pathetique-1', title: 'Sonata "Patética" · I. Grave – Allegro', composer: 'Ludwig van Beethoven', period: 'Op. 13 · 1798', difficulty: 5, bpm: 33, timeSignature: [4, 4],
      description: 'Una introducción solemne y dramática que desemboca en un Allegro impetuoso. Mutopia Project, dominio público.' },
    pathetique,
  ),
  // Mozart
  piece(
    { id: 'mozart-k545-1', title: 'Sonata facile K. 545 · I. Allegro', composer: 'Wolfgang Amadeus Mozart', period: 'Clásico · 1788', difficulty: 3, bpm: 132, timeSignature: [4, 4],
      description: 'La sonata "para principiantes" que todos los pianistas estudian: escalas, bajo Alberti y una claridad perfecta. Mutopia Project, CC BY-SA 3.0.' },
    k545,
  ),
  // Bach
  piece(
    { id: 'bach-invention-1', title: 'Invención n.º 1 en do mayor', composer: 'Johann Sebastian Bach', period: 'BWV 772 · 1723', difficulty: 3, bpm: 80, timeSignature: [4, 4],
      description: 'Un motivo de siete notas que las dos manos se pasan y transforman: la mejor escuela de independencia. Mutopia Project, CC BY-SA 3.0.' },
    invention1,
  ),
  piece(
    { id: 'bach-invention-8', title: 'Invención n.º 8 en fa mayor', composer: 'Johann Sebastian Bach', period: 'BWV 779 · 1723', difficulty: 3, bpm: 90, timeSignature: [3, 4],
      description: 'Un arpegio ascendente que la mano izquierda imita como en un canon. Alegre y brillante. Mutopia Project, dominio público.' },
    invention8,
  ),
  // Satie
  piece(
    { id: 'satie-gnossienne-1', title: 'Gnossienne n.º 1', composer: 'Erik Satie', period: 'Impresionismo · 1890', difficulty: 2, bpm: 100, timeSignature: [4, 4],
      description: 'Sin líneas divisorias en el original: una melodía misteriosa y oriental sobre un balanceo hipnótico. Mutopia Project, CC BY-SA 4.0.' },
    gnossienne,
  ),
  // Joplin
  piece(
    { id: 'joplin-solace', title: 'Solace', composer: 'Scott Joplin', period: 'Ragtime · 1909', difficulty: 4, bpm: 72, timeSignature: [2, 4],
      description: 'Una "serenata mexicana" en ritmo de habanera: el Joplin más tranquilo y nostálgico. Mutopia Project, dominio público.' },
    solace,
  ),
  piece(
    { id: 'joplin-easy-winners', title: 'The Easy Winners', composer: 'Scott Joplin', period: 'Ragtime · 1901', difficulty: 4, bpm: 79, timeSignature: [2, 4],
      description: 'Un rag alegre y deportivo, de los más populares de Joplin. Mutopia Project, dominio público.' },
    easyWinners,
  ),
  piece(
    { id: 'joplin-elite-syncopations', title: 'Elite Syncopations', composer: 'Scott Joplin', period: 'Ragtime · 1902', difficulty: 4, bpm: 83, timeSignature: [2, 4],
      description: 'Síncopas elegantes y saltos de stride en la mano izquierda. Mutopia Project, dominio público.' },
    eliteSync,
  ),
];
