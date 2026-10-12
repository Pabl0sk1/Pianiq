<p align="center">
  <img src="branding/pianiq-logo-original.png" alt="Pianiq" width="360" />
</p>

<p align="center">
  <b>Toca, aprende y crea al piano desde el navegador.</b><br/>
  Un piano de cola real con sonido a tu medida, un curso completo de cero a avanzado<br/>
  y una biblioteca de obras para escuchar, leer y practicar.
</p>

---

![Pianiq — modo Tocar](docs/tocar.png)

## Qué hay dentro

### Tocar
- **10 modelos de instrumento.** El principal, *Pianiq Studio*, es un piano de cola muestreado nota a nota (Salamander Grand). Además: gran cola de concierto, vertical honky-tonk, piano eléctrico FM, Rhodes, clavecín, órgano, sintetizador, pad y celesta.
- **El sonido se ajusta por completo:**
  - **Afinación:** transposición, octava, afinación fina y La de referencia entre 415 y 466 Hz (por ejemplo 432 o 440).
  - **Envolvente y oscilador:** ADSR y forma de onda del sintetizador.
  - **Filtro y ecualizador:** filtro con resonancia y EQ de tres bandas.
  - **Efectos:** reverb, delay, chorus, phaser, trémolo, vibrato y distorsión.
  - **Salida:** panorama y amplitud estéreo.
- **Presets** de fábrica y propios.
- **Metrónomo** con compases de 2/4 a 12/8, subdivisiones, *tap tempo* y acento.
- **Grabadora** con reproducción, guardado y exportación a MIDI.
- **Formas de tocar:** ratón o pantalla táctil (la fuerza depende de dónde pulses la tecla), teclado del ordenador o un **teclado MIDI** con pedal.

### Aprender
![Pianiq — curso](docs/aprender.png)

Curso de **4 niveles, 70 lecciones y 98 ejercicios interactivos**, sin saltos: desde conocer el teclado y la postura hasta modos, voicings de jazz, polirritmias, improvisación e interpretación. Cada ejercicio muestra el pentagrama y la digitación, comprueba lo que tocas y cuenta los errores. El progreso se guarda solo.

### Canciones
![Pianiq — canciones en modo oscuro](docs/canciones-oscuro.png)

- **12 obras clásicas a dos manos:** Bach, Beethoven, Mozart, Satie, Pachelbel, Vivaldi, Grieg, Brahms…
- **Al reproducir:**
  - cascada de notas;
  - partitura activable (arriba, al lado o en ventana flotante);
  - velocidad del 25 al 150 %;
  - **pedal automático** para que la reproducción suene ligada.
- **Para practicar:** tocar una mano mientras la otra suena, o el **modo práctica**, que espera a que toques la nota correcta.
- **Añadir canciones:**
  - importar archivos **MIDI**;
  - escribir partituras en texto;
  - **convertir audio en notas** con IA (Basic Pitch de Spotify, procesado en tu equipo).
- **Biblioteca permanente** para fijar tus canciones.

### Oído y Diccionario
- Entrenamiento auditivo: notas, intervalos, acordes y dictado melódico.
- Diccionario de 22 tipos de acorde y 16 escalas y modos en las 12 tonalidades, con inversiones.

### Interfaz
- Modo claro, oscuro o **según el sistema** (por defecto).
- Tres tonos de marca: *tinta y latón*, *salvia* y *burdeos*.
- Nombres de notas latinos (Do Re Mi) o anglosajones (C D E).

## Empezar

Necesitas [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install
npm run dev
```

Se abre en <http://localhost:5173>. En Windows también puedes hacer doble clic en **`Iniciar Pianiq.bat`**.

La primera vez que eliges el piano de cola hace falta conexión: sus muestras de audio se descargan de `tonejs.github.io`. Mientras tanto suena un piano sintético.

```bash
npm run build     # versión de producción en dist/
npm run preview   # sirve la versión compilada
```

## Atajos

| Acción | Tecla |
|---|---|
| Tocar una octava | `Z S X D C V G B H N J M` |
| Tocar la octava siguiente | `Q 2 W 3 E R 5 T 6 Y 7 U I` |
| Pedal de resonancia | `Espacio` |
| Tocar forte | `Mayús` + tecla |
| Bajar / subir la octava del teclado | `←` `→` |
| Transponer | `↑` `↓` |
| Reproducir / pausar una canción | `Enter` |

## Añadir canciones a la biblioteca

Las obras viven en [`src/data/songs.ts`](src/data/songs.ts) y se escriben en una notación de texto sencilla:

```
E5:s D#5 E5 B4 D5 C5 | A4:e r:s C4:s E4 A4
```

- Cada elemento es `NOTA:DURACIÓN`. Las notas se escriben `C4` (Do central), `F#3`, `Bb2` o `Do4` / `Sib3`.
- Duraciones: `w` redonda, `h` blanca, `q` negra, `e` corchea, `s` semicorchea, `t` tresillo, o un número de negras. Con punto se añade la mitad (`q.`).
- Los acordes se escriben con `+` (`C4+E4+G4:h`) y los silencios con `r`.
- Si omites la duración se repite la anterior; las barras `|` solo sirven para leer mejor.

Desde la app, **Canciones → Crear / Importar** permite escribir, importar MIDI o convertir audio. Con **Fijar en la biblioteca** la canción se guarda en `src/data/library/` y aparece siempre (requiere `npm run dev`). Esa carpeta está fuera del repositorio porque suele contener música con derechos de autor.

## Cómo está hecho

| Parte | Tecnología |
|---|---|
| Interfaz | React 19 + TypeScript, Vite |
| Audio | [Tone.js](https://tonejs.github.io) con una cadena de efectos que solo conecta lo que está en uso |
| Piano de cola | Salamander Grand Piano (CC-BY, Alexander Holm) |
| MIDI | Web MIDI API y [@tonejs/midi](https://github.com/Tonejs/Midi) |
| Audio → notas | [Basic Pitch](https://github.com/spotify/basic-pitch-ts) (Spotify) con TensorFlow.js, cargado bajo demanda |
| Estado | Zustand, guardado en el navegador |
| Tipografía | Fraunces, IBM Plex Sans e IBM Plex Mono (incluidas en el proyecto) |

```
src/
├── audio/        motor de sonido, instrumentos, reproductor y entradas (ratón, teclado, MIDI)
├── components/   teclado, cascada, partitura, pentagrama, controles y marca
├── data/         lecciones del curso, obras clásicas y biblioteca personal
├── lib/          teoría musical, notación de texto, MIDI y conversión de audio
├── pages/        Tocar, Aprender, Canciones, Oído y Diccionario
└── state/        ajustes, progreso y canciones del usuario
```

## Créditos

- Muestras de piano: *Salamander Grand Piano* de Alexander Holm (CC-BY 3.0).
- Transcripción de audio: *Basic Pitch* de Spotify (Apache 2.0).
- Las obras clásicas incluidas son de dominio público; los arreglos son propios.
