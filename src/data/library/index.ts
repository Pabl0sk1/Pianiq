import type { Song } from '../../lib/notation';

// Biblioteca permanente: cada archivo .json de esta carpeta es una canción que aparece
// siempre en "Canciones", sin tener que volver a convertirla ni importarla.
const files = import.meta.glob<Song>('./*.json', { eager: true, import: 'default' });

export const LIBRARY_SONGS: Song[] = Object.values(files)
  .map((s) => ({ ...s, pinned: true, user: false }))
  .sort((a, b) => a.title.localeCompare(b.title));

/** Guarda una canción en la biblioteca permanente (solo con `npm run dev`). */
export async function pinSong(song: Song): Promise<void> {
  await pinSongs([song]);
}

/** Guarda varias canciones de una vez (una sola escritura y una sola recarga de la página). */
export async function pinSongs(songs: Song[]): Promise<void> {
  const res = await fetch('/__library/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(songs.map((s) => ({ ...s, user: undefined, pinned: undefined }))),
  });
  if (!res.ok) throw new Error(await res.text());
}

/** La biblioteca permanente solo se puede escribir con el servidor de desarrollo (npm run dev). */
export const canPin = import.meta.env.DEV;
