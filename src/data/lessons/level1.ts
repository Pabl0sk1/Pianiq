import type { Level } from './types';

export const level1: Level = {
  id: 'n1',
  title: 'Nivel 1 · Principiante absoluto',
  subtitle: 'Desde cero: el teclado, la postura, el ritmo, la lectura y tus primeras canciones.',
  color: '#3f72a3',
  modules: [
    // =====================================================================
    {
      id: 'm1',
      title: 'Primeros pasos con el piano',
      description: 'Conoce el instrumento, siéntate bien y aprende a orientarte en el teclado.',
      lessons: [
        {
          id: 'n1-m1-l1',
          title: 'Conoce tu piano',
          minutes: 8,
          goals: ['Saber cómo produce sonido un piano', 'Distinguir teclas blancas y negras', 'Orientarte con los grupos de teclas negras'],
          blocks: [
            { t: 'p', text: 'El piano es un instrumento de **cuerda percutida**: al pulsar una tecla, un martillo forrado de fieltro golpea una o varias cuerdas tensadas. Cuanto más rápido baja la tecla, más fuerte suena. Por eso su nombre original es **pianoforte**: puede sonar suave (piano) y fuerte (forte).' },
            { t: 'p', text: 'Un piano acústico completo tiene **88 teclas**: 52 blancas y 36 negras. Los teclados digitales suelen tener 61, 76 u 88. En esta plataforma puedes elegir el tamaño en la pestaña **Tocar**.' },
            { t: 'h', text: 'Graves y agudos' },
            { t: 'p', text: 'Hacia la **izquierda** el sonido es más **grave** (cuerdas largas y gruesas). Hacia la **derecha**, más **agudo**. Pruébalo: pulsa una tecla en el extremo izquierdo y otra en el derecho.' },
            { t: 'h', text: 'El patrón de las teclas negras' },
            { t: 'p', text: 'Las teclas negras se agrupan en **grupos de 2 y de 3** que se repiten a lo largo de todo el teclado. Este patrón es tu mapa: gracias a él encontrarás cualquier nota sin mirar etiquetas.' },
            { t: 'keys', notes: ['C#4', 'D#4', 'F#4', 'G#4', 'A#4'], low: 'C4', high: 'B4' },
            { t: 'tip', text: 'Truco: la tecla blanca justo a la **izquierda del grupo de 2 negras** es siempre un **Do** (C). La que está a la izquierda del grupo de 3 negras es siempre un **Fa** (F).' },
            { t: 'h', text: 'Los pedales' },
            { t: 'list', items: [
              '**Derecho — pedal de resonancia (sustain):** levanta todos los apagadores y las notas siguen sonando al soltar las teclas. Aquí lo activas con la **barra espaciadora** o con un pedal MIDI.',
              '**Izquierdo — una corda:** suaviza y oscurece el sonido.',
              '**Central — sostenuto:** mantiene solo las notas que estaban pulsadas al pisarlo (no todos los pianos lo tienen).',
            ] },
          ],
          exercises: [
            { title: 'Explora los grupos de dos', text: 'Toca las dos teclas negras del grupo de 2 y luego las tres del grupo de 3, de izquierda a derecha.', steps: 'C#4 D#4 F#4 G#4 A#4', clef: 'none' },
          ],
        },
        {
          id: 'n1-m1-l2',
          title: 'Postura, mano y numeración de los dedos',
          minutes: 10,
          goals: ['Sentarte con la altura y distancia correctas', 'Colocar la mano en forma de cúpula', 'Conocer la numeración de dedos 1–5'],
          blocks: [
            { t: 'h', text: 'Cómo sentarse' },
            { t: 'list', ordered: true, items: [
              'Siéntate en la **mitad delantera** de la banqueta, con los pies apoyados en el suelo.',
              'Los **antebrazos** deben quedar aproximadamente **paralelos al suelo** con las manos sobre las teclas. Ajusta la altura de la banqueta si no es así.',
              'Distancia: con los codos ligeramente por delante del torso; no tan cerca que te encojas ni tan lejos que estires los brazos.',
              'Espalda erguida pero relajada, hombros sueltos. Centra tu cuerpo frente al **Do central**.',
            ] },
            { t: 'h', text: 'La forma de la mano' },
            { t: 'p', text: 'Imagina que sostienes una **pelota de tenis**: los dedos quedan curvados y tocan con la **yema** (no con la uña ni plana). La muñeca va a la altura de las teclas, ni hundida ni levantada. El pulgar toca con su lateral.' },
            { t: 'warn', text: 'Evita la tensión. Si sientes rigidez en antebrazo, hombro o cuello, para, sacude las manos y vuelve a empezar más despacio. La tensión es el enemigo número uno de la técnica.' },
            { t: 'h', text: 'Numeración de los dedos' },
            { t: 'p', text: 'En ambas manos: **1 = pulgar, 2 = índice, 3 = medio, 4 = anular, 5 = meñique**. Las partituras indican la digitación con estos números sobre o bajo las notas.' },
            { t: 'keys', notes: ['C4', 'D4', 'E4', 'F4', 'G4'], labels: { C4: '1', D4: '2', E4: '3', F4: '4', G4: '5' }, low: 'C4', high: 'B4' },
            { t: 'tip', text: 'Mano derecha en posición de Do: el pulgar (1) sobre Do, y cada dedo en la tecla blanca siguiente hasta el meñique (5) sobre Sol.' },
          ],
          exercises: [
            { title: 'Dedos 1-2-3-4-5', text: 'Mano derecha en posición de Do. Toca cada dedo uno por uno, despacio, levantando solo el dedo que toca.', steps: 'C4 D4 E4 F4 G4 F4 E4 D4 C4', fingers: '1 2 3 4 5 4 3 2 1', clef: 'treble' },
          ],
        },
        {
          id: 'n1-m1-l3',
          title: 'Los nombres de las notas',
          minutes: 10,
          goals: ['Aprender las 7 notas naturales', 'Conocer el sistema latino y el anglosajón', 'Localizar cualquier nota blanca'],
          blocks: [
            { t: 'p', text: 'La música occidental usa **7 notas naturales** (teclas blancas) que se repiten en ciclo:' },
            { t: 'table', head: ['Latino', 'Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'], rows: [['Anglosajón', 'C', 'D', 'E', 'F', 'G', 'A', 'B']] },
            { t: 'p', text: 'El sistema **anglosajón** (letras) se usa en cifrados de acordes, en software y en casi todo el mundo del jazz y el pop. Conviene dominar ambos. Puedes cambiar los nombres que ves en el teclado en **Ajustes → Nombres de notas**.' },
            { t: 'h', text: 'Encuéntralas usando las negras' },
            { t: 'list', items: [
              '**Do**: a la izquierda del grupo de 2 negras.',
              '**Re**: en medio del grupo de 2 negras.',
              '**Mi**: a la derecha del grupo de 2 negras.',
              '**Fa**: a la izquierda del grupo de 3 negras.',
              '**Sol** y **La**: entre las negras del grupo de 3.',
              '**Si**: a la derecha del grupo de 3 negras.',
            ] },
            { t: 'keys', notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'], low: 'C4', high: 'B4' },
            { t: 'listen', label: 'Escuchar Do–Re–Mi–Fa–Sol–La–Si–Do', notes: 'C4:q D4 E4 F4 G4 A4 B4 C5:h', bpm: 100 },
          ],
          exercises: [
            { title: 'Las siete notas', text: 'Toca la escala natural desde Do central hasta el Do siguiente.', steps: 'C4 D4 E4 F4 G4 A4 B4 C5', clef: 'treble' },
            { title: 'Busca sin mirar etiquetas', text: 'Toca Fa, Si, Re, La, Mi, Sol, Do (puedes ocultar los nombres en Ajustes para practicar de verdad).', steps: 'F4 B4 D4 A4 E4 G4 C4', clef: 'treble' },
          ],
        },
        {
          id: 'n1-m1-l4',
          title: 'Octavas y el Do central',
          minutes: 8,
          goals: ['Entender qué es una octava', 'Numerar las octavas', 'Encontrar el Do central (Do4)'],
          blocks: [
            { t: 'p', text: 'Una **octava** es la distancia entre una nota y la siguiente con el mismo nombre (de Do a Do, de Re a Re…). Suenan "igual pero más agudo" porque la frecuencia se **duplica**: el La4 vibra a 440 Hz y el La5 a 880 Hz.' },
            { t: 'p', text: 'Para distinguir cada nota se añade el **número de octava**. El **Do central** es **Do4 (C4)**, el Do más cercano al centro del piano y del nombre de la marca. En un piano de 88 teclas van desde **La0** hasta **Do8**.' },
            { t: 'keys', notes: ['C2', 'C3', 'C4', 'C5', 'C6'], low: 'C2', high: 'C7' },
            { t: 'listen', label: 'Escuchar los Do de grave a agudo', notes: 'C2:q C3 C4 C5 C6:h', bpm: 90 },
            { t: 'tip', text: 'En el teclado del ordenador puedes subir y bajar de octava con las flechas ← y →. La fila Z-X-C-V… toca una octava y la fila Q-W-E-R… la siguiente.' },
          ],
          exercises: [
            { title: 'Salta de Do en Do', text: 'Toca todos los Do de grave a agudo.', steps: 'C2 C3 C4 C5 C6', clef: 'grand' },
            { title: 'Todos los La', text: 'Ahora todos los La (entre la 2.ª y 3.ª tecla negra del grupo de 3).', steps: 'A2 A3 A4 A5', clef: 'grand' },
          ],
        },
        {
          id: 'n1-m1-l5',
          title: 'Las teclas negras: sostenidos y bemoles',
          minutes: 10,
          goals: ['Entender sostenido (#) y bemol (b)', 'Conocer la enarmonía', 'Saber que hay 12 sonidos distintos por octava'],
          blocks: [
            { t: 'p', text: 'Entre dos teclas vecinas cualesquiera (blanca o negra) hay un **semitono**, la distancia más pequeña del piano. Una octava contiene **12 semitonos**: 7 teclas blancas + 5 negras.' },
            { t: 'list', items: [
              '**Sostenido (♯ / #)**: sube la nota un semitono. Do# es la tecla negra a la derecha de Do.',
              '**Bemol (♭ / b)**: baja la nota un semitono. Reb es la tecla negra a la izquierda de Re.',
              '**Becuadro (♮)**: anula un sostenido o bemol anterior.',
            ] },
            { t: 'p', text: 'Do# y Reb son **la misma tecla**: se llaman **notas enarmónicas**. Su nombre depende del contexto (la tonalidad).' },
            { t: 'p', text: '¡Atención! No todas las blancas tienen una negra entre ellas: entre **Mi–Fa** y **Si–Do** hay solo un semitono, así que Mi# es igual a Fa y Si# es igual a Do.' },
            { t: 'keys', notes: ['C#4', 'D#4', 'F#4', 'G#4', 'A#4'], low: 'C4', high: 'C5' },
            { t: 'listen', label: 'Escala cromática (12 semitonos)', notes: 'C4:e C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5:h', bpm: 90 },
          ],
          exercises: [
            { title: 'Las cinco negras', text: 'Do#, Re#, Fa#, Sol#, La#.', steps: 'C#4 D#4 F#4 G#4 A#4', clef: 'treble' },
            { title: 'Escala cromática', text: 'Todas las teclas, blancas y negras, de Do4 a Do5. Digitación: pulgar en blancas, dedo 3 en negras (con Mi–Fa y Si–Do usa 1-2).', steps: 'C4 C#4 D4 D#4 E4 F4 F#4 G4 G#4 A4 A#4 B4 C5', clef: 'treble' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm2',
      title: 'Ritmo básico',
      description: 'El pulso, las figuras, los silencios y los compases: la columna vertebral de la música.',
      lessons: [
        {
          id: 'n1-m2-l1',
          title: 'Pulso y tempo',
          minutes: 8,
          goals: ['Sentir el pulso', 'Saber qué son los BPM', 'Usar el metrónomo'],
          blocks: [
            { t: 'p', text: 'El **pulso** es el latido regular de la música, lo que marcas con el pie sin pensar. El **tempo** es la velocidad de ese pulso, medida en **BPM** (pulsos por minuto). 60 BPM = un pulso por segundo.' },
            { t: 'table', head: ['Término', 'Carácter', 'BPM aprox.'], rows: [
              ['Largo / Grave', 'Muy lento y solemne', '40–60'],
              ['Adagio', 'Lento, tranquilo', '66–76'],
              ['Andante', 'Al paso, caminando', '76–108'],
              ['Moderato', 'Moderado', '108–120'],
              ['Allegro', 'Rápido, alegre', '120–156'],
              ['Presto', 'Muy rápido', '168–200'],
            ] },
            { t: 'p', text: 'El **metrónomo** marca el pulso con un clic. Lo tienes en la barra superior: ajusta los BPM, el compás y pulsa ▶. El primer tiempo de cada compás suena acentuado.' },
            { t: 'tip', text: 'Regla de oro del estudio: **despacio y correcto** primero. Sube el metrónomo de 4 en 4 BPM solo cuando toques sin errores tres veces seguidas.' },
          ],
          exercises: [
            { title: 'Toca con el pulso', text: 'Activa el metrónomo a 60 BPM y toca Do central en cada clic, ocho veces.', steps: 'C4:q C4 C4 C4 C4 C4 C4 C4', bpm: 60, clef: 'treble' },
          ],
        },
        {
          id: 'n1-m2-l2',
          title: 'Figuras musicales',
          minutes: 12,
          goals: ['Conocer redonda, blanca, negra, corchea y semicorchea', 'Contar sus duraciones'],
          blocks: [
            { t: 'p', text: 'Las **figuras** indican cuánto dura cada nota. Cada una vale la mitad que la anterior. Tomando la **negra** como pulso (1 tiempo):' },
            { t: 'table', head: ['Figura', 'Duración (en negras)', 'Cómo contar'], rows: [
              ['Redonda 𝅝', '4 tiempos', '1-2-3-4'],
              ['Blanca 𝅗𝅥', '2 tiempos', '1-2'],
              ['Negra ♩', '1 tiempo', '1'],
              ['Corchea ♪', '½ tiempo', '1-y'],
              ['Semicorchea 𝅘𝅥𝅯', '¼ tiempo', '1-e-y-a'],
            ] },
            { t: 'listen', label: 'Redonda → blancas → negras → corcheas', notes: 'C4:w C4:h C4 C4:q C4 C4 C4 C4:e C4 C4 C4 C4 C4 C4 C4', bpm: 80 },
            { t: 'p', text: 'Las corcheas y semicorcheas se unen con **barras** cuando van seguidas. Una corchea sola lleva un **corchete** (banderita).' },
            { t: 'tip', text: 'Cuenta siempre en voz alta: "uno-y-dos-y-tres-y-cuatro-y". Parece infantil, pero es lo que hacen los profesionales cuando un ritmo se complica.' },
          ],
          exercises: [
            { title: 'Blancas y negras', text: 'Do (blanca), Re (blanca), Mi-Fa-Sol-Fa (negras), Mi (redonda). Usa el botón Escuchar para oír el ritmo antes.', steps: 'C4:h D4:h E4:q F4 G4 F4 E4:w', bpm: 80, clef: 'treble' },
            { title: 'Corcheas', text: 'Sube y baja en corcheas: Do Re Mi Fa Sol Fa Mi Re, terminando en Do.', steps: 'C4:e D4 E4 F4 G4 F4 E4 D4 C4:h', bpm: 80, clef: 'treble' },
          ],
        },
        {
          id: 'n1-m2-l3',
          title: 'Silencios',
          minutes: 6,
          goals: ['Conocer los silencios equivalentes a cada figura', 'Entender que el silencio también es música'],
          blocks: [
            { t: 'p', text: 'Cada figura tiene su **silencio** con la misma duración. Durante un silencio no se toca, pero **el pulso sigue**: cuéntalo igual que una nota.' },
            { t: 'table', head: ['Silencio de…', 'Duración', 'Aspecto'], rows: [
              ['Redonda', '4 tiempos', 'Rectángulo colgando de la 4.ª línea'],
              ['Blanca', '2 tiempos', 'Rectángulo apoyado sobre la 3.ª línea'],
              ['Negra', '1 tiempo', 'Zigzag vertical 𝄽'],
              ['Corchea', '½ tiempo', 'Como un 7 con punto 𝄾'],
              ['Semicorchea', '¼ tiempo', 'Como el de corchea con dos ganchos 𝄿'],
            ] },
            { t: 'listen', label: 'Nota – silencio – nota – silencio', notes: 'C4:q r:q E4:q r:q G4:q r:q C5:h', bpm: 80 },
            { t: 'tip', text: 'Un silencio bien medido hace respirar la música. Levanta la mano con suavidad para que la nota anterior se corte justo a tiempo (sin pedal).' },
          ],
        },
        {
          id: 'n1-m2-l4',
          title: 'El compás',
          minutes: 10,
          goals: ['Leer las cifras de compás', 'Distinguir 2/4, 3/4 y 4/4', 'Sentir el acento del primer tiempo'],
          blocks: [
            { t: 'p', text: 'Los pulsos se agrupan en **compases**, separados por **líneas divisorias**. Al inicio de la partitura hay dos números:' },
            { t: 'list', items: [
              '**Número de arriba**: cuántos pulsos tiene cada compás.',
              '**Número de abajo**: qué figura vale un pulso (4 = negra, 8 = corchea, 2 = blanca).',
            ] },
            { t: 'table', head: ['Compás', 'Pulsos', 'Sensación', 'Ejemplos'], rows: [
              ['2/4', '2 negras', 'Marcha: FUER-te dé-bil', 'Polcas, marchas'],
              ['3/4', '3 negras', 'Vals: FUER-te dé-bil dé-bil', 'Valses, minuetos'],
              ['4/4 (C)', '4 negras', 'FUER-te dé-bil SEMI-fuerte dé-bil', 'Casi todo el pop y rock'],
            ] },
            { t: 'listen', label: 'Sensación de vals (3/4)', notes: 'C3:q E4+G4 E4+G4 G2 D4+F4 D4+F4 C3 E4+G4 E4+G4 C3+C4:h.', bpm: 120 },
            { t: 'tip', text: 'Configura el metrónomo en 3/4 y luego en 4/4: el acento del primer tiempo te ayuda a sentir el compás.' },
          ],
          exercises: [
            { title: 'Un vals de una nota', text: 'En 3/4: toca Do (fuerte) en el tiempo 1 y Mi-Sol (suave) en 2 y 3. Repite cuatro compases.', steps: 'C3:q E4+G4 E4+G4 C3 E4+G4 E4+G4 C3 E4+G4 E4+G4 C3 E4+G4 E4+G4', bpm: 100, clef: 'grand' },
          ],
        },
        {
          id: 'n1-m2-l5',
          title: 'Puntillo y ligadura',
          minutes: 8,
          goals: ['Aplicar el puntillo', 'Diferenciar ligadura de prolongación'],
          blocks: [
            { t: 'p', text: 'El **puntillo** (punto a la derecha de la nota) **añade la mitad** de su valor: blanca con puntillo = 2 + 1 = **3 tiempos**; negra con puntillo = 1 + ½ = **1½ tiempos**.' },
            { t: 'p', text: 'La **ligadura de prolongación** une dos notas **iguales**: se toca la primera y se mantiene durante la suma de ambas. Sirve para que una nota cruce la línea divisoria.' },
            { t: 'listen', label: 'Negra con puntillo + corchea (ritmo del Himno a la Alegría)', notes: 'E4:q. D4:e D4:h', bpm: 90 },
            { t: 'warn', text: 'No confundas la ligadura de prolongación (entre notas iguales) con la **ligadura de expresión** (entre notas distintas), que significa tocar **legato**, unido. La verás en el Nivel 2.' },
          ],
          exercises: [
            { title: 'Ritmo con puntillo', text: 'Mi (negra con puntillo), Re (corchea), Re (blanca). Escúchalo primero.', steps: 'E4:q. D4:e D4:h', bpm: 80, clef: 'treble' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm3',
      title: 'Lectura musical',
      description: 'El pentagrama, las claves de Sol y Fa, el gran pentagrama y las alteraciones.',
      lessons: [
        {
          id: 'n1-m3-l1',
          title: 'El pentagrama y la clave de Sol',
          minutes: 12,
          goals: ['Conocer las 5 líneas y 4 espacios', 'Leer notas en clave de Sol'],
          blocks: [
            { t: 'p', text: 'El **pentagrama** son 5 líneas horizontales que se cuentan **de abajo hacia arriba**. Las notas se escriben en líneas y espacios: cuanto más arriba, más aguda.' },
            { t: 'p', text: 'La **clave de Sol** (𝄞) se usa normalmente para la **mano derecha**. Su espiral rodea la **2.ª línea**, que es **Sol4**.' },
            { t: 'h', text: 'Notas en las líneas: Mi – Sol – Si – Re – Fa' },
            { t: 'staff', items: ['E4', 'G4', 'B4', 'D5', 'F5'], clef: 'treble' },
            { t: 'h', text: 'Notas en los espacios: Fa – La – Do – Mi' },
            { t: 'staff', items: ['F4', 'A4', 'C5', 'E5'], clef: 'treble' },
            { t: 'tip', text: 'Truco: los espacios en clave de Sol forman "FA-LA-DO-MI". Para las líneas: "MI SOL SI RE FA" → "MIra SOLo SI REcuerdas FAcil".' },
          ],
          exercises: [
            { title: 'Lee las líneas', text: 'Toca las notas de las cinco líneas en clave de Sol.', steps: 'E4 G4 B4 D5 F5', clef: 'treble' },
            { title: 'Lee los espacios', text: 'Toca las notas de los cuatro espacios.', steps: 'F4 A4 C5 E5', clef: 'treble' },
            { title: 'Lectura mezclada', text: 'Lee y toca.', steps: 'G4 E5 C5 F4 D5 B4 A4 F5 E4', clef: 'treble' },
          ],
        },
        {
          id: 'n1-m3-l2',
          title: 'La clave de Fa',
          minutes: 12,
          goals: ['Leer notas en clave de Fa', 'Relacionarla con la mano izquierda'],
          blocks: [
            { t: 'p', text: 'La **clave de Fa** (𝄢) se usa para la **mano izquierda** y las notas graves. Sus dos puntos rodean la **4.ª línea**, que es **Fa3**.' },
            { t: 'h', text: 'Líneas: Sol – Si – Re – Fa – La' },
            { t: 'staff', items: ['G2', 'B2', 'D3', 'F3', 'A3'], clef: 'bass' },
            { t: 'h', text: 'Espacios: La – Do – Mi – Sol' },
            { t: 'staff', items: ['A2', 'C3', 'E3', 'G3'], clef: 'bass' },
            { t: 'tip', text: 'Relación útil: la clave de Fa está "una línea desplazada" respecto a la de Sol. La nota de la 1.ª línea en Fa (Sol) es la de la 2.ª línea en Sol.' },
          ],
          exercises: [
            { title: 'Líneas en clave de Fa', text: 'Con la mano izquierda.', steps: 'G2 B2 D3 F3 A3', clef: 'bass' },
            { title: 'Espacios en clave de Fa', text: 'Con la mano izquierda.', steps: 'A2 C3 E3 G3', clef: 'bass' },
            { title: 'Lectura mezclada', text: 'Lee y toca.', steps: 'C3 F3 A2 D3 G3 B2 E3 G2', clef: 'bass' },
          ],
        },
        {
          id: 'n1-m3-l3',
          title: 'El gran pentagrama y las líneas adicionales',
          minutes: 10,
          goals: ['Leer en el sistema de dos pentagramas', 'Entender las líneas adicionales', 'Ubicar el Do central en ambas claves'],
          blocks: [
            { t: 'p', text: 'La música para piano se escribe en el **gran pentagrama**: clave de Sol arriba y clave de Fa abajo, unidas por una llave. Las notas que salen del pentagrama se escriben con **líneas adicionales**.' },
            { t: 'p', text: 'El **Do central (Do4)** está en una línea adicional **justo debajo** del pentagrama de Sol y **justo encima** del de Fa: es el punto de unión.' },
            { t: 'staff', items: ['C3', 'E3', 'G3', 'B3', 'C4', 'D4', 'F4', 'A4', 'C5'], clef: 'grand' },
            { t: 'p', text: 'Las notas más agudas que Fa5 o más graves que Sol2 usan líneas adicionales arriba o abajo. Para pasajes muy agudos o graves verás **8va** (tocar una octava arriba) u **8vb** (abajo).' },
          ],
          exercises: [
            { title: 'Cruzando por el Do central', text: 'Sube desde Do3 hasta Do5 pasando por el Do central.', steps: 'C3 E3 G3 C4 E4 G4 C5', clef: 'grand' },
            { title: 'Líneas adicionales', text: 'Notas con líneas adicionales: La5, Do6, Mi2, Do2.', steps: 'A5 C6 E2 C2', clef: 'grand' },
          ],
        },
        {
          id: 'n1-m3-l4',
          title: 'Alteraciones en la partitura',
          minutes: 8,
          goals: ['Leer sostenidos, bemoles y becuadros', 'Saber cuánto dura una alteración'],
          blocks: [
            { t: 'p', text: 'Las alteraciones se escriben **delante** de la nota, a su misma altura. Hay dos tipos:' },
            { t: 'list', items: [
              '**Accidentales**: aparecen junto a una nota y afectan a esa nota y sus repeticiones (en la misma altura) **hasta el final del compás**.',
              '**Armadura**: al principio de cada línea, tras la clave. Afectan a **todas** esas notas en **todas** las octavas durante toda la pieza (lo verás con las escalas).',
            ] },
            { t: 'staff', items: ['F#4', 'G4', 'Bb4', 'A4', 'C#5', 'D5'], clef: 'treble' },
            { t: 'p', text: 'El **becuadro** cancela una alteración anterior dentro del compás, o de la armadura.' },
          ],
          exercises: [
            { title: 'Lee con alteraciones', text: 'Fa#, Sol, Sib, La, Do#, Re.', steps: 'F#4 G4 Bb4 A4 C#5 D5', clef: 'treble' },
          ],
        },
        {
          id: 'n1-m3-l5',
          title: 'Tu primera lectura completa',
          minutes: 10,
          goals: ['Leer una melodía entera con ritmo', 'Aplicar todo lo aprendido'],
          blocks: [
            { t: 'p', text: 'Vamos a leer "Estrellita" en clave de Sol, posición de Do. Antes de tocar, **analiza**: ¿qué notas usa? ¿hay saltos? ¿qué ritmo tiene? Esta rutina de 30 segundos antes de tocar te ahorrará muchos errores.' },
            { t: 'staff', items: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'], clef: 'treble' },
            { t: 'list', ordered: true, items: [
              'Mira la clave y el compás.',
              'Encuentra la primera nota y la posición de la mano.',
              'Escucha el ejemplo y tararéalo.',
              'Tócalo lentamente sin parar, aunque te equivoques.',
              'Corrige los puntos difíciles por separado.',
            ] },
            { t: 'tip', text: 'Ve a **Canciones → Estrellita** para tocarla con ambas manos y la cascada de notas.' },
          ],
          exercises: [
            { title: 'Estrellita', text: 'Lee y toca la primera frase.', steps: 'C4:q C4 G4 G4 A4 A4 G4:h F4:q F4 E4 E4 D4 D4 C4:h', bpm: 90, clef: 'treble' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm4',
      title: 'Primeras canciones y coordinación',
      description: 'Posición de Do en ambas manos, tus primeras melodías y empezar a tocar con dos manos.',
      lessons: [
        {
          id: 'n1-m4-l1',
          title: 'Ejercicios de cinco dedos (mano derecha)',
          minutes: 10,
          goals: ['Igualar la fuerza de los dedos', 'Tocar legato en posición fija'],
          blocks: [
            { t: 'p', text: 'Los ejercicios de cinco dedos desarrollan **independencia** y **uniformidad**. Toca cada nota con el mismo volumen y sin huecos entre ellas (**legato**): una tecla sube justo cuando la siguiente baja.' },
            { t: 'list', items: [
              'Mantén los dedos que no tocan apoyados suavemente sobre sus teclas.',
              'El movimiento nace en el nudillo, no en la muñeca.',
              'El dedo 4 es el más débil: préstale atención extra.',
            ] },
            { t: 'listen', label: 'Patrón 1-2-3-4-5-4-3-2-1', notes: 'C4:e D4 E4 F4 G4 F4 E4 D4 C4:h', bpm: 80 },
          ],
          exercises: [
            { title: 'Escalera', text: 'Sube y baja.', steps: 'C4 D4 E4 F4 G4 F4 E4 D4 C4', fingers: '1 2 3 4 5 4 3 2 1', clef: 'treble' },
            { title: 'Saltos de tercera', text: 'Do-Mi, Re-Fa, Mi-Sol y vuelta.', steps: 'C4 E4 D4 F4 E4 G4 F4 D4 E4 C4', fingers: '1 3 2 4 3 5 4 2 3 1', clef: 'treble' },
            { title: 'Dedo 4 fuerte', text: 'Insiste en el anular.', steps: 'F4 E4 F4 G4 F4 E4 F4 D4 F4 C4', clef: 'treble' },
          ],
        },
        {
          id: 'n1-m4-l2',
          title: 'La mano izquierda',
          minutes: 10,
          goals: ['Colocar la mano izquierda en posición de Do', 'Entender la digitación espejo'],
          blocks: [
            { t: 'p', text: 'En la mano izquierda los dedos están "al revés": en la posición de Do (Do3–Sol3), el **meñique (5)** va sobre **Do** y el **pulgar (1)** sobre **Sol**.' },
            { t: 'keys', notes: ['C3', 'D3', 'E3', 'F3', 'G3'], labels: { C3: '5', D3: '4', E3: '3', F3: '2', G3: '1' }, low: 'C3', high: 'B3' },
            { t: 'tip', text: 'La mano izquierda suele ser menos ágil al principio. Dale el doble de práctica: en pocas semanas se igualará.' },
          ],
          exercises: [
            { title: 'Cinco dedos (izquierda)', text: 'Sube y baja con la mano izquierda.', steps: 'C3 D3 E3 F3 G3 F3 E3 D3 C3', fingers: '5 4 3 2 1 2 3 4 5', clef: 'bass' },
            { title: 'Bajo fundamental', text: 'Do–Sol–Do: el movimiento de bajo más común de la música.', steps: 'C3 G3 C3 G3 F3 C3 G3 C3', clef: 'bass' },
          ],
        },
        {
          id: 'n1-m4-l3',
          title: 'Primera canción: Himno a la Alegría',
          minutes: 12,
          goals: ['Tocar una melodía completa con ritmo', 'Practicar por frases'],
          blocks: [
            { t: 'p', text: 'El tema de la Novena de Beethoven se toca entero en posición de Do (excepto una nota: Sol3, que se toca con el pulgar estirándolo un poco hacia abajo). Tiene 4 frases de 4 compases.' },
            { t: 'listen', label: 'Escuchar la melodía', notes: 'E4:q E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4:q. D4:e D4:h', bpm: 100 },
            { t: 'list', ordered: true, items: [
              'Practica **frase por frase**.',
              'Une las frases 1 y 2. Después 3 y 4.',
              'Toca todo lento con el metrónomo a 70 BPM.',
              'Ve a **Canciones → Himno a la Alegría** para tocarla con acompañamiento.',
            ] },
          ],
          exercises: [
            { title: 'Frase 1', text: 'Mi Mi Fa Sol | Sol Fa Mi Re | Do Do Re Mi | Mi. Re Re', steps: 'E4:q E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4:q. D4:e D4:h', bpm: 90, clef: 'treble' },
            { title: 'Frase 2', text: 'Igual que la 1 pero termina en Do.', steps: 'E4:q E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4:q. C4:e C4:h', bpm: 90, clef: 'treble' },
            { title: 'Frase 3 (el puente)', text: 'Re Re Mi Do | Re Mi-Fa Mi Do | Re Mi-Fa Mi Re | Do Re Sol(grave)', steps: 'D4:q D4 E4 C4 D4 E4:e F4 E4:q C4 D4 E4:e F4 E4:q D4 C4 D4 G3:h', bpm: 90, clef: 'treble' },
          ],
        },
        {
          id: 'n1-m4-l4',
          title: 'Coordinación: dos manos juntas',
          minutes: 12,
          goals: ['Alternar manos', 'Tocar notas simultáneas con ambas manos', 'Acompañar una melodía con notas largas'],
          blocks: [
            { t: 'p', text: 'Tocar con las dos manos es como hablar y caminar a la vez: requiere que una acción se vuelva **automática**. Por eso siempre se practica primero **manos separadas**, y solo después juntas, **muy lento**.' },
            { t: 'h', text: 'Progresión recomendada' },
            { t: 'list', ordered: true, items: [
              '**Alternar**: una mano y luego la otra.',
              '**Unísonos**: las dos manos tocan la misma nota en octavas distintas.',
              '**Nota larga + melodía**: la izquierda mantiene una nota mientras la derecha se mueve.',
              '**Movimiento contrario**: las manos se alejan o se acercan en espejo.',
            ] },
            { t: 'listen', label: 'Movimiento contrario desde el Do central', notes: 'C4+C4:q B3+D4 A3+E4 G3+F4 F3+G4 G3+F4 A3+E4 B3+D4 C4:h', bpm: 80 },
          ],
          exercises: [
            { title: 'Alternar', text: 'Izquierda Do3, derecha Do4, izquierda Sol3, derecha Sol4…', steps: 'C3 C4 G3 G4 F3 F4 C3 C4', clef: 'grand' },
            { title: 'Octavas paralelas', text: 'Ambas manos a la vez, la misma nota.', steps: 'C3+C4 D3+D4 E3+E4 F3+F4 G3+G4 F3+F4 E3+E4 D3+D4 C3+C4', clef: 'grand' },
            { title: 'Movimiento contrario', text: 'Las manos se separan en espejo desde Mi3/Mi4… (Do3+Do4, Si2+Re4, etc.).', steps: 'C3+C4 B2+D4 A2+E4 G2+F4 F2+G4 G2+F4 A2+E4 B2+D4 C3+C4', clef: 'grand' },
            { title: 'Melodía con bajo', text: 'Mano izquierda Do3 + derecha Mi4, luego derecha Re4 y Do4.', steps: 'C3+E4 D4 C4 G2+D4 E4 C3+C4', clef: 'grand' },
          ],
        },
      ],
    },
  ],
};
