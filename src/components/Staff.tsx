import { diatonicStep, parseNote, spellName, type Naming } from '../lib/music';

interface Props {
  /** Cada elemento es una nota ("E4") o un acorde ("C4+E4+G4") */
  items: string[];
  clef?: 'treble' | 'bass' | 'grand';
  current?: number;
  done?: number;
  naming?: Naming;
  showNames?: boolean;
}

const GAP = 10; // distancia entre líneas
const TREBLE_BOTTOM = 4 * 7 + 2; // Mi4
const BASS_BOTTOM = 2 * 7 + 4; // Sol2

/** Pentagrama simple en SVG: claves, líneas adicionales, alteraciones y acordes. */
export function Staff({ items, clef = 'treble', current = -1, done = -1, naming = 'latin', showNames = true }: Props) {
  const grand = clef === 'grand';
  const longest = Math.max(1, ...items.map((it) => it.split('+').map((n) => spellName(n, naming, false)).join(' ').length));
  const noteSpacing = Math.max(46, showNames ? longest * 7 + 14 : 46);
  const left = 64;
  const width = Math.max(260, left + items.length * noteSpacing + 30);
  const trebleTop = 40;
  const bassTop = grand ? trebleTop + GAP * 4 + 70 : trebleTop;
  const height = (grand ? bassTop : trebleTop) + GAP * 4 + 70;

  const staffY = (step: number, which: 'treble' | 'bass') => {
    const top = which === 'treble' ? trebleTop : bassTop;
    const bottomLineY = top + GAP * 4;
    const bottom = which === 'treble' ? TREBLE_BOTTOM : BASS_BOTTOM;
    return bottomLineY - ((step - bottom) * GAP) / 2;
  };

  const staves: ('treble' | 'bass')[] = grand ? ['treble', 'bass'] : [clef as 'treble' | 'bass'];

  return (
    <svg className="staff" viewBox={`0 0 ${width} ${height}`} width="100%" style={{ maxWidth: width }}>
      {staves.map((which) => {
        const top = which === 'treble' ? trebleTop : bassTop;
        return (
          <g key={which}>
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={8} x2={width - 8} y1={top + i * GAP} y2={top + i * GAP} className="staff-line" />
            ))}
            <text
              x={12}
              y={which === 'treble' ? top + GAP * 3.35 : top + GAP * 2.9}
              className="clef"
              fontSize={which === 'treble' ? 46 : 34}
            >
              {which === 'treble' ? '𝄞' : '𝄢'}
            </text>
          </g>
        );
      })}
      {grand && <line x1={8} x2={8} y1={trebleTop} y2={bassTop + GAP * 4} className="staff-line" />}
      {items.map((item, i) => {
        const x = left + i * noteSpacing + 20;
        const notes = item.split('+').map((n) => parseNote(n));
        const cls = i === current ? 'note current' : i <= done ? 'note done' : 'note';
        return (
          <g key={i} className={cls}>
            {notes.map((p, j) => {
              const which: 'treble' | 'bass' = grand ? (p.midi >= 60 ? 'treble' : 'bass') : (clef as 'treble' | 'bass');
              const step = diatonicStep(p);
              const y = staffY(step, which);
              const bottom = which === 'treble' ? TREBLE_BOTTOM : BASS_BOTTOM;
              const ledgers: number[] = [];
              for (let s = bottom - 2; s >= step; s -= 2) ledgers.push(staffY(s, which));
              for (let s = bottom + 10; s <= step; s += 2) ledgers.push(staffY(s, which));
              const acc = p.accidental === 1 ? '♯' : p.accidental === -1 ? '♭' : p.accidental === 2 ? '𝄪' : p.accidental === -2 ? '𝄫' : '';
              return (
                <g key={j}>
                  {ledgers.map((ly, k) => (
                    <line key={k} x1={x - 11} x2={x + 11} y1={ly} y2={ly} className="staff-line" />
                  ))}
                  <ellipse cx={x} cy={y} rx={6.6} ry={4.8} transform={`rotate(-20 ${x} ${y})`} className="notehead" />
                  {acc && (
                    <text x={x - 19} y={y + 5} className="accidental" fontSize={15}>
                      {acc}
                    </text>
                  )}
                </g>
              );
            })}
            {showNames && (
              <text x={x} y={height - 10} textAnchor="middle" className="note-label">
                {item
                  .split('+')
                  .map((n) => spellName(n, naming, false))
                  .join(' ')}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
