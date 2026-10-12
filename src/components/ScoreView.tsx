import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { diatonicStep, parseNote, type Naming } from '../lib/music';
import type { Hand, NoteEvent } from '../lib/notation';

interface Props {
  events: NoteEvent[];
  timeSignature: [number, number];
  getBeat: () => number;
  onSeek?: (beat: number) => void;
  naming: Naming;
}

const GAP = 8; // distancia entre líneas del pentagrama
const STAFF_H = GAP * 4;
const TREBLE_BOTTOM = 4 * 7 + 2; // Mi4
const BASS_BOTTOM = 2 * 7 + 4; // Sol2
const SYS_TOP = 34; // espacio superior (líneas adicionales)
const STAVES_GAP = 64; // separación entre clave de Sol y de Fa
const SYS_H = SYS_TOP + STAFF_H + STAVES_GAP + STAFF_H + 40;
const CLEF_W = 46;
const MIN_BAR_W = 190;

interface Glyph {
  hand: Hand;
  time: number;
  duration: number;
  x: number;
  notes: { step: number; acc: number; midi: number }[];
}

function durKind(d: number): { head: 'whole' | 'half' | 'filled'; flags: number; dot: boolean } {
  if (d >= 3.5) return { head: 'whole', flags: 0, dot: false };
  if (d >= 1.75) return { head: 'half', flags: 0, dot: d >= 2.75 };
  if (d >= 0.875) return { head: 'filled', flags: 0, dot: d >= 1.4 };
  if (d >= 0.3) return { head: 'filled', flags: 1, dot: d >= 0.7 };
  return { head: 'filled', flags: 2, dot: false };
}

