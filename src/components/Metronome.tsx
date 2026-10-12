import { useRef, useState } from 'react';
import { metronome } from '../audio/engine';
import { useApp, useLive } from '../state/store';
import { NumberField, Select, Slider, Toggle } from './Controls';
import { useOutsideClose } from './useOutsideClose';
import { Icon } from './Icon';

const SIGNATURES = ['2/4', '3/4', '4/4', '5/4', '6/8', '7/8', '9/8', '12/8'];

function tempoName(bpm: number) {
  if (bpm < 60) return 'Largo';
  if (bpm < 76) return 'Adagio';
  if (bpm < 108) return 'Andante';
  if (bpm < 120) return 'Moderato';
  if (bpm < 168) return 'Allegro';
  return 'Presto';
}

export function Metronome() {
  const m = useApp((s) => s.metronome);
  const setM = useApp((s) => s.setMetronome);
  const on = useLive((s) => s.metronomeOn);
  const beat = useLive((s) => s.beat);
  const [open, setOpen] = useState(false);
  const taps = useRef<number[]>([]);
  const root = useOutsideClose<HTMLDivElement>(open, () => setOpen(false));

  const tap = () => {
    const now = performance.now();
    taps.current = [...taps.current.filter((t) => now - t < 2500), now];
    if (taps.current.length >= 2) {
      const diffs = taps.current.slice(1).map((t, i) => t - taps.current[i]);
      const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      setM({ bpm: Math.max(20, Math.min(300, Math.round(60000 / avg))) });
    }
  };

  return (
    <div className="metronome" ref={root}>
      <button className={`metro-play ${on ? 'on' : ''}`} onClick={() => metronome.toggle()} title="Metrónomo">
        <Icon name={on ? 'stop' : 'play'} size={13} filled />
      </button>
      <div className="metro-beats">
        {Array.from({ length: m.beatsPerBar }, (_, i) => (
          <span key={i} className={`metro-dot ${on && beat === i ? 'lit' : ''} ${i === 0 && m.accent ? 'accent' : ''}`} />
        ))}
      </div>
      <NumberField value={m.bpm} min={20} max={300} onChange={(bpm) => setM({ bpm })} width={46} ariaLabel="BPM" />
      <span className="metro-label">
        BPM
        <br />
        {tempoName(m.bpm)}
      </span>
      <button className="btn ghost small" onClick={tap} title="Pulsa al ritmo para fijar el tempo">
        Tap
      </button>
      <button className={`btn ghost small ${open ? 'active' : ''}`} onClick={() => setOpen((o) => !o)}>
        {m.beatsPerBar}/{m.beatUnit} <Icon name="gear" size={14} />
      </button>
      {open && (
        <div className="metro-pop">
          <div className="pop-grid">
            <span>Compás</span>
            <Select
              value={`${m.beatsPerBar}/${m.beatUnit}`}
              options={SIGNATURES.map((s) => ({ value: s, label: s }))}
              onChange={(v) => {
                const [a, b] = v.split('/').map(Number);
                setM({ beatsPerBar: a, beatUnit: b });
              }}
            />
            <span>Subdivisión</span>
            <Select
              value={m.subdivision}
              options={[
                { value: 1, label: 'Negras', hint: '1 por pulso' },
                { value: 2, label: 'Corcheas', hint: '2 por pulso' },
                { value: 3, label: 'Tresillos', hint: '3 por pulso' },
                { value: 4, label: 'Semicorcheas', hint: '4 por pulso' },
              ]}
              onChange={(subdivision) => setM({ subdivision: subdivision as 1 | 2 | 3 | 4 })}
            />
            <span>Sonido</span>
            <Select
              value={m.sound}
              options={[
                { value: 'click', label: 'Clic' },
                { value: 'wood', label: 'Madera' },
                { value: 'beep', label: 'Bip' },
              ]}
              onChange={(sound) => setM({ sound })}
            />
          </div>
          <Slider label="Tempo" value={m.bpm} min={20} max={300} step={1} unit=" BPM" onChange={(bpm) => setM({ bpm })} />
          <Slider label="Volumen" value={m.volume} min={-40} max={0} step={1} unit=" dB" onChange={(volume) => setM({ volume })} />
          <Toggle label="Acentuar el primer tiempo" checked={m.accent} onChange={(accent) => setM({ accent })} />
        </div>
      )}
    </div>
  );
}
