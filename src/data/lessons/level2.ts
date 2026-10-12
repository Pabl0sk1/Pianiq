import type { Level } from './types';

export const level2: Level = {
  id: 'n2',
  title: 'Nivel 2 · Elemental',
  subtitle: 'Intervalos, escalas mayores, acordes, acompañamiento, dinámicas, articulación y pedal.',
  color: '#5d8c69',
  modules: [
    // =====================================================================
    {
      id: 'm5',
      title: 'Intervalos',
      description: 'La distancia entre notas: la base de escalas, acordes y del oído musical.',
      lessons: [
        {
          id: 'n2-m5-l1',
          title: 'Tono y semitono',
          minutes: 8,
          goals: ['Medir distancias en semitonos y tonos', 'Saber dónde están los semitonos naturales'],
          blocks: [
            { t: 'p', text: 'Un **semitono (S)** es la distancia entre dos teclas contiguas. Un **tono (T)** son dos semitonos (hay una tecla en medio).' },
            { t: 'list', items: [
              'Do → Do# = 1 semitono',
              'Do → Re = 1 tono (2 semitonos)',
              'Mi → Fa = 1 semitono (¡no hay negra en medio!)',
              'Si → Do = 1 semitono',
            ] },
            { t: 'p', text: 'En las teclas blancas, los semitonos naturales están solo en **Mi–Fa** y **Si–Do**. Por eso la secuencia de blancas desde Do es: **T T S T T T S**. Esta fórmula es la escala mayor, que verás pronto.' },
            { t: 'listen', label: 'Semitono (Mi-Fa) y tono (Do-Re)', notes: 'E4:h F4 r:q C4:h D4', bpm: 80 },
          ],
          exercises: [
            { title: 'Semitonos ascendentes', text: 'Toca de semitono en semitono desde Sol hasta Do.', steps: 'G4 G#4 A4 A#4 B4 C5', clef: 'treble' },
            { title: 'Tonos enteros', text: 'De tono en tono desde Do: Do, Re, Mi, Fa#, Sol#, La#, Do.', steps: 'C4 D4 E4 F#4 G#4 A#4 C5', clef: 'treble' },
          ],
        },
        {
          id: 'n2-m5-l2',
          title: 'Los intervalos y su calidad',
          minutes: 14,
          goals: ['Nombrar intervalos de 2ª a 8ª', 'Distinguir mayores, menores y justos', 'Contar semitonos de cada intervalo'],
          blocks: [
            { t: 'p', text: 'Un **intervalo** es la distancia entre dos notas. Se nombra con un **número** (contando las notas incluidas: de Do a Mi = Do, Re, Mi = 3ª) y una **calidad** (según los semitonos).' },
            { t: 'table', head: ['Intervalo', 'Semitonos', 'Ejemplo desde Do', 'Carácter'], rows: [
              ['2ª menor', '1', 'Do–Reb', 'Disonante, tenso (Tiburón)'],
              ['2ª mayor', '2', 'Do–Re', 'Paso melódico'],
              ['3ª menor', '3', 'Do–Mib', 'Triste, suave'],
              ['3ª mayor', '4', 'Do–Mi', 'Alegre, luminoso'],
              ['4ª justa', '5', 'Do–Fa', 'Abierto, "Aquí viene la novia"'],
              ['Tritono', '6', 'Do–Fa#', 'Muy tenso, inestable'],
              ['5ª justa', '7', 'Do–Sol', 'Sólido, vacío (power chord)'],
              ['6ª menor', '8', 'Do–Lab', 'Melancólico'],
              ['6ª mayor', '9', 'Do–La', 'Cálido'],
              ['7ª menor', '10', 'Do–Sib', 'Tensión suave (blues)'],
              ['7ª mayor', '11', 'Do–Si', 'Muy tenso, pide subir'],
              ['8ª justa', '12', 'Do–Do', 'Mismo nombre, perfecto'],
            ] },
            { t: 'p', text: 'Los intervalos **justos** (unísono, 4ª, 5ª, 8ª) no tienen versión mayor/menor. Si a un intervalo justo o mayor le añades un semitono, se vuelve **aumentado**; si a uno justo o menor le quitas uno, **disminuido**.' },
            { t: 'listen', label: '3ª mayor vs 3ª menor', notes: 'C4:q E4 C4+E4:h r:q C4:q Eb4 C4+Eb4:h', bpm: 80 },
            { t: 'listen', label: '4ª, 5ª y 8ª justas', notes: 'C4+F4:h C4+G4:h C4+C5:h', bpm: 70 },
            { t: 'tip', text: 'Puedes practicar el reconocimiento de intervalos en la sección **Oído** de la plataforma.' },
          ],
          exercises: [
            { title: 'Intervalos desde Do', text: 'Toca juntos: 2ª, 3ª, 4ª, 5ª, 6ª, 7ª y 8ª.', steps: 'C4+D4 C4+E4 C4+F4 C4+G4 C4+A4 C4+B4 C4+C5', clef: 'treble' },
            { title: 'Terceras mayores y menores', text: 'Do-Mi (M), Re-Fa (m), Mi-Sol (m), Fa-La (M), Sol-Si (M).', steps: 'C4+E4 D4+F4 E4+G4 F4+A4 G4+B4', clef: 'treble' },
          ],
        },
        {
          id: 'n2-m5-l3',
          title: 'Oír los intervalos',
          minutes: 10,
          goals: ['Asociar cada intervalo con una canción conocida', 'Empezar a entrenar el oído'],
          blocks: [
            { t: 'p', text: 'Un truco clásico para reconocer intervalos es asociarlos al comienzo de canciones que ya conoces:' },
            { t: 'table', head: ['Intervalo', 'Ascendente', 'Descendente'], rows: [
              ['2ª menor', 'Tiburón (Jaws)', 'Para Elisa (Mi–Re#)'],
              ['2ª mayor', 'Cumpleaños feliz', 'Yesterday (Beatles)'],
              ['3ª menor', 'Greensleeves', 'Hey Jude'],
              ['3ª mayor', 'Oh when the saints', 'Llamada de "Summertime"'],
              ['4ª justa', 'Marcha nupcial / Himno de España', 'Eine kleine Nachtmusik'],
              ['Tritono', 'Los Simpson', 'Purple Haze'],
              ['5ª justa', 'Star Wars / Estrellita', 'Los Picapiedra'],
              ['6ª mayor', 'My Bonnie', 'Nobody knows the trouble'],
              ['8ª', 'Somewhere over the rainbow', '—'],
            ] },
            { t: 'listen', label: '5ª justa: Estrellita', notes: 'C4:q C4 G4 G4', bpm: 100 },
            { t: 'listen', label: '4ª justa: Marcha nupcial', notes: 'D4:q. G4:e G4:h', bpm: 80 },
            { t: 'listen', label: '2ª menor: Para Elisa', notes: 'E5:s D#5 E5 D#5 E5:h', bpm: 60 },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm6',
      title: 'Escalas mayores',
      description: 'La fórmula de la escala mayor, la técnica del paso del pulgar, las armaduras y el círculo de quintas.',
      lessons: [
        {
          id: 'n2-m6-l1',
          title: 'La escala de Do mayor y el paso del pulgar',
          minutes: 15,
          goals: ['Aplicar la fórmula T-T-S-T-T-T-S', 'Dominar el paso del pulgar', 'Tocar Do mayor con digitación correcta'],
          blocks: [
            { t: 'p', text: 'Una **escala** es una sucesión ordenada de notas. La **escala mayor** sigue siempre la fórmula **Tono-Tono-Semitono-Tono-Tono-Tono-Semitono**. Desde Do sale con solo teclas blancas.' },
            { t: 'keys', notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], labels: { C4: '1', D4: '2', E4: '3', F4: '1', G4: '2', A4: '3', B4: '4', C5: '5' }, low: 'C4', high: 'C5' },
            { t: 'h', text: 'El paso del pulgar' },
            { t: 'p', text: 'Como tenemos 5 dedos y la escala 8 notas, el **pulgar pasa por debajo** de la mano. Mano derecha subiendo: **1-2-3 · 1-2-3-4-5**. Después de tocar Mi con el 3, el pulgar se desliza bajo los dedos hasta el Fa.' },
            { t: 'list', items: [
              'Prepara el pulgar con antelación: empieza a moverlo mientras tocas el Re.',
              'La muñeca se mantiene horizontal y se desplaza lateralmente con suavidad. Sin codo "en ala".',
              'Bajando (5-4-3-2-1 · 3-2-1), el dedo 3 **cruza por encima** del pulgar.',
              'Mano izquierda subiendo: **5-4-3-2-1 · 3-2-1** (el 3 cruza sobre el pulgar).',
            ] },
            { t: 'listen', label: 'Do mayor, una octava arriba y abajo', notes: 'C4:e D4 E4 F4 G4 A4 B4 C5 B4 A4 G4 F4 E4 D4 C4:h', bpm: 90 },
          ],
          exercises: [
            { title: 'Do mayor — mano derecha', text: 'Sube y baja con digitación 1-2-3-1-2-3-4-5.', steps: 'C4 D4 E4 F4 G4 A4 B4 C5 B4 A4 G4 F4 E4 D4 C4', fingers: '1 2 3 1 2 3 4 5 4 3 2 1 3 2 1', clef: 'treble' },
            { title: 'Do mayor — mano izquierda', text: 'Digitación 5-4-3-2-1-3-2-1.', steps: 'C3 D3 E3 F3 G3 A3 B3 C4 B3 A3 G3 F3 E3 D3 C3', fingers: '5 4 3 2 1 3 2 1 2 3 1 2 3 4 5', clef: 'bass' },
            { title: 'Do mayor — dos octavas', text: 'Mano derecha, 2 octavas: 1-2-3-1-2-3-4-1-2-3-1-2-3-4-5.', steps: 'C4 D4 E4 F4 G4 A4 B4 C5 D5 E5 F5 G5 A5 B5 C6', clef: 'treble' },
          ],
        },
        {
          id: 'n2-m6-l2',
          title: 'Sol mayor y Re mayor (sostenidos)',
          minutes: 12,
          goals: ['Construir escalas con la fórmula', 'Entender por qué aparecen sostenidos'],
          blocks: [
            { t: 'p', text: 'Si aplicamos T-T-S-T-T-T-S desde **Sol**, el séptimo grado debe estar un semitono por debajo de Sol: necesitamos **Fa#**. Así nace la escala de **Sol mayor** (1 sostenido).' },
            { t: 'keys', notes: ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'], low: 'G4', high: 'G5' },
            { t: 'p', text: 'Desde **Re** necesitamos **Fa# y Do#**: Re mayor tiene 2 sostenidos. Fíjate: cada nueva escala está una **5ª justa** por encima y añade un sostenido (siempre el 7.º grado).' },
            { t: 'keys', notes: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'], low: 'D4', high: 'D5' },
            { t: 'tip', text: 'Digitación: Sol y Re mayor usan la misma digitación que Do (1-2-3-1-2-3-4-5 en mano derecha).' },
          ],
          exercises: [
            { title: 'Sol mayor', text: 'Una octava, mano derecha.', steps: 'G4 A4 B4 C5 D5 E5 F#5 G5 F#5 E5 D5 C5 B4 A4 G4', clef: 'treble' },
            { title: 'Re mayor', text: 'Una octava, mano derecha.', steps: 'D4 E4 F#4 G4 A4 B4 C#5 D5 C#5 B4 A4 G4 F#4 E4 D4', clef: 'treble' },
            { title: 'La mayor (3 sostenidos)', text: 'Fa#, Do#, Sol#.', steps: 'A4 B4 C#5 D5 E5 F#5 G#5 A5', clef: 'treble' },
          ],
        },
        {
          id: 'n2-m6-l3',
          title: 'Fa mayor y escalas con bemoles',
          minutes: 12,
          goals: ['Construir escalas con bemoles', 'Conocer la digitación especial de Fa mayor'],
          blocks: [
            { t: 'p', text: 'Desde **Fa**, el 4.º grado debe estar a un semitono del 3.º (La): no puede ser Si, debe ser **Sib**. Fa mayor tiene **1 bemol**.' },
            { t: 'keys', notes: ['F4', 'G4', 'A4', 'Bb4', 'C5', 'D5', 'E5', 'F5'], low: 'F4', high: 'F5' },
            { t: 'warn', text: 'Digitación de Fa mayor (mano derecha): **1-2-3-4-1-2-3-4**. El pulgar NO toca el Sib (tecla negra): pasa al Do.' },
            { t: 'p', text: 'Bajando por quintas aparecen más bemoles: **Sib mayor** (Sib, Mib), **Mib mayor** (Sib, Mib, Lab)…' },
          ],
          exercises: [
            { title: 'Fa mayor', text: 'Digitación 1-2-3-4-1-2-3-4.', steps: 'F4 G4 A4 Bb4 C5 D5 E5 F5 E5 D5 C5 Bb4 A4 G4 F4', fingers: '1 2 3 4 1 2 3 4 3 2 1 4 3 2 1', clef: 'treble' },
            { title: 'Sib mayor', text: 'Sib, Do, Re, Mib, Fa, Sol, La, Sib.', steps: 'Bb3 C4 D4 Eb4 F4 G4 A4 Bb4', clef: 'treble' },
          ],
        },
        {
          id: 'n2-m6-l4',
          title: 'Armaduras y círculo de quintas',
          minutes: 15,
          goals: ['Memorizar el orden de sostenidos y bemoles', 'Deducir la tonalidad por la armadura', 'Entender el círculo de quintas'],
          blocks: [
            { t: 'p', text: 'La **armadura** agrupa las alteraciones de una tonalidad al principio del pentagrama, en un **orden fijo**:' },
            { t: 'list', items: [
              '**Sostenidos**: Fa – Do – Sol – Re – La – Mi – Si',
              '**Bemoles**: Si – Mi – La – Re – Sol – Do – Fa (el orden inverso)',
            ] },
            { t: 'h', text: 'Cómo saber la tonalidad' },
            { t: 'list', items: [
              'Con **sostenidos**: la tónica está **un semitono por encima del último sostenido**. (Último Do# → Re mayor.)',
              'Con **bemoles**: la tónica es el **penúltimo bemol**. (Sib, Mib, Lab → Mib mayor.) Excepción: 1 bemol = Fa mayor.',
            ] },
            { t: 'table', head: ['Sostenidos', 'Tonalidad', '', 'Bemoles', 'Tonalidad'], rows: [
              ['0', 'Do mayor', '', '1', 'Fa mayor'],
              ['1', 'Sol mayor', '', '2', 'Sib mayor'],
              ['2', 'Re mayor', '', '3', 'Mib mayor'],
              ['3', 'La mayor', '', '4', 'Lab mayor'],
              ['4', 'Mi mayor', '', '5', 'Reb mayor'],
              ['5', 'Si mayor', '', '6', 'Solb mayor'],
              ['6', 'Fa# mayor', '', '7', 'Dob mayor'],
              ['7', 'Do# mayor', '', '', ''],
            ] },
            { t: 'p', text: 'El **círculo de quintas** ordena las 12 tonalidades: girando en sentido horario cada una está una 5ª justa arriba y añade un sostenido; en sentido antihorario, una 4ª arriba y añade un bemol. Las tonalidades vecinas comparten casi todas sus notas, por eso **modular** entre ellas suena natural.' },
            { t: 'tip', text: 'En el **Diccionario** de la plataforma puedes ver y escuchar cualquier escala mayor en las 12 tonalidades.' },
          ],
          exercises: [
            { title: 'Recorre el círculo', text: 'Toca las tónicas en orden de quintas: Do, Sol, Re, La, Mi, Si, Fa#.', steps: 'C4 G4 D4 A4 E4 B4 F#4', clef: 'treble' },
            { title: 'Mi mayor (4 sostenidos)', text: 'Fa#, Do#, Sol#, Re#.', steps: 'E4 F#4 G#4 A4 B4 C#5 D#5 E5', clef: 'treble' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm7',
      title: 'Acordes',
      description: 'Tríadas, inversiones y los acordes de una tonalidad.',
      lessons: [
        {
          id: 'n2-m7-l1',
          title: 'La tríada mayor',
          minutes: 12,
          goals: ['Saber qué es un acorde', 'Construir tríadas mayores sobre cualquier nota'],
          blocks: [
            { t: 'p', text: 'Un **acorde** son tres o más notas sonando juntas. El más básico es la **tríada**: **fundamental + 3ª + 5ª**, apilando terceras.' },
            { t: 'p', text: 'La **tríada mayor** = **3ª mayor (4 semitonos) + 3ª menor (3 semitonos)**. Ejemplo: Do–Mi–Sol. Su cifrado es solo la letra: **C**.' },
            { t: 'keys', notes: ['C4', 'E4', 'G4'], labels: { C4: '1', E4: '3', G4: '5' }, low: 'C4', high: 'B4' },
            { t: 'p', text: 'Digitación: mano derecha **1-3-5**; mano izquierda **5-3-1**. Mantén la forma de la mano; los dedos 2 y 4 flotan.' },
            { t: 'listen', label: 'C – F – G – C', notes: 'C4+E4+G4:h F4+A4+C5 G4+B4+D5 C4+E4+G4:w', bpm: 80 },
          ],
          exercises: [
            { title: 'Do, Fa y Sol mayor', text: 'Los tres acordes mayores de Do.', steps: 'C4+E4+G4 F4+A4+C5 G4+B4+D5 C4+E4+G4', clef: 'treble' },
            { title: 'Mayores con negras', text: 'Re mayor (Fa#), Mi mayor (Sol#), La mayor (Do#).', steps: 'D4+F#4+A4 E4+G#4+B4 A4+C#5+E5', clef: 'treble' },
          ],
        },
        {
          id: 'n2-m7-l2',
          title: 'La tríada menor',
          minutes: 10,
          goals: ['Construir tríadas menores', 'Oír la diferencia mayor/menor'],
          blocks: [
            { t: 'p', text: 'La **tríada menor** invierte el orden: **3ª menor (3 st) + 3ª mayor (4 st)**. Basta con **bajar la 3ª** de un acorde mayor un semitono. Cifrado: **Cm**, **Am**…' },
            { t: 'keys', notes: ['A3', 'C4', 'E4'], labels: { A3: '1', C4: 'b3', E4: '5' }, low: 'A3', high: 'G4' },
            { t: 'listen', label: 'Do mayor → Do menor', notes: 'C4+E4+G4:h C4+Eb4+G4:h', bpm: 70 },
          ],
          exercises: [
            { title: 'Los menores de Do mayor', text: 'Rem, Mim, Lam (solo teclas blancas).', steps: 'D4+F4+A4 E4+G4+B4 A4+C5+E5', clef: 'treble' },
            { title: 'Mayor → menor', text: 'Alterna mayor y menor sobre Do, Re y Sol.', steps: 'C4+E4+G4 C4+Eb4+G4 D4+F#4+A4 D4+F4+A4 G4+B4+D5 G4+Bb4+D5', clef: 'treble' },
          ],
        },
        {
          id: 'n2-m7-l3',
          title: 'Tríadas disminuida y aumentada',
          minutes: 8,
          goals: ['Construir tríadas disminuidas y aumentadas', 'Reconocer su sonido'],
          blocks: [
            { t: 'list', items: [
              '**Disminuida** (°): dos 3ªs menores (3+3). Ej.: Si–Re–Fa = **B°** o **Bdim**. Sonido tenso, inestable.',
              '**Aumentada** (+): dos 3ªs mayores (4+4). Ej.: Do–Mi–Sol# = **C+** o **Caug**. Sonido misterioso, de suspense.',
            ] },
            { t: 'table', head: ['Tipo', '3ª', '5ª', 'Ejemplo'], rows: [
              ['Mayor', 'mayor (4)', 'justa (7)', 'C: Do–Mi–Sol'],
              ['Menor', 'menor (3)', 'justa (7)', 'Cm: Do–Mib–Sol'],
              ['Disminuida', 'menor (3)', 'disminuida (6)', 'C°: Do–Mib–Solb'],
              ['Aumentada', 'mayor (4)', 'aumentada (8)', 'C+: Do–Mi–Sol#'],
            ] },
            { t: 'listen', label: 'Mayor, menor, disminuida, aumentada', notes: 'C4+E4+G4:h C4+Eb4+G4 C4+Eb4+Gb4 C4+E4+G#4', bpm: 70 },
          ],
          exercises: [
            { title: 'Las cuatro calidades', text: 'Sobre Do: mayor, menor, disminuida y aumentada.', steps: 'C4+E4+G4 C4+Eb4+G4 C4+Eb4+Gb4 C4+E4+G#4', clef: 'treble' },
          ],
        },
        {
          id: 'n2-m7-l4',
          title: 'Inversiones',
          minutes: 12,
          goals: ['Tocar un acorde en estado fundamental, 1ª y 2ª inversión', 'Enlazar acordes con poco movimiento'],
          blocks: [
            { t: 'p', text: 'Un acorde no tiene por qué tener la fundamental abajo. Según qué nota esté en el **bajo**:' },
            { t: 'list', items: [
              '**Estado fundamental**: Do–Mi–Sol (fundamental abajo).',
              '**1ª inversión**: Mi–Sol–Do (3ª abajo). Cifrado: C/E.',
              '**2ª inversión**: Sol–Do–Mi (5ª abajo). Cifrado: C/G.',
            ] },
            { t: 'staff', items: ['C4+E4+G4', 'E4+G4+C5', 'G4+C5+E5'], clef: 'treble' },
            { t: 'p', text: 'Las inversiones permiten **enlazar acordes moviendo la mano lo mínimo** (conducción de voces). Ejemplo: C → F/C → G/B → C: casi no se mueve la mano y suena mucho más fluido.' },
            { t: 'listen', label: 'Enlace suave: C – F/C – G/B – C', notes: 'C4+E4+G4:h C4+F4+A4 B3+D4+G4 C4+E4+G4:w', bpm: 70 },
          ],
          exercises: [
            { title: 'Inversiones de Do', text: 'Sube por las inversiones y vuelve.', steps: 'C4+E4+G4 E4+G4+C5 G4+C5+E5 E4+G4+C5 C4+E4+G4', clef: 'treble' },
            { title: 'Enlace I–IV–V–I', text: 'Con inversiones: C, F/C, G/B, C.', steps: 'C4+E4+G4 C4+F4+A4 B3+D4+G4 C4+E4+G4', clef: 'treble' },
          ],
        },
        {
          id: 'n2-m7-l5',
          title: 'Los acordes de la tonalidad (grados)',
          minutes: 14,
          goals: ['Formar las 7 tríadas de una escala mayor', 'Usar números romanos'],
          blocks: [
            { t: 'p', text: 'Si construimos una tríada sobre cada nota de la escala usando solo notas de esa escala, obtenemos los **acordes diatónicos**. Se numeran con **números romanos** (mayúscula = mayor, minúscula = menor, ° = disminuido):' },
            { t: 'table', head: ['Grado', 'I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'], rows: [
              ['Calidad', 'Mayor', 'menor', 'menor', 'Mayor', 'Mayor', 'menor', 'dism.'],
              ['En Do', 'C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'],
              ['En Sol', 'G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#°'],
            ] },
            { t: 'p', text: 'Esta fórmula (**M m m M M m °**) vale para **cualquier tonalidad mayor**. Saberla te permite tocar cualquier canción en cualquier tono.' },
            { t: 'listen', label: 'Los 7 acordes de Do mayor', notes: 'C4+E4+G4:q D4+F4+A4 E4+G4+B4 F4+A4+C5 G4+B4+D5 A4+C5+E5 B4+D5+F5 C5+E5+G5:h', bpm: 80 },
          ],
          exercises: [
            { title: 'Tríadas diatónicas de Do', text: 'Sube por los siete grados.', steps: 'C4+E4+G4 D4+F4+A4 E4+G4+B4 F4+A4+C5 G4+B4+D5 A4+C5+E5 B4+D5+F5 C5+E5+G5', clef: 'treble' },
            { title: 'Tríadas diatónicas de Sol', text: 'G, Am, Bm, C, D, Em, F#°, G.', steps: 'G3+B3+D4 A3+C4+E4 B3+D4+F#4 C4+E4+G4 D4+F#4+A4 E4+G4+B4 F#4+A4+C5 G4+B4+D5', clef: 'treble' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm8',
      title: 'Acompañamiento con la mano izquierda',
      description: 'Patrones para acompañar melodías: bajo-acorde, bajo Alberti, arpegios y acordes en bloque.',
      lessons: [
        {
          id: 'n2-m8-l1',
          title: 'Acordes en bloque y bajo-acorde',
          minutes: 10,
          goals: ['Acompañar con acordes en bloque', 'Usar el patrón bajo-acorde ("um-pa")'],
          blocks: [
            { t: 'p', text: 'La forma más simple de acompañar: la mano izquierda toca el acorde **en bloque** en el primer tiempo de cada compás. Un paso más: **bajo + acorde**, tocando la fundamental grave y después el acorde ("um-pa" en 2/4, "um-pa-pa" en 3/4).' },
            { t: 'listen', label: 'Um-pa en 4/4: C y G', notes: 'C3:q E3+G3 G2 E3+G3 G2 B2+D3 D3 B2+D3 C3:h', bpm: 100 },
          ],
          exercises: [
            { title: 'Um-pa-pa (vals)', text: 'Do–(Mi Sol)–(Mi Sol), Sol–(Re Fa)–(Re Fa).', steps: 'C3 E3+G3 E3+G3 G2 D3+F3 D3+F3 C3 E3+G3 E3+G3', clef: 'bass' },
          ],
        },
        {
          id: 'n2-m8-l2',
          title: 'El bajo Alberti',
          minutes: 10,
          goals: ['Tocar el patrón grave-agudo-medio-agudo', 'Usarlo en la música clásica'],
          blocks: [
            { t: 'p', text: 'El **bajo Alberti** (por Domenico Alberti) arpegia el acorde en el orden **grave – agudo – medio – agudo**. Es el acompañamiento típico de Mozart y Haydn (Sonata en Do K. 545).' },
            { t: 'listen', label: 'Bajo Alberti en Do y Sol', notes: 'C3:e G3 E3 G3 C3 G3 E3 G3 B2 G3 D3 G3 B2 G3 D3 G3 C3:h', bpm: 100 },
            { t: 'tip', text: 'Mantén el pulgar ligero (toca la nota aguda repetida) y deja que la nota grave cante un poco más. La muñeca rota suavemente: no levantes los dedos.' },
          ],
          exercises: [
            { title: 'Alberti en Do', text: 'Digitación 5-1-3-1.', steps: 'C3 G3 E3 G3 C3 G3 E3 G3', fingers: '5 1 3 1 5 1 3 1', clef: 'bass' },
            { title: 'Alberti: C – G7 – C', text: 'Do-Sol-Mi-Sol, Si-Sol-Re-Sol (G con Fa), Do.', steps: 'C3 G3 E3 G3 B2 G3 F3 G3 C3 G3 E3 G3', clef: 'bass' },
          ],
        },
        {
          id: 'n2-m8-l3',
          title: 'Arpegios de acompañamiento',
          minutes: 10,
          goals: ['Acompañar con arpegios abiertos', 'Usar el pedal para unir el arpegio'],
          blocks: [
            { t: 'p', text: 'Un **arpegio** toca las notas del acorde una tras otra. Los arpegios **abiertos** (fundamental–5ª–10ª) suenan amplios y románticos; son la base de muchas baladas y piezas de cine.' },
            { t: 'listen', label: 'Arpegio abierto: Do–Sol–Mi (1-5-10)', notes: 'C3:e G3 E4 G3 C3 G3 E4 G3 A2 E3 C4 E3 F2 C3 A3 C3', bpm: 90 },
            { t: 'tip', text: 'Combina los arpegios con el **pedal de resonancia**: písalo al tocar la fundamental de cada acorde y cámbialo al cambiar de acorde (lección de pedal más adelante).' },
          ],
          exercises: [
            { title: 'Arpegio abierto C – Am – F – G', text: '1-5-10 en cada acorde.', steps: 'C3 G3 E4 A2 E3 C4 F2 C3 A3 G2 D3 B3', clef: 'bass' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm9',
      title: 'Expresión: dinámica, articulación y pedal',
      description: 'Lo que convierte notas correctas en música: volumen, forma de atacar y resonancia.',
      lessons: [
        {
          id: 'n2-m9-l1',
          title: 'Dinámicas',
          minutes: 10,
          goals: ['Conocer los signos de dinámica', 'Controlar el volumen con la velocidad de la tecla'],
          blocks: [
            { t: 'p', text: 'Las **dinámicas** indican el volumen. Vienen del italiano:' },
            { t: 'table', head: ['Signo', 'Nombre', 'Significado'], rows: [
              ['pp', 'pianissimo', 'Muy suave'],
              ['p', 'piano', 'Suave'],
              ['mp', 'mezzo piano', 'Medio suave'],
              ['mf', 'mezzo forte', 'Medio fuerte'],
              ['f', 'forte', 'Fuerte'],
              ['ff', 'fortissimo', 'Muy fuerte'],
              ['cresc. / <', 'crescendo', 'Aumentando poco a poco'],
              ['dim. / >', 'diminuendo', 'Disminuyendo poco a poco'],
              ['sfz', 'sforzando', 'Acento súbito y fuerte'],
            ] },
            { t: 'p', text: 'En el piano el volumen depende de la **velocidad** con que baja la tecla, no de la presión. En esta plataforma: con el ratón, **pulsa más abajo en la tecla para sonar más fuerte**; con el teclado del ordenador, mantén **Mayús** para tocar forte; con un teclado MIDI, la sensibilidad es real.' },
            { t: 'tip', text: 'Puedes desactivar la sensibilidad a la velocidad en el panel de sonido (Velocidad fija) para practicar sin variaciones.' },
          ],
        },
        {
          id: 'n2-m9-l2',
          title: 'Articulación',
          minutes: 10,
          goals: ['Diferenciar legato, staccato, acento y tenuto', 'Leer ligaduras de expresión'],
          blocks: [
            { t: 'list', items: [
              '**Legato** (ligadura curva sobre notas distintas): unido, sin cortes. Suelta cada tecla justo cuando suena la siguiente.',
              '**Staccato** (punto sobre/bajo la nota): corto y separado, aproximadamente la mitad del valor. Rebota desde la muñeca.',
              '**Staccatissimo** (cuña ▾): aún más corto.',
              '**Acento** (>): esa nota más fuerte que las de alrededor.',
              '**Tenuto** (línea –): mantén la nota todo su valor, con un ligero peso.',
              '**Fermata** (𝄐): detente en esa nota el tiempo que quieras.',
            ] },
            { t: 'listen', label: 'Legato vs staccato', notes: 'C4:q D4 E4 F4 G4:h r:h C4:e r D4 r E4 r F4 r G4:h', bpm: 90 },
            { t: 'p', text: 'Una **frase musical** es como una oración: tiene inicio, punto culminante y final. Las ligaduras de expresión suelen marcar frases: al final de cada una, aligera la última nota y "respira" levantando la mano.' },
          ],
        },
        {
          id: 'n2-m9-l3',
          title: 'El pedal de resonancia',
          minutes: 12,
          goals: ['Usar el pedal directo', 'Dominar el pedal sincopado (legato)', 'Saber cuándo NO usarlo'],
          blocks: [
            { t: 'p', text: 'El pedal derecho mantiene sonando todo lo que tocas. En la plataforma se activa manteniendo la **barra espaciadora** (o con un pedal conectado a tu teclado MIDI).' },
            { t: 'h', text: 'Pedal sincopado (o "legato")' },
            { t: 'p', text: 'Es la técnica más importante: **se cambia el pedal justo DESPUÉS de tocar el nuevo acorde**.' },
            { t: 'list', ordered: true, items: [
              'Toca el primer acorde y pisa el pedal.',
              'Toca el segundo acorde.',
              '**Inmediatamente después**, levanta el pedal y vuelve a pisarlo rápido.',
              'Resultado: los acordes quedan unidos sin mezclarse.',
            ] },
            { t: 'warn', text: 'Si cambias el pedal al mismo tiempo que tocas, habrá un hueco; si no lo cambias, los acordes se mezclan y "ensucian". Escucha siempre con atención.' },
            { t: 'p', text: 'Indicaciones en la partitura: **Ped.** (pisar) y **✱** (soltar), o una línea horizontal con muescas en cada cambio.' },
          ],
          exercises: [
            { title: 'Pedal sincopado', text: 'Toca estos acordes y cambia el pedal (espacio) justo después de cada uno. El objetivo es que suene unido sin mezclar.', steps: 'C3+C4+E4+G4:w A2+A3+C4+E4 F2+F3+A3+C4 G2+G3+B3+D4 C3+C4+E4+G4', bpm: 60, clef: 'grand' },
          ],
        },
      ],
    },
  ],
};
