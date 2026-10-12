import { memo, useEffect, useMemo, useRef } from 'react';
import { layoutKeys } from '../lib/keyboard';
import { midiToName } from '../lib/music';
import { input, computerKeyLabels } from '../audio/input';
import { useApp, useLive } from '../state/store';

export type Highlight = 'target' | 'rh' | 'lh' | 'ok' | 'wrong' | 'scale' | 'root' | 'demo';

interface Props {
  low: number;
  high: number;
  highlights?: Record<number, Highlight>;
  height?: number;
  interactive?: boolean;
  showLabels?: boolean;
  showComputerKeys?: boolean;
  compact?: boolean;
  /** Etiquetas personalizadas (p. ej. dedos o grados) */
  labels?: Record<number, string>;
}

function PianoImpl({
  low,
  high,
  highlights = {},
  height = 220,
  interactive = true,
  showLabels,
  showComputerKeys,
  compact,
  labels,
}: Props) {
  const ui = useApp((s) => s.ui);
  const active = useLive((s) => s.active);
  const keys = useMemo(() => layoutKeys(low, high), [low, high]);
  const pointers = useRef(new Map<number, number>());
  const ref = useRef<HTMLDivElement>(null);
  const labelsOn = showLabels ?? ui.showNoteLabels;
  const pcLabels = useMemo(
    () => ((showComputerKeys ?? ui.showKeyboardLabels) ? computerKeyLabels(ui.keyboardBaseOctave) : {}),
    [showComputerKeys, ui.showKeyboardLabels, ui.keyboardBaseOctave],
  );

  useEffect(() => {
    const map = pointers.current;
    return () => {
      for (const m of map.values()) input.noteOff(m);
      map.clear();
    };
  }, []);

  if (!interactive) pointers.current.clear();

  const keyAt = (x: number, y: number): { midi: number; vel: number } | null => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    const k = el?.closest('[data-midi]') as HTMLElement | null;
    if (!k || !ref.current?.contains(k)) return null;
    const r = k.getBoundingClientRect();
    // Más abajo en la tecla = más fuerte (como pulsar con más peso)
    const vel = 0.35 + 0.65 * Math.min(1, Math.max(0, (y - r.top) / r.height));
    return { midi: Number(k.dataset.midi), vel };
  };

  const onDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    e.preventDefault();
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    const k = keyAt(e.clientX, e.clientY);
    if (!k) return;
    pointers.current.set(e.pointerId, k.midi);
    input.noteOn(k.midi, k.vel);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!interactive || !pointers.current.has(e.pointerId)) return;
    const k = keyAt(e.clientX, e.clientY);
    const prev = pointers.current.get(e.pointerId)!;
    if (!k || k.midi === prev) return;
    input.noteOff(prev);
    pointers.current.set(e.pointerId, k.midi);
    input.noteOn(k.midi, k.vel);
  };
  const onUp = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (prev === undefined) return;
    pointers.current.delete(e.pointerId);
    input.noteOff(prev);
  };

  return (
    <div
      ref={ref}
      className={`piano ${compact ? 'compact' : ''} ${interactive ? 'interactive' : ''}`}
      style={{ height }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {keys.map((k) => {
        const hl = highlights[k.midi];
        const pressed = !!active[k.midi];
        const isC = k.midi % 12 === 0;
        const label = labels?.[k.midi];
        return (
          <div
            key={k.midi}
            data-midi={k.midi}
            className={`key ${k.black ? 'black' : 'white'} ${pressed ? 'pressed' : ''} ${hl ? `hl-${hl}` : ''}`}
            style={{ left: `${k.left * 100}%`, width: `${k.width * 100}%` }}
          >
            {label && <span className="key-custom">{label}</span>}
            {!compact && pcLabels[k.midi] && <span className="key-pc">{pcLabels[k.midi]}</span>}
            {labelsOn && (!k.black || !compact) && (
              <span className={`key-name ${isC ? 'is-c' : ''}`}>
                {k.black ? midiToName(k.midi, ui.naming, false) : midiToName(k.midi, ui.naming, isC)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const Piano = memo(PianoImpl);
