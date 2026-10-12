import type { Level } from './types';

export const level4: Level = {
  id: 'n4',
  title: 'Nivel 4 · Avanzado',
  subtitle: 'Modos, armonía avanzada y jazz, técnica de concierto, interpretación, improvisación y composición.',
  color: '#a5483c',
  modules: [
    // =====================================================================
    {
      id: 'm14',
      title: 'Modos y escalas especiales',
      description: 'Los siete modos, las pentatónicas, el blues y las escalas simétricas.',
      lessons: [
        {
          id: 'n4-m14-l1',
          title: 'Los modos griegos',
          minutes: 18,
          goals: ['Conocer los 7 modos', 'Identificar la nota característica de cada uno'],
          blocks: [
            { t: 'p', text: 'Si tocas la escala de Do mayor empezando en cada una de sus notas obtienes los **siete modos**. Cada uno tiene un color propio dado por su **nota característica**:' },
            { t: 'table', head: ['Modo', 'Desde (blancas)', 'Fórmula vs. mayor', 'Nota característica', 'Color'], rows: [
              ['Jónico', 'Do', '1 2 3 4 5 6 7', '—', 'Mayor clásico'],
              ['Dórico', 'Re', '1 2 b3 4 5 6 b7', '6ª mayor', 'Menor luminoso (So What, Oye como va)'],
              ['Frigio', 'Mi', '1 b2 b3 4 5 b6 b7', '2ª menor', 'Español, flamenco, metal'],
              ['Lidio', 'Fa', '1 2 3 #4 5 6 7', '4ª aumentada', 'Etéreo, mágico (bandas sonoras)'],
              ['Mixolidio', 'Sol', '1 2 3 4 5 6 b7', '7ª menor', 'Mayor "rockero", blues'],
              ['Eólico', 'La', '1 2 b3 4 5 b6 b7', '6ª menor', 'Menor natural'],
              ['Locrio', 'Si', '1 b2 b3 4 b5 b6 b7', '5ª disminuida', 'Inestable, oscuro'],
            ] },
            { t: 'p', text: 'Para tocar un modo sobre cualquier tónica, piensa en la escala mayor y altera la nota característica. Ej.: **Re dórico** = Re mayor con 3ª y 7ª bajadas = Re Mi Fa Sol La Si Do.' },
            { t: 'listen', label: 'Re dórico', notes: 'D4:e E4 F4 G4 A4 B4 C5 D5:h', bpm: 90 },
            { t: 'listen', label: 'Mi frigio', notes: 'E4:e F4 G4 A4 B4 C5 D5 E5:h', bpm: 90 },
            { t: 'listen', label: 'Fa lidio', notes: 'F4:e G4 A4 B4 C5 D5 E5 F5:h', bpm: 90 },
          ],
          exercises: [
            { title: 'Re dórico', text: 'Solo teclas blancas, de Re a Re.', steps: 'D4 E4 F4 G4 A4 B4 C5 D5', clef: 'treble' },
            { title: 'Sol mixolidio', text: 'De Sol a Sol (con Fa natural).', steps: 'G4 A4 B4 C5 D5 E5 F5 G5', clef: 'treble' },
            { title: 'Do lidio', text: 'Do mayor con Fa#.', steps: 'C4 D4 E4 F#4 G4 A4 B4 C5', clef: 'treble' },
          ],
        },
        {
          id: 'n4-m14-l2',
          title: 'Pentatónicas y escala de blues',
          minutes: 14,
          goals: ['Tocar la pentatónica mayor y menor', 'Añadir la blue note'],
          blocks: [
            { t: 'p', text: 'La **pentatónica** tiene 5 notas y **ningún semitono**, por eso es imposible que "suene mal": es la escala ideal para empezar a improvisar.' },
            { t: 'list', items: [
              '**Pentatónica mayor**: 1 2 3 5 6 → Do Re Mi Sol La. (Las 5 negras forman la pentatónica de Fa# mayor.)',
              '**Pentatónica menor**: 1 b3 4 5 b7 → La Do Re Mi Sol (misma notas que Do pentatónica mayor).',
              '**Escala de blues**: pentatónica menor + **b5** (la "blue note"): La Do Re **Mib** Mi Sol.',
            ] },
            { t: 'listen', label: 'Escala de blues en La', notes: 'A3:e C4 D4 Eb4 E4 G4 A4 G4 E4 Eb4 D4 C4 A3:h', bpm: 100 },
            { t: 'tip', text: 'Prueba ahora mismo: toca solo las teclas negras al azar con un ritmo tranquilo. ¡Ya estás improvisando en pentatónica!' },
          ],
          exercises: [
            { title: 'Pentatónica de Do mayor', text: 'Do Re Mi Sol La Do.', steps: 'C4 D4 E4 G4 A4 C5 A4 G4 E4 D4 C4', clef: 'treble' },
            { title: 'Blues en La', text: 'La Do Re Mib Mi Sol La.', steps: 'A3 C4 D4 Eb4 E4 G4 A4', clef: 'treble' },
          ],
        },
        {
          id: 'n4-m14-l3',
          title: 'Escalas simétricas',
          minutes: 10,
          goals: ['Conocer la escala de tonos enteros', 'Conocer la disminuida y su uso'],
          blocks: [
            { t: 'list', items: [
              '**Cromática**: los 12 semitonos.',
              '**Tonos enteros**: 6 notas separadas por tonos (Do Re Mi Fa# Sol# La#). Solo existen 2 distintas. Sonido de ensueño, sin centro tonal: Debussy ("Voiles").',
              '**Disminuida**: alterna tono-semitono (8 notas). Solo hay 3 distintas. Sobre acordes dim7 (T-S) o dominantes 7(b9) (S-T).',
            ] },
            { t: 'listen', label: 'Tonos enteros', notes: 'C4:e D4 E4 F#4 G#4 A#4 C5:h', bpm: 90 },
            { t: 'listen', label: 'Disminuida T-S', notes: 'C4:e D4 Eb4 F4 Gb4 Ab4 A4 B4 C5:h', bpm: 90 },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm15',
      title: 'Armonía avanzada y jazz',
      description: 'Tensiones, dominantes secundarias, sustituciones, modulación, intercambio modal y voicings.',
      lessons: [
        {
          id: 'n4-m15-l1',
          title: 'Extensiones y tensiones: 9, 11, 13',
          minutes: 14,
          goals: ['Añadir 9ª, 11ª y 13ª', 'Saber qué tensiones evitar'],
          blocks: [
            { t: 'p', text: 'Si seguimos apilando terceras sobre un acorde de séptima aparecen las **extensiones**: **9ª** (= 2ª una octava arriba), **11ª** (= 4ª) y **13ª** (= 6ª).' },
            { t: 'table', head: ['Acorde', 'Notas en Do', 'Comentario'], rows: [
              ['Cmaj9', 'Do Mi Sol Si Re', 'Elegante; la 9ª enriquece sin tensar'],
              ['C9', 'Do Mi Sol Sib Re', 'Dominante funk/soul'],
              ['Cm9', 'Do Mib Sol Sib Re', 'Neo-soul, lo-fi'],
              ['Cm11', 'Do Mib Sol Sib Re Fa', 'Modal, "So What"'],
              ['C13', 'Do Mi Sib Re La', 'Dominante jazz (se omite la 5ª)'],
              ['Cmaj7#11', 'Do Mi Sol Si Fa#', 'Sonido lidio'],
            ] },
            { t: 'warn', text: 'La **11ª natural** choca con la 3ª mayor (están a 9ª menor): en acordes mayores y dominantes se usa **#11** o se omite la 3ª (sus).' },
            { t: 'p', text: 'Tensiones **alteradas** sobre la dominante: **b9, #9, #11, b13**. Crean mucha tensión antes de resolver (V7alt → I).' },
            { t: 'listen', label: 'Cmaj9 – Am9 – Dm9 – G13', notes: 'C3+E4+G4+B4+D5:w A2+G3+C4+E4+B4 D3+F3+C4+E4+A4 G2+F3+B3+E4+A4', bpm: 70 },
          ],
          exercises: [
            { title: 'Novenas', text: 'Cmaj9, C9, Cm9.', steps: 'C3+E4+G4+B4+D5 C3+E4+G4+Bb4+D5 C3+Eb4+G4+Bb4+D5', clef: 'grand' },
          ],
        },
        {
          id: 'n4-m15-l2',
          title: 'Dominantes secundarias y sustitución tritonal',
          minutes: 15,
          goals: ['Tonicalizar cualquier grado', 'Usar el subV7'],
          blocks: [
            { t: 'p', text: 'Una **dominante secundaria** es el V7 de un acorde que no es la tónica. Se escribe **V7/x**. En Do: **A7 → Dm** (V7/ii), **E7 → Am** (V7/vi), **D7 → G** (V7/V).' },
            { t: 'p', text: 'Así, una progresión simple se vuelve mucho más rica: C – Am – Dm – G7 → **C – E7 – Am – A7 – Dm – D7 – G7 – C** ("ciclo de quintas").' },
            { t: 'listen', label: 'C – A7 – Dm – G7 – C', notes: 'C3+E4+G4+C5:h A2+E4+G4+C#5 D3+F4+A4+D5 G2+F4+B4+D5 C3+E4+G4+C5:w', bpm: 70 },
            { t: 'h', text: 'Sustitución tritonal (subV7)' },
            { t: 'p', text: 'Un dominante puede sustituirse por el dominante situado a un **tritono** de distancia, porque comparten el tritono interno (3ª y 7ª intercambiadas). G7 (Si–Fa) ↔ **Db7** (Fa–Dob=Si). Resultado: el bajo baja cromáticamente: **Dm7 – Db7 – Cmaj7**.' },
            { t: 'listen', label: 'ii – subV7 – I', notes: 'D3+F4+A4+C5:w Db3+F4+B4+Eb5 C3+E4+G4+B4+D5', bpm: 70 },
          ],
          exercises: [
            { title: 'Ciclo de dominantes', text: 'E7 → A7 → D7 → G7 → C (solo 3ª y 7ª + bajo).', steps: 'E2+G#3+D4 A2+G3+C#4 D3+F#3+C4 G2+F3+B3 C3+E3+B3', clef: 'grand' },
          ],
        },
        {
          id: 'n4-m15-l3',
          title: 'Modulación',
          minutes: 12,
          goals: ['Cambiar de tonalidad con acorde pivote', 'Conocer la modulación directa y cromática'],
          blocks: [
            { t: 'p', text: '**Modular** es cambiar de tonalidad dentro de una pieza. Técnicas principales:' },
            { t: 'list', items: [
              '**Acorde pivote**: un acorde común a ambas tonalidades sirve de puente. Ej.: Do → Sol usando Am (vi de Do = ii de Sol): C – Am – **D7** – G.',
              '**Directa (abrupta)**: salto sin preparación, típico del "cambio de camión" pop (subir un semitono el último estribillo).',
              '**Cromática**: una voz se mueve por semitono hacia la nueva tonalidad.',
              '**Por dominante**: ir directamente al V7 de la nueva tonalidad.',
            ] },
            { t: 'listen', label: 'Do → Sol por pivote', notes: 'C3+E4+G4+C5:h A2+E4+A4+C5 D3+F#4+A4+C5 G2+D4+G4+B4:w', bpm: 70 },
            { t: 'tip', text: 'Modulaciones más naturales: a tonalidades vecinas en el círculo de quintas (V, IV) y a la relativa.' },
          ],
        },
        {
          id: 'n4-m15-l4',
          title: 'Intercambio modal (préstamo)',
          minutes: 12,
          goals: ['Tomar acordes de la tonalidad paralela menor', 'Usar iv, bVI y bVII en mayor'],
          blocks: [
            { t: 'p', text: 'El **intercambio modal** toma prestados acordes de la tonalidad **paralela** (misma tónica, otro modo). En Do mayor, los más usados de Do menor:' },
            { t: 'table', head: ['Acorde', 'En Do', 'Efecto'], rows: [
              ['iv (menor)', 'Fm', 'Nostalgia, melancolía (muy Beatles/Radiohead)'],
              ['bVI', 'Ab', 'Épico, cinematográfico'],
              ['bVII', 'Bb', 'Rock, heroico (Mixolidio)'],
              ['bIII', 'Eb', 'Brillo inesperado'],
              ['ii°/iiø7', 'Dm7b5', 'Oscurece el ii–V'],
            ] },
            { t: 'listen', label: 'C – F – Fm – C', notes: 'C3+E4+G4+C5:w F2+F4+A4+C5 F2+F4+Ab4+C5 C3+E4+G4+C5', bpm: 70 },
            { t: 'listen', label: 'C – Ab – Bb – C (cadencia épica)', notes: 'C3+E4+G4+C5:h Ab2+Eb4+Ab4+C5 Bb2+D4+F4+Bb4 C3+E4+G4+C5:w', bpm: 70 },
          ],
          exercises: [
            { title: 'IV – iv – I', text: 'F – Fm – C.', steps: 'F2+F4+A4+C5 F2+F4+Ab4+C5 C3+E4+G4+C5', clef: 'grand' },
          ],
        },
        {
          id: 'n4-m15-l5',
          title: 'Voicings de jazz',
          minutes: 18,
          goals: ['Tocar shell voicings', 'Tocar voicings sin fundamental (A/B)', 'Conocer el drop 2'],
          blocks: [
            { t: 'p', text: 'Un **voicing** es la forma concreta de distribuir las notas de un acorde. En jazz casi nunca se toca un acorde en posición cerrada básica.' },
            { t: 'h', text: 'Shell voicings (Bud Powell)' },
            { t: 'p', text: 'Solo **fundamental + 3ª + 7ª** (o fundamental + 7ª + 3ª). La 3ª y la 7ª definen la calidad del acorde: son las **notas guía**.' },
            { t: 'listen', label: 'ii–V–I con shells', notes: 'D3+C4+F4:w G2+F3+B3 C3+B3+E4', bpm: 70 },
            { t: 'h', text: 'Voicings sin fundamental (Bill Evans)' },
            { t: 'p', text: 'La mano izquierda toca **3-5-7-9** (posición A) o **7-9-3-5** (posición B) y el contrabajo (o tu mano izquierda en grave) da la fundamental. En un ii–V–I se alternan A-B-A y las voces se mueven mínimamente.' },
            { t: 'listen', label: 'Dm9 – G13 – Cmaj9 (A-B-A)', notes: 'D2+F3+A3+C4+E4:w G2+F3+A3+B3+E4 C3+E3+G3+B3+D4', bpm: 70 },
            { t: 'h', text: 'Drop 2' },
            { t: 'p', text: 'Toma un acorde cerrado de 4 notas y **baja una octava la segunda voz desde arriba**. Resultado: un voicing abierto y equilibrado, ideal para melodías armonizadas en bloque.' },
          ],
          exercises: [
            { title: 'Shells ii–V–I en Do', text: 'Dm7 (Re-Do-Fa), G7 (Sol-Fa-Si), Cmaj7 (Do-Si-Mi).', steps: 'D3+C4+F4 G2+F3+B3 C3+B3+E4', clef: 'grand' },
            { title: 'Rootless A-B-A', text: 'Dm9 (Fa La Do Mi), G13 (Fa La Si Mi), Cmaj9 (Mi Sol Si Re).', steps: 'F3+A3+C4+E4 F3+A3+B3+E4 E3+G3+B3+D4', clef: 'bass' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm16',
      title: 'Técnica avanzada',
      description: 'Ornamentos, octavas, saltos, polirritmias y una técnica sana para velocidad.',
      lessons: [
        {
          id: 'n4-m16-l1',
          title: 'Ornamentos',
          minutes: 14,
          goals: ['Ejecutar trinos, mordentes y grupetos', 'Distinguir apoyatura y acciaccatura'],
          blocks: [
            { t: 'table', head: ['Ornamento', 'Signo', 'Ejecución (sobre Do)'], rows: [
              ['Trino', 'tr', 'Alternancia rápida Do-Re-Do-Re… (en el Barroco empieza por la nota superior)'],
              ['Mordente superior', '𝆝 (zigzag corto)', 'Do-Re-Do rápido'],
              ['Mordente inferior', 'zigzag tachado', 'Do-Si-Do rápido'],
              ['Grupeto', '∽', 'Re-Do-Si-Do (rodea la nota)'],
              ['Apoyatura', 'nota pequeña sin tachar', 'Toma la mitad (o 2/3) del valor de la nota principal, en el tiempo'],
              ['Acciaccatura', 'nota pequeña tachada', 'Muy breve, casi simultánea, "crush note"'],
            ] },
            { t: 'listen', label: 'Trino sobre Do', notes: 'C5:x D5 C5 D5 C5 D5 C5 D5 C5 D5 C5 D5 C5 D5 B4 C5 C5:h', bpm: 80 },
            { t: 'listen', label: 'Mordente y grupeto', notes: 'C5:x D5 C5:q. r:q D5:s C5 B4 C5 E5:h', bpm: 80 },
            { t: 'tip', text: 'Para trinos rápidos usa pares de dedos fuertes (1-3, 2-4 o 2-3) y deja que la rotación del antebrazo haga el trabajo, no los dedos aislados.' },
          ],
          exercises: [
            { title: 'Trino lento', text: 'Alterna Do-Re con dedos 2-3 de forma pareja (luego aumenta la velocidad tocando libremente).', steps: 'C5:s D5 C5 D5 C5 D5 C5 D5 C5', clef: 'treble' },
          ],
        },
        {
          id: 'n4-m16-l2',
          title: 'Octavas, saltos y cruce de manos',
          minutes: 12,
          goals: ['Tocar octavas desde la muñeca', 'Preparar saltos con la vista y el brazo'],
          blocks: [
            { t: 'list', items: [
              '**Octavas**: mano en posición fija 1-5 (o 1-4 en negras para legato). El movimiento sale de la **muñeca** en pasajes rápidos y del **antebrazo** en fuerza. Nunca bloquees: rebota.',
              '**Saltos**: mira la nota de **destino antes** de saltar. El movimiento es un arco cerca de las teclas. Practica "a ciegas": salta y para justo encima de la nota sin tocarla.',
              '**Cruce de manos**: la mano que cruza pasa **por encima**; la otra se aparta ligeramente hacia abajo.',
            ] },
            { t: 'listen', label: 'Escala en octavas', notes: 'C4+C5:e D4+D5 E4+E5 F4+F5 G4+G5 A4+A5 B4+B5 C5+C6:h', bpm: 90 },
          ],
          exercises: [
            { title: 'Octavas en Do mayor', text: '1-5 en todas las notas.', steps: 'C4+C5 D4+D5 E4+E5 F4+F5 G4+G5 A4+A5 B4+B5 C5+C6', clef: 'treble' },
            { title: 'Saltos de bajo (stride)', text: 'Bajo grave y acorde medio: el patrón del piano stride.', steps: 'C2 E3+G3+C4 G2 E3+G3+C4 F2 F3+A3+C4 G2 F3+G3+B3', clef: 'bass' },
          ],
        },
        {
          id: 'n4-m16-l3',
          title: 'Polirritmias: 2 contra 3, 3 contra 4',
          minutes: 14,
          goals: ['Tocar 2:3 con fluidez', 'Entender el método del mínimo común múltiplo'],
          blocks: [
            { t: 'p', text: 'Una **polirritmia** superpone divisiones distintas del mismo pulso. La más común es **2 contra 3**: una mano toca 2 notas y la otra 3 en el mismo tiempo (Chopin, Debussy, Fantaisie-Impromptu…).' },
            { t: 'p', text: 'Método: divide el pulso en **6** (mcm de 2 y 3). La mano de 3 toca en 1, 3, 5; la de 2 en 1 y 4. Frase para memorizarlo: **"pasa la sal"** — "pa" (ambas), "sa" (3), "la" (2), "sal" (3).' },
            { t: 'listen', label: '2 contra 3', notes: 'C3+G4:s r:s E4:s G3:s G4:s r:s C3+G4:s r:s E4:s G3:s G4:s r:s', bpm: 50 },
            { t: 'p', text: '**3 contra 4** usa 12 subdivisiones: la de 3 en 1-5-9, la de 4 en 1-4-7-10. Practícalo muy lento con la frase "pasa la mantequilla".' },
          ],
        },
        {
          id: 'n4-m16-l4',
          title: 'Velocidad sin tensión',
          minutes: 12,
          goals: ['Usar el peso del brazo', 'Aplicar rotación del antebrazo', 'Prevenir lesiones'],
          blocks: [
            { t: 'p', text: 'La velocidad no viene de dedos más fuertes, sino de **movimientos más eficientes** y **relajación entre notas**. Principios de la escuela Taubman y similares:' },
            { t: 'list', items: [
              '**Peso del brazo**: deja que el brazo descanse sobre la yema; los dedos transmiten el peso, no empujan.',
              '**Rotación del antebrazo**: en trémolos, Alberti y trinos, gira el antebrazo como al abrir una puerta.',
              '**Agrupación (chunking)**: piensa en grupos de 4–8 notas como un solo gesto.',
              '**Liberación inmediata**: tras cada ataque, el músculo se relaja.',
              '**Alineación**: dedo, mano y antebrazo en línea; evita desviaciones laterales de la muñeca.',
            ] },
            { t: 'warn', text: 'Dolor = señal de alarma. Si aparece dolor, hormigueo o fatiga persistente, para. Tendinitis y síndrome del túnel carpiano son comunes en pianistas que estudian con tensión.' },
          ],
        },
      ],
    },
    // =====================================================================
    {
      id: 'm17',
      title: 'Interpretación, improvisación y creación',
      description: 'Los estilos históricos, contrapunto, improvisación, composición y preparación de un recital.',
      lessons: [
        {
          id: 'n4-m17-l1',
          title: 'Estilos e interpretación histórica',
          minutes: 18,
          goals: ['Adaptar el toque a cada época', 'Conocer los compositores clave'],
          blocks: [
            { t: 'table', head: ['Período', 'Fechas', 'Compositores', 'Claves de interpretación'], rows: [
              ['Barroco', '1600–1750', 'Bach, Händel, Scarlatti, Couperin', 'Voces independientes, articulación clara, poco pedal, ornamentos, dinámicas en bloque (terraza)'],
              ['Clásico', '1750–1820', 'Haydn, Mozart, Beethoven joven, Clementi', 'Elegancia, frases simétricas, bajo Alberti ligero, pedal discreto'],
              ['Romántico', '1820–1900', 'Chopin, Schumann, Liszt, Brahms, Chaikovski', 'Melodía cantabile, rubato, pedal rico, amplio rango dinámico'],
              ['Impresionismo', '1890–1920', 'Debussy, Ravel, Satie', 'Color y atmósfera, pedal largo, acordes paralelos, escalas exóticas'],
              ['Siglo XX / Moderno', '1900–hoy', 'Prokófiev, Bartók, Gershwin, Glass, Einaudi', 'Ritmo percusivo, disonancias, minimalismo, influencias del jazz'],
              ['Jazz / Popular', '1900–hoy', 'Joplin, Tatum, Evans, Monk, Peterson', 'Swing, síncopa, improvisación, voicings extendidos'],
            ] },
            { t: 'p', text: 'El **rubato** ("tiempo robado") es la flexibilidad expresiva del tempo: acelerar un poco hacia el clímax y retardar al final de la frase. En Chopin la mano izquierda mantiene el pulso mientras la derecha flota.' },
            { t: 'tip', text: 'Escucha en **Canciones** obras de cada época: Preludio en Do (Barroco), Minueto y Serenata (Clásico), Para Elisa y Canción de cuna (Romántico), Gymnopédie (Impresionismo).' },
          ],
        },
        {
          id: 'n4-m17-l2',
          title: 'Contrapunto e invención a dos voces',
          minutes: 15,
          goals: ['Entender las reglas básicas del contrapunto', 'Escribir/tocar dos voces independientes'],
          blocks: [
            { t: 'p', text: 'El **contrapunto** es el arte de combinar melodías independientes. Las **Invenciones** de Bach son el mejor estudio para ello.' },
            { t: 'list', items: [
              'Prefiere el **movimiento contrario y oblicuo** entre voces.',
              'Evita **5ª y 8ª paralelas** (pierden independencia).',
              'Consonancias perfectas (1, 5, 8) para comenzar y terminar; imperfectas (3, 6) en el desarrollo.',
              'Las disonancias se preparan y resuelven por grado conjunto.',
              '**Imitación**: una voz repite el motivo de la otra desplazado en el tiempo (canon, fuga).',
            ] },
            { t: 'listen', label: 'Imitación a la octava', notes: 'C4:e D4 E4 F4 C3+G4 D3+A4 E3+B4 F3+C5 G3+C5:h', bpm: 90 },
          ],
          exercises: [
            { title: 'Primera especie', text: 'Nota contra nota en movimiento contrario: 8ª – 6ª – 3ª – 3ª – 6ª – 8ª.', steps: 'C3+C4 D3+B3 E3+G3 F3+A3 G3+E4 C3+C4', clef: 'grand' },
          ],
        },
        {
          id: 'n4-m17-l3',
          title: 'Improvisación',
          minutes: 18,
          goals: ['Improvisar sobre una progresión', 'Usar motivos y desarrollarlos', 'Tocar un blues de 12 compases'],
          blocks: [
            { t: 'p', text: 'Improvisar es **componer en tiempo real**. Empieza con límites estrictos: pocas notas, un ritmo, una progresión.' },
            { t: 'list', ordered: true, items: [
              '**Mano izquierda fija**: un patrón simple (acordes en blancas) de I–V–vi–IV.',
              '**Mano derecha**: solo la pentatónica de la tonalidad. Frases cortas con silencios (¡respira!).',
              '**Motivo**: inventa una idea de 3–4 notas y **repítela, transpórtala, cambia su ritmo, inviértela**.',
              '**Notas guía**: apunta a la 3ª de cada acorde en el primer tiempo.',
              '**Pregunta–respuesta**: una frase que sube (pregunta) y otra que baja y descansa (respuesta).',
            ] },
            { t: 'h', text: 'Blues de 12 compases en Do' },
            { t: 'table', head: ['Compases 1-4', 'Compases 5-8', 'Compases 9-12'], rows: [['C7 C7 C7 C7', 'F7 F7 C7 C7', 'G7 F7 C7 G7']] },
            { t: 'listen', label: 'Riff de blues en Do', notes: 'C3+E3+G3:e C3+F3+A3 C3+E3+G3 C3+F3+A3 Eb4:s E4:e. G4:e C5:q r:e', bpm: 110 },
            { t: 'tip', text: 'Usa el **metrónomo** o graba tu mano izquierda con el botón Grabar, reprodúcela en bucle e improvisa encima.' },
          ],
          exercises: [
            { title: 'Lick de blues', text: 'Un lick típico sobre la escala de blues en Do.', steps: 'G4 Bb4 C5 Eb5 E5 G5 E5 C5', clef: 'treble' },
          ],
        },
        {
          id: 'n4-m17-l4',
          title: 'Composición y arreglos',
          minutes: 15,
          goals: ['Armonizar una melodía', 'Rearmonizar', 'Crear tu propia pieza'],
          blocks: [
            { t: 'h', text: 'Armonizar una melodía' },
            { t: 'list', ordered: true, items: [
              'Identifica la tonalidad y la cadencia final.',
              'Para cada compás, busca qué acorde diatónico contiene las notas largas o acentuadas.',
              'Prefiere I, IV y V en cadencias; vi, ii y iii para variedad.',
              'Mueve el bajo con suavidad (inversiones).',
            ] },
            { t: 'h', text: 'Rearmonizar' },
            { t: 'p', text: 'Cambiar los acordes manteniendo la melodía: sustituir I por vi o iii (comparten 2 notas), añadir dominantes secundarias, sustitución tritonal, préstamo modal, o un bajo cromático (línea de bajo descendente bajo una nota fija).' },
            { t: 'h', text: 'Forma' },
            { t: 'p', text: 'Estructuras clásicas: **binaria (AB)**, **ternaria (ABA)**, **rondó (ABACA)**, **tema y variaciones**, **sonata** (exposición–desarrollo–reexposición). En pop: intro–estrofa–estribillo–puente.' },
            { t: 'tip', text: 'Puedes escribir tus composiciones con la notación de texto en **Canciones → Crear / Importar**, escucharlas con cualquier sonido y exportarlas.' },
          ],
        },
        {
          id: 'n4-m17-l5',
          title: 'Memoria, lectura a primera vista y escenario',
          minutes: 14,
          goals: ['Memorizar de forma fiable', 'Mejorar la lectura a primera vista', 'Gestionar los nervios'],
          blocks: [
            { t: 'h', text: 'Los 4 tipos de memoria' },
            { t: 'list', items: [
              '**Muscular/táctil**: la de los dedos. Rápida pero frágil bajo nervios.',
              '**Auditiva**: saber cómo suena; poder cantarla.',
              '**Visual**: ver la partitura mentalmente.',
              '**Analítica**: saber la armonía y la forma. La más sólida: ¡úsala siempre!',
            ] },
            { t: 'p', text: 'Crea **puntos de anclaje** cada 4–8 compases desde los que puedas reiniciar si te pierdes.' },
            { t: 'h', text: 'Lectura a primera vista' },
            { t: 'list', items: [
              'Lee algo nuevo, fácil, cada día (2 niveles por debajo del tuyo).',
              'Antes: tonalidad, compás, patrones, pasajes difíciles (30 s).',
              '**Nunca pares**: mejor omitir notas que romper el pulso. Mira por delante.',
            ] },
            { t: 'h', text: 'Antes de tocar en público' },
            { t: 'list', items: [
              'Simula la actuación: grábate de principio a fin sin parar.',
              'Toca para amigos o familia antes del día clave.',
              'Respiración lenta (4 s inspirar, 6 s espirar) antes de salir.',
              'Si fallas, sigue: el público recuerda la música, no la nota.',
            ] },
            { t: 'tip', text: '¡Felicidades por llegar hasta aquí! Ahora toca: elige una pieza de la biblioteca, prepárala con todo lo aprendido y grábala. Después, pídeme nuevas piezas y te las añado a la biblioteca.' },
          ],
        },
      ],
    },
  ],
};
