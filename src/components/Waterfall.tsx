import { useEffect, useMemo, useRef } from 'react';
import { layoutKeys } from '../lib/keyboard';
import { midiToName, type Naming } from '../lib/music';
import type { Hand, NoteEvent } from '../lib/notation';

interface Props {
  events: NoteEvent[];
  low: number;
  high: number;
  getBeat: () => number;
  secondsPerBeat: number;
  beatsPerBar: number;
  height?: number;
  naming: Naming;
  /** Manos que el usuario debe tocar (se dibujan con borde brillante) */
  userHands?: Hand[];
  windowSeconds?: number;
}

const COLORS: Record<Hand, [string, string]> = {
  R: ['#6f9ccb', '#2d5880'],
  L: ['#dc9a62', '#8f5226'],
};

/** Cascada de notas tipo "piano roll" que cae hacia el teclado. */
export function Waterfall({
  events,
  low,
  high,
  getBeat,
  secondsPerBeat,
  beatsPerBar,
  height = 300,
  naming,
  userHands = [],
  windowSeconds = 3.5,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const keys = useMemo(() => layoutKeys(low, high), [low, high]);
  const geom = useMemo(() => new Map(keys.map((k) => [k.midi, k])), [keys]);
  const props = useRef({ events, getBeat, secondsPerBeat, beatsPerBar, naming, userHands, windowSeconds });
  props.current = { events, getBeat, secondsPerBeat, beatsPerBar, naming, userHands, windowSeconds };

  useEffect(() => {
    let raf = 0;
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const p = props.current;
      const now = p.getBeat();
      const beatsVisible = p.windowSeconds / p.secondsPerBeat;
      const pxPerBeat = h / beatsVisible;

      // Guías de las teclas negras / Do
      for (const k of keys) {
        if (!k.black && k.midi % 12 === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.05)';
          ctx.fillRect(k.left * w, 0, 1, h);
        }
      }
      // Líneas de compás y de pulso
      for (let b = Math.floor(now); b < now + beatsVisible + 1; b++) {
        ctx.fillStyle = 'rgba(148,163,184,0.08)';
        ctx.fillRect(0, h - (b - now) * pxPerBeat, w, 1);
      }
      const bar = p.beatsPerBar;
      for (let k = Math.max(0, Math.floor(now / bar)); k * bar < now + beatsVisible + 1; k++) {
        const y = h - (k * bar - now) * pxPerBeat;
        ctx.fillStyle = 'rgba(148,163,184,0.28)';
        ctx.fillRect(0, y, w, 1.5);
        ctx.fillStyle = 'rgba(148,163,184,0.5)';
        ctx.font = '10px ui-monospace, monospace';
        ctx.fillText(String(k + 1), 4, y - 3);
      }

      for (const e of p.events) {
        if (e.time > now + beatsVisible) break;
        if (e.time + e.duration < now - 0.05) continue;
        const g = geom.get(e.midi);
        if (!g) continue;
        const y1 = h - (e.time - now) * pxPerBeat;
        const y0 = h - (e.time + e.duration - now) * pxPerBeat;
        const x = g.left * w + 1;
        const bw = g.width * w - 2;
        const playing = e.time <= now && e.time + e.duration >= now;
        const [c1, c2] = COLORS[e.hand];
        const grad = ctx.createLinearGradient(0, y0, 0, y1);
        grad.addColorStop(0, c2);
        grad.addColorStop(1, c1);
        ctx.fillStyle = grad;
        ctx.shadowColor = c1;
        ctx.shadowBlur = playing ? 12 : 0;
        const r = Math.min(5, bw / 2);
        ctx.beginPath();
        ctx.roundRect(x, y0, bw, Math.max(4, y1 - y0), r);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (p.userHands.includes(e.hand)) {
          ctx.strokeStyle = '#f3e3c6';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        if (bw > 14 && y1 - y0 > 16) {
          ctx.fillStyle = 'rgba(2,6,23,0.85)';
          ctx.font = `600 ${Math.min(11, bw * 0.45)}px system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(midiToName(e.midi, p.naming, false), x + bw / 2, y1 - 5);
          ctx.textAlign = 'left';
        }
      }
      // Línea de impacto
      const lg = ctx.createLinearGradient(0, 0, w, 0);
      lg.addColorStop(0, 'rgba(176,122,67,0)');
      lg.addColorStop(0.5, 'rgba(208,160,104,0.85)');
      lg.addColorStop(1, 'rgba(176,122,67,0)');
      ctx.fillStyle = lg;
      ctx.fillRect(0, h - 2, w, 2);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [keys, geom]);

  return <canvas ref={canvas} className="waterfall" style={{ height }} />;
}
