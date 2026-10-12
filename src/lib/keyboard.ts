import { isBlack } from './music';

export interface KeyGeom {
  midi: number;
  black: boolean;
  left: number; // fracción 0..1
  width: number; // fracción 0..1
}

// Desplazamiento de las teclas negras respecto al centro de la unión (como en un piano real)
const BLACK_OFFSET: Record<number, number> = { 1: -0.12, 3: 0.12, 6: -0.15, 8: 0, 10: 0.15 };

/** Geometría compartida entre el teclado y la cascada de notas. */
export function layoutKeys(low: number, high: number): KeyGeom[] {
  if (isBlack(low)) low--;
  if (isBlack(high)) high++;
  const whites: number[] = [];
  for (let m = low; m <= high; m++) if (!isBlack(m)) whites.push(m);
  const ww = 1 / whites.length;
  const bw = ww * 0.62;
  const keys: KeyGeom[] = [];
  let wi = 0;
  for (let m = low; m <= high; m++) {
    if (!isBlack(m)) {
      keys.push({ midi: m, black: false, left: wi * ww, width: ww });
      wi++;
    } else {
      const center = wi * ww + BLACK_OFFSET[m % 12] * bw;
      keys.push({ midi: m, black: true, left: center - bw / 2, width: bw });
    }
  }
  return keys;
}

export const KEYBOARD_RANGES: Record<number, [number, number]> = {
  25: [48, 72],
  37: [48, 84],
  49: [36, 84],
  61: [36, 96],
  76: [28, 103],
  88: [21, 108],
};

/** Rango que cubre todas las notas con un margen, empezando en Do y terminando en Si/Do. */
export function fitRange(midis: number[], minOctaves = 2): [number, number] {
  if (!midis.length) return [48, 84];
  let lo = Math.min(...midis);
  let hi = Math.max(...midis);
  lo = Math.max(21, lo - (lo % 12) - (lo % 12 < 2 ? 12 : 0));
  hi = Math.min(108, hi + (12 - (hi % 12)));
  while (hi - lo < minOctaves * 12) {
    if (lo > 21) lo = Math.max(21, lo - 12);
    if (hi - lo < minOctaves * 12 && hi < 108) hi = Math.min(108, hi + 12);
    if (lo === 21 && hi === 108) break;
  }
  return [lo, hi];
}
