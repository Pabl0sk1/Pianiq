import { useState } from 'react';
import { CHORDS, SCALES, NOTE_NAMES_EN, NOTE_NAMES_LATIN, buildFromRoot, midiToName, INTERVAL_NAMES, type Formula } from '../lib/music';
import { useApp } from '../state/store';
import { Piano, type Highlight } from '../components/Piano';
import { playSequence } from '../audio/player';
import { Icon } from '../components/Icon';

const DEGREE = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
const degreeLabel = (i: number) => (i >= 12 ? { 13: 'b9', 14: '9', 15: '#9', 17: '11', 18: '#11', 21: '13' }[i] ?? String(i) : DEGREE[i]);

export function Dictionary() {
  const naming = useApp((s) => s.ui.naming);
  const [kind, setKind] = useState<'chord' | 'scale'>('chord');
  const [root, setRoot] = useState(0);
  const [formulaId, setFormulaId] = useState('maj');
  const [inversion, setInversion] = useState(0);
  const list: Formula[] = kind === 'chord' ? CHORDS : SCALES;
  const formula = list.find((f) => f.id === formulaId) ?? list[0];
  const names = naming === 'latin' ? NOTE_NAMES_LATIN : NOTE_NAMES_EN;

  const base = kind === 'chord' ? 48 + root : 60 + root;
  let pairs = formula.intervals.map((iv) => ({ midi: base + iv, iv }));
  if (kind === 'chord') {
    const inv = inversion % pairs.length;
    pairs = [...pairs.slice(inv), ...pairs.slice(0, inv).map((p) => ({ ...p, midi: p.midi + 12 }))];
  } else pairs = [...pairs, { midi: base + 12, iv: 0 }];
  const notes = pairs.map((p) => p.midi);

  const hl: Record<number, Highlight> = {};
  const labels: Record<number, string> = {};
  for (const p of pairs) {
    hl[p.midi] = p.iv === 0 ? 'root' : 'scale';
    labels[p.midi] = degreeLabel(p.iv);
  }

  const play = (mode: 'block' | 'arp') => {
    if (kind === 'chord' && mode === 'block') playSequence([{ midis: notes, duration: 2.5 }], 80);
    else
      playSequence(
        [...notes, ...(kind === 'scale' ? [...notes].reverse().slice(1) : [])].map((m) => ({ midis: [m], duration: 0.5 })),
        kind === 'scale' ? 140 : 100,
      );
  };

  const symbol = (() => {
    const r = names[root];
    const map: Record<string, string> = { maj: '', min: 'm', dim: '°', aug: '+', '6': '6', m6: 'm6', maj7: 'maj7', '7': '7', m7: 'm7', mMaj7: 'm(maj7)', m7b5: 'm7b5', dim7: '°7' };
    return r + (map[formula.id] ?? formula.id);
  })();

  return (
    <div className="page dictionary">
      <div className="dict-controls">
        <div className="tabs">
          <button className={`tab ${kind === 'chord' ? 'active' : ''}`} onClick={() => { setKind('chord'); setFormulaId('maj'); setInversion(0); }}>
            Acordes
          </button>
          <button className={`tab ${kind === 'scale' ? 'active' : ''}`} onClick={() => { setKind('scale'); setFormulaId('major'); }}>
            Escalas y modos
          </button>
        </div>
        <div className="root-row">
          {names.map((n, i) => (
            <button key={n} className={`root ${root === i ? 'on' : ''} ${n.includes('#') ? 'sharp' : ''}`} onClick={() => setRoot(i)}>
              {n}
            </button>
          ))}
        </div>
        <div className="formula-grid">
          {list.map((f) => (
            <button key={f.id} className={`chip ${f.id === formula.id ? 'on' : ''}`} onClick={() => { setFormulaId(f.id); setInversion(0); }}>
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="dict-card">
        <div>
          <h1>{kind === 'chord' ? symbol : `${names[root]} ${formula.name}`}</h1>
          <p className="muted">{formula.description}</p>
          <p>
            <b>Notas:</b> {notes.map((m) => midiToName(m, naming, false)).join(' – ')}
          </p>
          <p>
            <b>Fórmula:</b> {formula.intervals.map(degreeLabel).join(' · ')}{' '}
            <span className="muted">
              ({formula.intervals.slice(1).map((iv, i) => iv - formula.intervals[i]).join('-')} semitonos entre notas)
            </span>
          </p>
          {kind === 'chord' && formula.intervals.length <= 4 && (
            <div className="chip-row">
              <span className="muted">Inversión:</span>
              {formula.intervals.map((_, i) => (
                <button key={i} className={`chip ${inversion === i ? 'on' : ''}`} onClick={() => setInversion(i)}>
                  {i === 0 ? 'Fundamental' : `${i}ª`}
                </button>
              ))}
            </div>
          )}
          {kind === 'chord' && (
            <p className="muted small">
              Intervalos desde la fundamental: {formula.intervals.slice(1).map((iv) => INTERVAL_NAMES.find((x) => x.semitones === iv % 12)?.short ?? iv).join(', ')}
            </p>
          )}
        </div>
        <div className="dict-actions">
          {kind === 'chord' && (
            <button className="btn primary" onClick={() => play('block')}>
              <Icon name="speaker" size={15} /> Acorde
            </button>
          )}
          <button className="btn" onClick={() => play('arp')}>
            <Icon name="speaker" size={15} /> {kind === 'chord' ? 'Arpegio' : 'Escala'}
          </button>
        </div>
      </div>
      <Piano low={kind === 'chord' ? 48 : 60} high={kind === 'chord' ? 83 : 95} highlights={hl} labels={labels} height={190} />
    </div>
  );
}
