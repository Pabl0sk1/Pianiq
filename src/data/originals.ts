import type { Song } from '../lib/notation';

// Composiciones originales para Pianiq (melodías y arreglos propios, libres de derechos).
// Evocan estilos —cumbia, rock de estadio, balada de los 80— sin copiar ninguna canción.

interface Chord {
  bass: string; // fundamental (grave)
  fifth: string; // quinta (grave)
  stab: string; // acorde de acompañamiento
}

// ---------------------------------------------------------------------------
// Cumbia: bajo en los tiempos 1 y 3, acorde a contratiempo en cada "y" (el "chuc" de la guacharaca)
const cumbiaBar = (c: Chord) => `${c.bass}:e ${c.stab}:e r:e ${c.stab}:e ${c.fifth}:e ${c.stab}:e r:e ${c.stab}:e`;
const cumbiaLH = (chords: Chord[]) => chords.map(cumbiaBar).join(' | ');

const Am: Chord = { bass: 'A2', fifth: 'E2', stab: 'A3+C4+E4' };
const Dm: Chord = { bass: 'D2', fifth: 'A2', stab: 'A3+D4+F4' };
const G: Chord = { bass: 'G2', fifth: 'D2', stab: 'G3+B3+D4' };
const C: Chord = { bass: 'C3', fifth: 'G2', stab: 'G3+C4+E4' };
const E7: Chord = { bass: 'E2', fifth: 'B2', stab: 'G#3+B3+D4' };
const F: Chord = { bass: 'F2', fifth: 'C3', stab: 'A3+C4+F4' };
const Em: Chord = { bass: 'E2', fifth: 'B2', stab: 'G3+B3+E4' };
const G7: Chord = { bass: 'G2', fifth: 'D3', stab: 'F3+B3+D4' };

// --- Cumbia de las teclas (La menor) ---
const ctIntro = 'E5:e D5 C5 B4 A4:q r:e E4:e | A4:e B4 C5 D5 E5:q r:q | G#4:e B4 D5 E5 G#5:q F5:e E5:e | D5:e C5 B4 G#4 E4:q r:q';
const ctA = `A4:e C5 E5:q E5:e D5 C5:q | B4:e C5 D5:e. C5:s B4:e A4:e r:q |
  D5:e F5 A5:q A5:e G5 F5:q | E5:e F5 G5:e. F5:s E5:e D5:e r:q |
  B4:e D5 G5:q G5:e F5 E5:q | D5:e E5 F5:e. E5:s D5:e B4:e r:q |
  C5:e E5 G5:q E5:e C5 G4:q | G#4:e B4 D5:e E5 G#4:q E4:q`;
const ctB = `A5:q. G5:e F5:e E5 F5:q | G5:q. F5:e E5:e D5 E5:q |
  E5:e G5 B5:q B5:e A5 G5:q | A5:e G5 E5 C5 A4:q r:q |
  F5:e E5 D5 F5 A5:q F5:q | E5:e D5 B4 D5 G#5:q E5:q |
  A5:e E5 C5 E5 A5:q. G#5:e | A5:e B5 G#5 E5 D5:q B4:q`;
const ctHarmA = [Am, Am, Dm, Dm, G, G, C, E7];
const ctHarmB = [F, G, Em, Am, Dm, E7, Am, E7];
const cumbiaTeclas: Song = {
  id: 'orig-cumbia-teclas',
  title: 'Cumbia de las teclas',
  composer: 'Pianiq (composición original)',
  period: 'Cumbia · composición original',
  difficulty: 2,
  bpm: 96,
  timeSignature: [4, 4],
  pedal: false,
  description:
    'Cumbia en La menor compuesta para Pianiq. La mano izquierda hace el bajo en los tiempos 1 y 3 y el acorde a contratiempo; la derecha canta como un acordeón. Prueba el Piano Eléctrico o el Sintetizador Pro con un poco de chorus.',
  tracks: [
    { hand: 'R', notes: `${ctIntro} | ${ctA} | ${ctB} | ${ctA} | A4+C5+E5+A5:q r:e E4+G#4+B4:e A4+C5+E5+A5:q r:q`, velocity: 0.8 },
    {
      hand: 'L',
      notes: `${cumbiaLH([Am, Am, E7, E7])} | ${cumbiaLH(ctHarmA)} | ${cumbiaLH(ctHarmB)} | ${cumbiaLH(ctHarmA)} | A2+E3:q r:e E2+B2:e A2+E3:q r:q`,
      velocity: 0.62,
    },
  ],
};