/** Partitura en gran pentagrama, dibujada a partir de los eventos (espaciado proporcional al tiempo). */
function ScoreViewImpl({ events, timeSignature, getBeat, onSeek }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [beat, setBeat] = useState(0);
  const lastSystem = useRef(-1);

  useEffect(() => {
    const el = wrap.current!;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Cursor a ~20 fps
  const getBeatRef = useRef(getBeat);
  getBeatRef.current = getBeat;
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 50) return;
      last = t;
      setBeat(getBeatRef.current());
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const barLen = timeSignature[0] * (4 / timeSignature[1]);
  const length = events.reduce((m, e) => Math.max(m, e.time + e.duration), 0);
  const bars = Math.max(1, Math.ceil((length - 0.01) / barLen));
  const perSystem = Math.max(1, Math.floor((width - CLEF_W - 10) / MIN_BAR_W));
  const barW = (width - CLEF_W - 10) / perSystem;
  const systems = Math.ceil(bars / perSystem);

  const xFor = (time: number) => {
    const bar = Math.min(bars - 1, Math.floor(time / barLen + 1e-6));
    const inBar = (time - bar * barLen) / barLen;
    return { system: Math.floor(bar / perSystem), x: CLEF_W + (bar % perSystem) * barW + 14 + inBar * (barW - 24) };
  };

  // Agrupa notas simultáneas de la misma mano en acordes
  const glyphs = useMemo(() => {
    const map = new Map<string, Glyph & { system: number }>();
    for (const e of events) {
      const key = `${e.hand}:${Math.round(e.time * 96)}`;
      let g = map.get(key);
      if (!g) {
        const { system, x } = xFor(e.time);
        g = { hand: e.hand, time: e.time, duration: e.duration, x, system, notes: [] };
        map.set(key, g);
      }
      let p;
      try {
        p = parseNote(e.name);
      } catch {
        continue;
      }
      g.duration = Math.max(g.duration, e.duration);
      g.notes.push({ step: diatonicStep(p), acc: p.accidental, midi: e.midi });
    }
    return [...map.values()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, width, barLen]);

  const staffTop = (hand: Hand) => (hand === 'R' ? SYS_TOP : SYS_TOP + STAFF_H + STAVES_GAP);
  const yFor = (hand: Hand, step: number) =>
    staffTop(hand) + STAFF_H - ((step - (hand === 'R' ? TREBLE_BOTTOM : BASS_BOTTOM)) * GAP) / 2;

  // Parte estática (se recalcula solo si cambian los datos o el ancho)
  const staticSvg = useMemo(() => {
    const parts: React.ReactNode[] = [];
    for (let s = 0; s < systems; s++) {
      const oy = s * SYS_H;
      const firstBar = s * perSystem;
      const barsHere = Math.min(perSystem, bars - firstBar);
      const right = CLEF_W + barsHere * barW;
      for (const hand of ['R', 'L'] as Hand[]) {
        const top = oy + staffTop(hand);
        for (let i = 0; i < 5; i++) parts.push(<line key={`l${s}${hand}${i}`} x1={6} x2={right} y1={top + i * GAP} y2={top + i * GAP} className="sl" />);
        parts.push(
          <text key={`c${s}${hand}`} x={10} y={hand === 'R' ? top + GAP * 3.3 : top + GAP * 2.9} className="sc" fontSize={hand === 'R' ? 38 : 28}>
            {hand === 'R' ? '𝄞' : '𝄢'}
          </text>,
        );
        if (s === 0)
          parts.push(
            <g key={`ts${hand}`} className="sts">
              <text x={36} y={top + GAP * 1.9}>
                {timeSignature[0]}
              </text>
              <text x={36} y={top + GAP * 3.9}>
                {timeSignature[1]}
              </text>
            </g>,
          );
      }
      const top = oy + SYS_TOP;
      const bottom = oy + SYS_TOP + STAFF_H * 2 + STAVES_GAP;
      parts.push(<line key={`sys${s}`} x1={6} x2={6} y1={top} y2={bottom} className="sb" />);
      for (let b = 0; b <= barsHere; b++) {
        const x = CLEF_W + b * barW;
        parts.push(<line key={`b${s}-${b}`} x1={x} x2={x} y1={top} y2={bottom} className={b === barsHere && firstBar + b === bars ? 'sb end' : 'sb'} />);
        if (b < barsHere)
          parts.push(
            <text key={`n${s}-${b}`} x={x + 3} y={top - 6} className="sn">
              {firstBar + b + 1}
            </text>,
          );
      }
    }
    for (const [gi, g] of glyphs.entries()) {
      const oy = (g as Glyph & { system: number }).system * SYS_H;
      const kind = durKind(g.duration);
      const ys = g.notes.map((n) => oy + yFor(g.hand, n.step));
      const bottomStep = g.hand === 'R' ? TREBLE_BOTTOM : BASS_BOTTOM;
      const mid = oy + staffTop(g.hand) + GAP * 2;
      const avg = ys.reduce((a, b) => a + b, 0) / ys.length;
      const up = avg > mid;
      g.notes.forEach((n, i) => {
        const y = ys[i];
        for (let s = bottomStep - 2; s >= n.step; s -= 2) {
          const ly = oy + yFor(g.hand, s);
          parts.push(<line key={`lg${gi}-${i}-${s}`} x1={g.x - 8} x2={g.x + 8} y1={ly} y2={ly} className="sl" />);
        }
        for (let s = bottomStep + 10; s <= n.step; s += 2) {
          const ly = oy + yFor(g.hand, s);
          parts.push(<line key={`lu${gi}-${i}-${s}`} x1={g.x - 8} x2={g.x + 8} y1={ly} y2={ly} className="sl" />);
        }
        parts.push(
          <ellipse
            key={`h${gi}-${i}`}
            cx={g.x}
            cy={y}
            rx={5.2}
            ry={3.8}
            transform={`rotate(-20 ${g.x} ${y})`}
            className={kind.head === 'filled' ? 'sh' : 'sh open'}
          />,
        );
        if (n.acc)
          parts.push(
            <text key={`a${gi}-${i}`} x={g.x - 15} y={y + 4} className="sa">
              {n.acc === 1 ? '♯' : n.acc === -1 ? '♭' : n.acc === 2 ? '𝄪' : '𝄫'}
            </text>,
          );
        if (kind.dot) parts.push(<circle key={`d${gi}-${i}`} cx={g.x + 9} cy={y - 2} r={1.6} className="sd" />);
      });
      if (kind.head !== 'whole') {
        const top = Math.min(...ys);
        const bot = Math.max(...ys);
        const sx = up ? g.x + 4.8 : g.x - 4.8;
        const y1 = up ? bot : top;
        const y2 = up ? top - GAP * 3.4 : bot + GAP * 3.4;
        parts.push(<line key={`st${gi}`} x1={sx} x2={sx} y1={y1} y2={y2} className="sst" />);
        for (let f = 0; f < kind.flags; f++) {
          const fy = y2 + (up ? f * 6 : -f * 6);
          parts.push(<path key={`f${gi}-${f}`} d={`M${sx} ${fy} q 7 ${up ? 5 : -5} 6 ${up ? 13 : -13}`} className="sf" />);
        }
      }
    }
    return parts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glyphs, systems, perSystem, barW, bars, timeSignature]);

  // Parte dinámica: cursor y notas sonando
  const cur = xFor(Math.min(beat, Math.max(0, length - 0.001)));
  const active = glyphs.filter((g) => g.time <= beat + 0.02 && beat < g.time + g.duration);

  useEffect(() => {
    if (cur.system === lastSystem.current) return;
    lastSystem.current = cur.system;
    const el = wrap.current;
    if (!el) return;
    el.scrollTo({ top: Math.max(0, cur.system * SYS_H - 10), behavior: 'smooth' });
  }, [cur.system]);

  return (
    <div className="score-scroll" ref={wrap}>
      <svg
        className="score-svg"
        width={width}
        height={systems * SYS_H}
        onClick={(e) => {
          if (!onSeek) return;
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          const sys = Math.floor(y / SYS_H);
          const barInSys = Math.floor((x - CLEF_W) / barW);
          if (barInSys < 0 || barInSys >= perSystem) return;
          const bar = sys * perSystem + barInSys;
          if (bar < bars) onSeek(bar * barLen);
        }}
      >
        {staticSvg}
        {active.map((g, i) =>
          g.notes.map((n, j) => {
            const y = (g as Glyph & { system: number }).system * SYS_H + yFor(g.hand, n.step);
            return <ellipse key={`act${i}-${j}`} cx={g.x} cy={y} rx={6.5} ry={5} transform={`rotate(-20 ${g.x} ${y})`} className={`sh-act ${g.hand}`} />;
          }),
        )}
        <rect x={cur.x - 1.5} y={cur.system * SYS_H + SYS_TOP - 14} width={3} height={STAFF_H * 2 + STAVES_GAP + 28} rx={1.5} className="score-cursor" />
      </svg>
    </div>
  );
}

export const ScoreView = memo(ScoreViewImpl);
