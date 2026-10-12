import type { Level } from './types';

export const level3: Level = {
  id: 'n3',
  title: 'Nivel 3 · Intermedio',
  subtitle: 'Escalas menores, acordes de séptima, armonía funcional, técnica y ritmo intermedio.',
  color: '#b07a43',
  modules: [
    // =====================================================================
    {
      id: 'm10',
      title: 'Escalas menores',
      description: 'Las tres formas de la escala menor y la relación entre tonalidades relativas.',
      lessons: [
        {
          id: 'n3-m10-l1',
          title: 'Menor natural y tonalidades relativas',
          minutes: 12,
          goals: ['Construir la escala menor natural', 'Encontrar el relativo menor de cualquier tonalidad'],
          blocks: [
            { t: 'p', text: 'Si tocas las notas de Do mayor pero empezando en **La**, obtienes **La menor natural**: La–Si–Do–Re–Mi–Fa–Sol–La. Fórmula: **T-S-T-T-S-T-T**.' },
            { t: 'p', text: 'Do mayor y La menor comparten armadura (ninguna alteración): son **tonalidades relativas**. El relativo menor está siempre **una 3ª menor por debajo** (el 6.º grado de la mayor).' },
            { t: 'table', head: ['Mayor', 'Relativo menor', 'Armadura'], rows: [
              ['Do', 'La menor', '—'],
              ['Sol', 'Mi menor', 'Fa#'],
              ['Re', 'Si menor', 'Fa#, Do#'],
              ['Fa', 'Re menor', 'Sib'],
              ['Sib', 'Sol menor', 'Sib, Mib'],
            ] },
            { t: 'listen', label: 'La menor natural', notes: 'A3:e B3 C4 D4 E4 F4 G4 A4 G4 F4 E4 D4 C4 B3 A3:h', bpm: 90 },
          ],
          exercises: [
            { title: 'La menor natural', text: 'Digitación igual que Do mayor: 1-2-3-1-2-3-4-5.', steps: 'A3 B3 C4 D4 E4 F4 G4 A4 G4 F4 E4 D4 C4 B3 A3', clef: 'treble' },
            { title: 'Mi menor natural', text: 'Con Fa#.', steps: 'E4 F#4 G4 A4 B4 C5 D5 E5', clef: 'treble' },
          ],
        },
        {
          id: 'n3-m10-l2',
          title: 'Menor armónica',
          minutes: 10,
          goals: ['Elevar el 7.º grado', 'Entender la sensible y la 2ª aumentada'],
          blocks: [
            { t: 'p', text: 'En la menor natural, el 7.º grado está a un tono de la tónica y "no empuja" hacia ella. Para crear una **sensible** (nota a un semitono de la tónica) se **eleva el 7.º grado**: La menor armónica = La–Si–Do–Re–Mi–Fa–**Sol#**–La.' },
            { t: 'p', text: 'Esto produce un acorde de dominante **mayor** (Mi–Sol#–Si) y un intervalo característico de **2ª aumentada** (Fa–Sol#) con sabor "oriental" o "árabe".' },
            { t: 'listen', label: 'La menor armónica', notes: 'A3:e B3 C4 D4 E4 F4 G#4 A4 G#4 F4 E4 D4 C4 B3 A3:h', bpm: 90 },
          ],
          exercises: [
            { title: 'La menor armónica', text: 'Atención al salto Fa → Sol#.', steps: 'A3 B3 C4 D4 E4 F4 G#4 A4 G#4 F4 E4 D4 C4 B3 A3', clef: 'treble' },
            { title: 'Re menor armónica', text: 'Sib y Do#.', steps: 'D4 E4 F4 G4 A4 Bb4 C#5 D5', clef: 'treble' },
          ],
        },
        {
          id: 'n3-m10-l3',
          title: 'Menor melódica',
          minutes: 10,
          goals: ['Elevar 6.º y 7.º al subir', 'Conocer la versión clásica y la de jazz'],
          blocks: [
            { t: 'p', text: 'Para suavizar la 2ª aumentada, la **menor melódica** eleva también el 6.º grado al **subir**: La–Si–Do–Re–Mi–**Fa#–Sol#**–La. En la tradición clásica, al **bajar** se toca como menor natural.' },
            { t: 'p', text: 'En el jazz se usa la versión ascendente en ambas direcciones (la "menor jazz"), fuente de muchos modos modernos.' },
            { t: 'listen', label: 'La menor melódica (clásica)', notes: 'A3:e B3 C4 D4 E4 F#4 G#4 A4 G4 F4 E4 D4 C4 B3 A3:h', bpm: 90 },
          ],
          exercises: [
            { title: 'La menor melódica', text: 'Sube con Fa#-Sol#, baja con Sol-Fa naturales.', steps: 'A3 B3 C4 D4 E4 F#4 G#4 A4 G4 F4 E4 D4 C4 B3 A3', clef: 'treble' },
          ],
        },
        {
          id: 'n3-m10-l4',
          title: 'Digitación de todas las escalas',
          minutes: 15,
          goals: ['Conocer las reglas de digitación', 'Tener una referencia para las 12 tonalidades'],
          blocks: [
            { t: 'p', text: 'Reglas que explican casi todas las digitaciones de escalas:' },
            { t: 'list', items: [
              'El **pulgar nunca toca una tecla negra** en escalas (salvo excepciones avanzadas).',
              'Los dedos 2-3 y 2-3-4 caen sobre los grupos de teclas negras.',
              'El **dedo 4** aparece una sola vez por octava: memoriza dónde va y lo demás encaja.',
            ] },
            { t: 'table', head: ['Escala', 'Mano derecha (subiendo)', 'Mano izquierda (subiendo)', 'Dedo 4 MD'], rows: [
              ['Do, Sol, Re, La, Mi', '1 2 3 1 2 3 4 5', '5 4 3 2 1 3 2 1', '7.º grado'],
              ['Si', '1 2 3 1 2 3 4 5', '4 3 2 1 4 3 2 1', 'La#'],
              ['Fa', '1 2 3 4 1 2 3 4', '5 4 3 2 1 3 2 1', 'Sib'],
              ['Sib', '4 1 2 3 1 2 3 4', '3 2 1 4 3 2 1 3', 'Sib'],
              ['Mib', '3 1 2 3 4 1 2 3', '3 2 1 4 3 2 1 3', 'Lab'],
              ['Lab', '3 4 1 2 3 1 2 3', '3 2 1 4 3 2 1 3', 'Reb'],
              ['Reb', '2 3 1 2 3 4 1 2', '3 2 1 4 3 2 1 3', 'Sib'],
              ['Fa# / Solb', '2 3 4 1 2 3 1 2', '4 3 2 1 3 2 1 4', 'La#'],
            ] },
            { t: 'tip', text: 'Rutina diaria recomendada: dos escalas mayores + sus relativas menores, manos separadas y luego juntas, 2 octavas, con metrónomo. En 12 días habrás recorrido todas.' },
          ],
          exercises: [
            { title: 'Si mayor', text: '5 sostenidos. Mano derecha 1-2-3-1-2-3-4-5.', steps: 'B3 C#4 D#4 E4 F#4 G#4 A#4 B4', clef: 'treble' },
            { title: 'Mib mayor', text: 'Empieza con el dedo 3: 3-1-2-3-4-1-2-3.', steps: 'Eb4 F4 G4 Ab4 Bb4 C5 D5 Eb5', clef: 'treble' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm11',
      title: 'Armonía funcional',
      description: 'Por qué los acordes "van" hacia otros: funciones, séptimas, cadencias y progresiones.',
      lessons: [
        {
          id: 'n3-m11-l1',
          title: 'Tónica, subdominante y dominante',
          minutes: 12,
          goals: ['Entender las tres funciones armónicas', 'Sentir tensión y reposo'],
          blocks: [
            { t: 'p', text: 'Cada acorde de la tonalidad cumple una **función**:' },
            { t: 'list', items: [
              '**Tónica (T)** — I, vi, (iii): reposo, "estar en casa".',
              '**Subdominante (S)** — IV, ii: alejamiento, preparación.',
              '**Dominante (D)** — V, vii°: tensión máxima que pide volver a la tónica.',
            ] },
            { t: 'p', text: 'El ciclo **T → S → D → T** es el motor de casi toda la música tonal, de Bach al pop. La tensión de la dominante viene de la **sensible** (7.º grado, que quiere subir a la tónica) y del tritono cuando se añade la 7ª.' },
            { t: 'listen', label: 'T – S – D – T en Do', notes: 'C3+C4+E4+G4:h F2+C4+F4+A4 G2+B3+D4+G4 C3+C4+E4+G4:w', bpm: 70 },
          ],
        },
        {
          id: 'n3-m11-l2',
          title: 'Acordes de séptima',
          minutes: 15,
          goals: ['Construir los 5 tipos principales de séptima', 'Conocer las séptimas diatónicas'],
          blocks: [
            { t: 'p', text: 'Añadiendo otra 3ª a la tríada obtenemos un **acorde de séptima** (1-3-5-7). Los cinco tipos esenciales:' },
            { t: 'table', head: ['Tipo', 'Cifrado', 'Fórmula', 'En Do', 'Uso'], rows: [
              ['Séptima mayor', 'Cmaj7', '1 3 5 7', 'Do Mi Sol Si', 'I y IV, sonido jazz suave'],
              ['Dominante', 'C7', '1 3 5 b7', 'Do Mi Sol Sib', 'V: tensión que resuelve'],
              ['Menor séptima', 'Cm7', '1 b3 5 b7', 'Do Mib Sol Sib', 'ii, iii, vi'],
              ['Semidisminuido', 'Cm7b5 / Cø', '1 b3 b5 b7', 'Do Mib Solb Sib', 'vii en mayor, ii en menor'],
              ['Disminuido', 'Cdim7 / C°7', '1 b3 b5 bb7', 'Do Mib Solb La', 'vii° en menor armónica'],
            ] },
            { t: 'p', text: 'Séptimas diatónicas en Do mayor: **Cmaj7 – Dm7 – Em7 – Fmaj7 – G7 – Am7 – Bm7b5**.' },
            { t: 'listen', label: 'Los cinco tipos sobre Do', notes: 'C4+E4+G4+B4:h C4+E4+G4+Bb4 C4+Eb4+G4+Bb4 C4+Eb4+Gb4+Bb4 C4+Eb4+Gb4+A4', bpm: 60 },
          ],
          exercises: [
            { title: 'Cinco séptimas sobre Do', text: 'maj7, 7, m7, m7b5, dim7.', steps: 'C4+E4+G4+B4 C4+E4+G4+Bb4 C4+Eb4+G4+Bb4 C4+Eb4+Gb4+Bb4 C4+Eb4+Gb4+A4', clef: 'treble' },
            { title: 'Séptimas diatónicas de Do', text: 'Cmaj7 Dm7 Em7 Fmaj7 G7 Am7 Bm7b5.', steps: 'C4+E4+G4+B4 D4+F4+A4+C5 E4+G4+B4+D5 F4+A4+C5+E5 G4+B4+D5+F5 A4+C5+E5+G5 B4+D5+F5+A5', clef: 'treble' },
          ],
        },
        {
          id: 'n3-m11-l3',
          title: 'Cadencias',
          minutes: 12,
          goals: ['Reconocer los 4 tipos de cadencia', 'Tocarlas en Do mayor'],
          blocks: [
            { t: 'p', text: 'Una **cadencia** es el final de una frase, como la puntuación de un texto:' },
            { t: 'table', head: ['Cadencia', 'Acordes', 'Efecto', 'Puntuación'], rows: [
              ['Auténtica (perfecta)', 'V → I', 'Conclusión total', 'Punto final'],
              ['Plagal', 'IV → I', 'Final suave, "Amén"', 'Punto y aparte'],
              ['Semicadencia', '… → V', 'Queda en suspenso', 'Coma / pregunta'],
              ['Rota (engañosa)', 'V → vi', 'Sorpresa: esperas I y llega vi', 'Puntos suspensivos'],
            ] },
            { t: 'listen', label: 'Auténtica: G7 → C', notes: 'G2+B3+D4+F4:h C3+C4+E4+G4:h', bpm: 60 },
            { t: 'listen', label: 'Plagal: F → C', notes: 'F2+C4+F4+A4:h C3+C4+E4+G4:h', bpm: 60 },
            { t: 'listen', label: 'Rota: G7 → Am', notes: 'G2+B3+D4+F4:h A2+C4+E4+A4:h', bpm: 60 },
          ],
          exercises: [
            { title: 'Cadencia auténtica', text: 'I – IV – V7 – I con buena conducción de voces.', steps: 'C3+C4+E4+G4 F2+C4+F4+A4 G2+B3+D4+F4 C3+C4+E4+G4', clef: 'grand' },
            { title: 'Cadencia rota', text: 'I – IV – V7 – vi.', steps: 'C3+C4+E4+G4 F2+C4+F4+A4 G2+B3+D4+F4 A2+C4+E4+A4', clef: 'grand' },
          ],
        },
        {
          id: 'n3-m11-l4',
          title: 'Progresiones populares',
          minutes: 15,
          goals: ['Tocar las progresiones más usadas', 'Transportarlas a otras tonalidades'],
          blocks: [
            { t: 'table', head: ['Progresión', 'En Do', 'Dónde la oyes'], rows: [
              ['I – V – vi – IV', 'C G Am F', 'Miles de canciones pop ("Let it be", "Someone like you")'],
              ['I – vi – IV – V', 'C Am F G', 'Doo-wop años 50 ("Stand by me")'],
              ['vi – IV – I – V', 'Am F C G', 'Pop emotivo'],
              ['ii – V – I', 'Dm7 G7 Cmaj7', 'La columna del jazz'],
              ['I – IV – V (12 compases)', 'C C C C F F C C G F C G', 'Blues y rock & roll'],
              ['Canon (Pachelbel)', 'C G Am Em F C F G', 'Canon en Re, "Basket case"'],
            ] },
            { t: 'listen', label: 'I – V – vi – IV', notes: 'C3+C4+E4+G4:w G2+B3+D4+G4 A2+C4+E4+A4 F2+C4+F4+A4', bpm: 90 },
            { t: 'listen', label: 'ii – V – I', notes: 'D3+F4+A4+C5:w G2+F4+B4+D5 C3+E4+G4+B4', bpm: 80 },
            { t: 'tip', text: 'Transportar = tocar lo mismo en otra tonalidad. Piensa en grados, no en notas: "I-V-vi-IV en Sol" = G D Em C. También puedes usar el **transpositor** del panel de sonido para oír cualquier cosa en otro tono sin cambiar lo que tocas.' },
          ],
          exercises: [
            { title: 'I – V – vi – IV', text: 'C – G/B – Am – F/A, con inversiones cercanas.', steps: 'C3+C4+E4+G4 B2+B3+D4+G4 A2+C4+E4+A4 F2+C4+F4+A4', clef: 'grand' },
            { title: 'ii – V – I', text: 'Dm7 – G7 – Cmaj7.', steps: 'D3+F4+A4+C5 G2+F4+B4+D5 C3+E4+G4+B4', clef: 'grand' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm12',
      title: 'Técnica pianística',
      description: 'Arpegios, Hanon, independencia, escalas en terceras y cómo practicar con eficacia.',
      lessons: [
        {
          id: 'n3-m12-l1',
          title: 'Arpegios',
          minutes: 12,
          goals: ['Tocar arpegios de 2 octavas', 'Aplicar el paso del pulgar en arpegios'],
          blocks: [
            { t: 'p', text: 'Los arpegios exigen un **paso del pulgar más amplio** que las escalas. Digitación mano derecha (Do mayor): **1-2-3-1-2-3-5** (dos octavas: 1-2-3-1-2-3-1-2-3-5 en algunos métodos).' },
            { t: 'list', items: [
              'La muñeca guía el movimiento lateral; el codo acompaña.',
              'No "saltes" con el pulgar: deslízalo con antelación.',
              'Mantén el sonido uniforme en el cruce.',
            ] },
            { t: 'listen', label: 'Arpegio de Do, 2 octavas', notes: 'C4:e E4 G4 C5 E5 G5 C6 G5 E5 C5 G4 E4 C4:h', bpm: 90 },
          ],
          exercises: [
            { title: 'Arpegio de Do mayor', text: '2 octavas arriba y abajo.', steps: 'C4 E4 G4 C5 E5 G5 C6 G5 E5 C5 G4 E4 C4', fingers: '1 2 3 1 2 3 5 3 2 1 3 2 1', clef: 'treble' },
            { title: 'Arpegio de La menor', text: '2 octavas.', steps: 'A3 C4 E4 A4 C5 E5 A5 E5 C5 A4 E4 C4 A3', clef: 'treble' },
          ],
        },
        {
          id: 'n3-m12-l2',
          title: 'El virtuoso pianista: Hanon',
          minutes: 12,
          goals: ['Conocer los ejercicios de Hanon', 'Tocar el ejercicio n.º 1'],
          blocks: [
            { t: 'p', text: '**Charles-Louis Hanon** publicó en 1873 60 ejercicios para fortalecer y dar independencia a los dedos. El **n.º 1** es un patrón de 8 notas que sube por grados: Do-Mi-Fa-Sol-La-Sol-Fa-Mi, Re-Fa-Sol-La-Si-La-Sol-Fa…' },
            { t: 'listen', label: 'Hanon n.º 1 (inicio)', notes: 'C4:s E4 F4 G4 A4 G4 F4 E4 D4 F4 G4 A4 B4 A4 G4 F4 E4 G4 A4 B4 C5 B4 A4 G4 C5:h', bpm: 72 },
            { t: 'tip', text: 'Empieza a 60 BPM en semicorcheas, levantando bien cada dedo. Sube 4 BPM por semana. Varía: staccato, acentos cada 3 notas, ritmos con puntillo.' },
            { t: 'warn', text: 'Hanon es gimnasia, no música: 5–10 minutos al día bastan. Detente ante cualquier molestia.' },
          ],
          exercises: [
            { title: 'Hanon n.º 1 — primeros compases', text: 'Digitación MD: 1-2-3-4-5-4-3-2.', steps: 'C4 E4 F4 G4 A4 G4 F4 E4 D4 F4 G4 A4 B4 A4 G4 F4 E4 G4 A4 B4 C5 B4 A4 G4', fingers: '1 2 3 4 5 4 3 2 1 2 3 4 5 4 3 2 1 2 3 4 5 4 3 2', clef: 'treble' },
          ],
        },
        {
          id: 'n3-m12-l3',
          title: 'Independencia de manos',
          minutes: 12,
          goals: ['Tocar ritmos distintos en cada mano', 'Mantener articulaciones diferentes'],
          blocks: [
            { t: 'p', text: 'El gran reto intermedio: que cada mano haga algo **distinto**. Por ejemplo, la izquierda en negras legato y la derecha en corcheas staccato.' },
            { t: 'list', ordered: true, items: [
              'Practica cada mano sola hasta que sea automática.',
              'Junta las manos a **la mitad del tempo**.',
              'Identifica los puntos de coincidencia (las notas que caen juntas) y úsalos como anclas.',
              'Cuenta en voz alta las subdivisiones.',
            ] },
            { t: 'listen', label: 'MI negras + MD corcheas', notes: 'C3+C4:e E4 C3+G4:e E4 G2+B3:e D4 G2+G4:e D4 C3+C4:h', bpm: 90 },
          ],
          exercises: [
            { title: 'Bajo en negras, melodía en corcheas', text: 'La mano izquierda toca en cada tiempo; la derecha dos notas por tiempo.', steps: 'C3+C4 E4 C3+G4 E4 G2+B3 D4 G2+G4 D4 C3+C4', clef: 'grand' },
          ],
        },
        {
          id: 'n3-m12-l4',
          title: 'Escalas en movimiento contrario, terceras y sextas',
          minutes: 12,
          goals: ['Tocar escalas con ambas manos en espejo', 'Escalas en terceras'],
          blocks: [
            { t: 'p', text: 'El **movimiento contrario** (las manos se alejan desde el centro) es más fácil al principio que el paralelo, porque las digitaciones son simétricas: los pulgares pasan a la vez.' },
            { t: 'p', text: 'Las **escalas en terceras** (dos notas a la vez a distancia de 3ª) desarrollan la independencia dentro de una misma mano y son base de Chopin y Liszt.' },
            { t: 'listen', label: 'Do mayor en terceras', notes: 'C4+E4:e D4+F4 E4+G4 F4+A4 G4+B4 A4+C5 B4+D5 C5+E5:h', bpm: 80 },
          ],
          exercises: [
            { title: 'Movimiento contrario', text: 'Ambas manos desde Do: la derecha sube, la izquierda baja.', steps: 'C3+C4 B2+D4 A2+E4 G2+F4 F2+G4 E2+A4 D2+B4 C2+C5', clef: 'grand' },
            { title: 'Terceras', text: 'Do mayor en terceras, mano derecha (1-3, 2-4, 3-5…).', steps: 'C4+E4 D4+F4 E4+G4 F4+A4 G4+B4 A4+C5 B4+D5 C5+E5', clef: 'treble' },
          ],
        },
        {
          id: 'n3-m12-l5',
          title: 'Cómo practicar de forma eficaz',
          minutes: 10,
          goals: ['Organizar una sesión de estudio', 'Aplicar técnicas de estudio deliberado'],
          blocks: [
            { t: 'h', text: 'Estructura de una sesión de 45 minutos' },
            { t: 'table', head: ['Tiempo', 'Actividad'], rows: [
              ['5 min', 'Calentamiento: 5 dedos, escalas lentas'],
              ['10 min', 'Técnica: escalas, arpegios, Hanon'],
              ['20 min', 'Repertorio: los pasajes difíciles primero'],
              ['5 min', 'Lectura a primera vista o teoría'],
              ['5 min', 'Tocar algo que ya sabes, por placer'],
            ] },
            { t: 'h', text: 'Técnicas que funcionan' },
            { t: 'list', items: [
              '**Lento**: si fallas, vas demasiado rápido. La velocidad es consecuencia de la precisión.',
              '**Fragmentos**: trabaja 2–4 compases a la vez. Empieza por el final de la pieza (así lo aprendido se hace más fuerte).',
              '**Manos separadas** primero, siempre.',
              '**Ritmos alterados**: toca pasajes rápidos con puntillo (largo-corto) y al revés.',
              '**Metrónomo progresivo**: sube solo tras 3 repeticiones limpias.',
              '**Grábate**: usa el botón Grabar en la pestaña Tocar y escúchate con oído crítico.',
              '**Descansa**: 5 minutos cada 25. El cerebro consolida el aprendizaje en las pausas y durante el sueño.',
            ] },
            { t: 'tip', text: 'En **Canciones**, usa el **Modo práctica (espera)**: la canción no avanza hasta que tocas la nota correcta. Y reduce la velocidad al 50% para estudiar pasajes.' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm13',
      title: 'Ritmo intermedio',
      description: 'Compases compuestos, tresillos, síncopas y anacrusas.',
      lessons: [
        {
          id: 'n3-m13-l1',
          title: 'Compases compuestos: 6/8, 9/8, 12/8',
          minutes: 12,
          goals: ['Diferenciar compás simple y compuesto', 'Sentir 6/8 en dos pulsos'],
          blocks: [
            { t: 'p', text: 'En un compás **simple** (2/4, 3/4, 4/4) cada pulso se divide en **dos**. En uno **compuesto** cada pulso se divide en **tres**, y el pulso es una **negra con puntillo**.' },
            { t: 'table', head: ['Compás', 'Pulsos', 'Subdivisión', 'Sensación'], rows: [
              ['6/8', '2 (negras con puntillo)', '3 corcheas cada uno', 'UNO-dos-tres DOS-dos-tres (barcarola)'],
              ['9/8', '3', '3 corcheas', 'Vals "rodado"'],
              ['12/8', '4', '3 corcheas', 'Blues lento, baladas soul'],
            ] },
            { t: 'listen', label: '6/8: dos pulsos de tres', notes: 'C3+C4:e E4 G4 G2+D4:e F4 G4 C3+E4:e G4 C5 G2+B3:e D4 G4 C3+C4:q.', bpm: 120 },
            { t: 'tip', text: 'Configura el metrónomo en 6/8 con subdivisión 1 contando corcheas, o pon el pulso en negra con puntillo para sentir los dos tiempos.' },
          ],
        },
        {
          id: 'n3-m13-l2',
          title: 'Tresillos y síncopas',
          minutes: 12,
          goals: ['Tocar tresillos dentro de un pulso', 'Entender y sentir la síncopa'],
          blocks: [
            { t: 'p', text: 'Un **tresillo** mete **3 notas en el espacio de 2**. Tresillo de corcheas = 3 corcheas en una negra. Cuenta "tri-o-la, tri-o-la". La sonata Claro de Luna está construida enteramente sobre tresillos.' },
            { t: 'listen', label: 'Corcheas vs tresillos', notes: 'C4:e D4 E4 F4 G4:h C4:t D4 E4 F4:t G4 A4 G4:h', bpm: 80 },
            { t: 'p', text: 'La **síncopa** acentúa una parte **débil** del pulso y la prolonga sobre la fuerte, creando un efecto de "empuje". Es el alma del ragtime, jazz, latin y pop.' },
            { t: 'listen', label: 'Ritmo sincopado', notes: 'C4:e E4:q E4:e G4:q G4:e E4:e C4:h', bpm: 100 },
          ],
          exercises: [
            { title: 'Tresillos', text: 'Arpegios de Do en tresillos (escúchalo primero).', steps: 'C4:t E4 G4 C4 E4 G4 D4 F4 A4 D4 F4 A4', bpm: 70, clef: 'treble' },
          ],
        },
        {
          id: 'n3-m13-l3',
          title: 'Anacrusa y estructura de frases',
          minutes: 8,
          goals: ['Identificar la anacrusa', 'Reconocer frases de 4 y 8 compases'],
          blocks: [
            { t: 'p', text: 'La **anacrusa** son las notas que **preceden al primer tiempo fuerte**. Un compás incompleto al principio (y el último compás completa lo que falta). Ejemplos: Para Elisa (Mi–Re#), la Canción de cuna de Brahms, "Cumpleaños feliz".' },
            { t: 'p', text: 'La música suele organizarse en **frases de 4 u 8 compases**, agrupadas en **pregunta–respuesta** (antecedente que termina en semicadencia + consecuente que termina en cadencia auténtica). Reconocerlo facilita mucho memorizar.' },
            { t: 'listen', label: 'Cumpleaños feliz (anacrusa)', notes: 'G4:e. G4:s A4:q G4 C5 B4:h G4:e. G4:s A4:q G4 D5 C5:h', bpm: 100 },
          ],
        },
      ],
    },
  ],
};