// --- Cumbia alegre (Do mayor) ---
const caIntro = 'G4:e B4 D5 F5 G5:q r:q | G5:e F5 D5 B4 G4:q r:q';
const caA = `E5:e G5 E5 C5 G4:q C5:q | E5:e D5 E5 G5 E5:q r:q |
  D5:e F5 D5 B4 G4:q B4:q | D5:e C5 D5 F5 D5:q r:q |
  B4:e D5 F5:q F5:e E5 D5:q | G5:e F5 E5 D5 B4:q G4:q |
  C5:e E5 G5:q G5:e A5 G5:q | E5:e D5 C5:q r:h`;
const caB = `A5:q. A5:e G5:e F5:e E5:q | F5:e E5 D5 C5 A4:q r:q |
  G5:q. G5:e F5:e E5:e D5:q | E5:e D5 C5 B4 C5:q r:q |
  B4:e D5 G5:q G5:e F5 D5:q | F5:e E5 D5 C5 B4:q G4:q |
  C5:e E5 G5 C6 G5:q E5:q | E5:e D5 C5:q r:h`;
const caHarmA = [C, C, G7, G7, G7, G7, C, C];
const caHarmB = [F, F, C, C, G7, G7, C, C];
const cumbiaAlegre: Song = {
  id: 'orig-cumbia-alegre',
  title: 'Cumbia alegre',
  composer: 'Pianiq (composición original)',
  period: 'Cumbia · composición original',
  difficulty: 2,
  bpm: 100,
  timeSignature: [4, 4],
  pedal: false,
  description:
    'Cumbia luminosa en Do mayor con solo tres acordes (Do, Fa y Sol7), ideal para practicar el patrón de acompañamiento. Composición original para Pianiq.',
  tracks: [
    { hand: 'R', notes: `${caIntro} | ${caA} | ${caB} | ${caA} | C5+E5+G5+C6:q r:e G4+B4+F5:e C5+E5+G5+C6:q r:q`, velocity: 0.8 },
    {
      hand: 'L',
      notes: `${cumbiaLH([G7, G7])} | ${cumbiaLH(caHarmA)} | ${cumbiaLH(caHarmB)} | ${cumbiaLH(caHarmA)} | C3+G3:q r:e G2+D3:e C3+G3:q r:q`,
      velocity: 0.62,
    },
  ],
};

// ---------------------------------------------------------------------------
// Rock de estadio: bajo en corcheas (octavas) y acordes de quinta en la derecha
const pump = (low: string, high: string) => Array.from({ length: 8 }, () => `${low}+${high}:e`).join(' ');
const riff = (pc: string) => `${pc}:q. ${pc}:e r:e ${pc}:e ${pc}:q`;
const PE = 'E4+B4+E5';
const PCs = 'C#4+G#4+C#5';
const PA = 'A3+E4+A4';
const PB = 'B3+F#4+B4';
const bE = pump('E2', 'E3');
const bCs = pump('C#2', 'C#3');
const bA = pump('A1', 'A2');
const bB = pump('B1', 'B2');
const hsVerseR = [PE, PE, PCs, PCs, PA, PA, PB, PB].map(riff).join(' | ');
const hsVerseL = [bE, bE, bCs, bCs, bA, bA, bB, bB].join(' | ');
const hsChorusR = `B4:q E5:q. E5:e F#5:q | D#5:h. B4:q | C#5:q E5:q G#5:q. F#5:e | E5:h. r:q |
  B4:q E5:q. F#5:e G#5:q | A5:q G#5:q F#5:h | E5:q F#5:q G#5:q A5:q | B5:w`;
const hsChorusL = [bE, bB, bCs, bA, bE, bB, bA, bB].join(' | ');
const stadium: Song = {
  id: 'orig-rock-estadio',
  title: 'Himno de estadio',
  composer: 'Pianiq (composición original)',
  period: 'Rock de los 80 · composición original',
  difficulty: 3,
  bpm: 132,
  timeSignature: [4, 4],
  pedal: false,
  description:
    'Rock de estadio al estilo de los 80, compuesto para Pianiq: bajo galopante en corcheas, acordes de quinta y un estribillo para cantar con el puño en alto. Suena genial con el Sintetizador Pro en "Supersaw" o con un poco de distorsión.',
  tracks: [
    {
      hand: 'R',
      notes: `${[PE, PE, PA, PB].map(riff).join(' | ')} | ${hsVerseR} | ${hsChorusR} | ${hsVerseR} | ${hsChorusR} | ${PE}+E6:w`,
      velocity: 0.85,
    },
    { hand: 'L', notes: `${[bE, bE, bA, bB].join(' | ')} | ${hsVerseL} | ${hsChorusL} | ${hsVerseL} | ${hsChorusL} | E1+E2:w`, velocity: 0.7 },
  ],
};

// ---------------------------------------------------------------------------
// Balada eléctrica (Re mayor): arpegios en la izquierda, melodía cantada en la derecha
const arp = (r: string, f: string, o: string, t: string) => `${r}:e ${f} ${o} ${t} ${o} ${f} ${o} ${f}`;
const aD = arp('D2', 'A2', 'D3', 'F#3');
const aA = arp('A1', 'E2', 'A2', 'C#3');
const aBm = arp('B1', 'F#2', 'B2', 'D3');
const aG = arp('G1', 'D2', 'G2', 'B2');
const blVerseR = `F#4:q A4:q A4:h | G4:q F#4:e E4:e E4:h | D4:q F#4:q B4:q. A4:e | A4:h. r:q |
  F#4:q A4:q D5:q. C#5:e | C#5:q B4:e A4:e A4:h | B4:q A4:q G4:q F#4:q | E4:w`;
const blVerseL = [aD, aA, aBm, aG, aD, aA, aG, aA].join(' | ');
const blChorusR = `A4:q D5:q F#5:h | E5:q. D5:e C#5:h | D5:q F#5:q B5:q. A5:e | G5:h. F#5:e E5:e |
  F#5:q A5:q A5:q. F#5:e | E5:q. F#5:e E5:h | D5:q E5:q F#5:q B5:q | A5:h G5:q E5:q`;
const blChorusL = [aD, aA, aBm, aG, aD, aA, aBm, aG].join(' | ');
const ballad: Song = {
  id: 'orig-balada-electrica',
  title: 'Balada eléctrica',
  composer: 'Pianiq (composición original)',
  period: 'Balada rock de los 80 · composición original',
  difficulty: 2,
  bpm: 76,
  timeSignature: [4, 4],
  description:
    'Una "power ballad" de las de encender el mechero: arpegios en la mano izquierda, una estrofa íntima y un estribillo que sube. Composición original para Pianiq.',
  tracks: [
    { hand: 'R', notes: `r:w r:w r:w r:w | ${blVerseR} | ${blChorusR} | ${blVerseR} | ${blChorusR} | D5+F#5+A5+D6:w`, velocity: 0.75 },
    { hand: 'L', notes: `${[aD, aA, aBm, aG].join(' | ')} | ${blVerseL} | ${blChorusL} | ${blVerseL} | ${blChorusL} | D2+A2+D3:w`, velocity: 0.55 },
  ],
};

export const CUMBIA_SONGS: Song[] = [cumbiaAlegre, cumbiaTeclas];
export const ROCK_SONGS: Song[] = [ballad, stadium];
