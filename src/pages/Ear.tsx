import { useCallback, useEffect, useRef, useState } from 'react';
import { playSequence } from '../audio/player';
import { CHORDS, INTERVAL_NAMES, NOTE_NAMES_EN, NOTE_NAMES_LATIN, midiToName } from '../lib/music';
import { useApp } from '../state/store';
import { Piano, type Highlight } from '../components/Piano';
import { input } from '../audio/input';
import { Icon } from '../components/Icon';

type Mode = 'notes' | 'intervals' | 'chords' | 'melody';

const MODES: { id: Mode; name: string; desc: string }[] = [
  { id: 'notes', name: 'Notas', desc: 'Escucha el Do de referencia y luego una nota: ¿cuál es?' },
  { id: 'intervals', name: 'Intervalos', desc: 'Dos notas seguidas: identifica la distancia.' },
  { id: 'chords', name: 'Acordes', desc: 'Identifica la calidad del acorde.' },
  { id: 'melody', name: 'Dictado melódico', desc: 'Escucha una melodía corta y tócala en el piano.' },
];

const CHORD_SET = ['maj', 'min', 'dim', 'aug', 'sus4', '7', 'maj7', 'm7'];
const rand = (n: number) => Math.floor(Math.random() * n);

interface Question {
  play: { midis: number[]; duration: number }[];
  answer: string;
  options: string[];
  reveal: number[];
}

function makeQuestion(mode: Mode, level: number): Question {
  if (mode === 'notes') {
    const pool = level === 0 ? [0, 2, 4, 5, 7, 9, 11] : Array.from({ length: 12 }, (_, i) => i);
    const pc = pool[rand(pool.length)];
    const midi = 60 + pc;
    return {
      play: [{ midis: [60], duration: 1 }, { midis: [], duration: 0.5 }, { midis: [midi], duration: 1.5 }],
      answer: String(pc),
      options: pool.map(String),
      reveal: [midi],
    };
  }
  if (mode === 'intervals') {
    const pool = level === 0 ? [2, 4, 5, 7, 12] : level === 1 ? [1, 2, 3, 4, 5, 7, 8, 9, 12] : Array.from({ length: 12 }, (_, i) => i + 1);
    const st = pool[rand(pool.length)];
    const root = 55 + rand(10);
    const harmonic = level === 2 && Math.random() < 0.5;
    return {
      play: harmonic ? [{ midis: [root, root + st], duration: 2 }] : [{ midis: [root], duration: 1 }, { midis: [root + st], duration: 1.5 }],
      answer: String(st),
      options: pool.map(String),
      reveal: [root, root + st],
    };
  }
  if (mode === 'chords') {
    const pool = level === 0 ? CHORD_SET.slice(0, 2) : level === 1 ? CHORD_SET.slice(0, 4) : CHORD_SET;
    const id = pool[rand(pool.length)];
    const f = CHORDS.find((c) => c.id === id)!;
    const root = 52 + rand(10);
    const notes = f.intervals.map((i) => root + i);
    return {
      play: [{ midis: notes, duration: 1.5 }, ...notes.map((m) => ({ midis: [m], duration: 0.5 })), { midis: notes, duration: 1.5 }],
      answer: id,
      options: pool,
      reveal: notes,
    };
  }
  // Dictado melódico: 3–6 notas de Do mayor en posición de Do
  const len = 3 + level + rand(2);
  const scale = [60, 62, 64, 65, 67, 69, 71, 72];
  const notes: number[] = [60];
  for (let i = 1; i < len; i++) {
    const prev = scale.indexOf(notes[i - 1]);
    const step = [-2, -1, 1, 2][rand(4)];
    notes.push(scale[Math.max(0, Math.min(scale.length - 1, prev + step))]);
  }
  return { play: notes.map((m) => ({ midis: [m], duration: 1 })), answer: notes.join(','), options: [], reveal: notes };
}

export function Ear() {
  const naming = useApp((s) => s.ui.naming);
  const ear = useApp((s) => s.progress.ear);
  const addEarResult = useApp((s) => s.addEarResult);
  const [mode, setMode] = useState<Mode>('notes');
  const [level, setLevel] = useState(0);
  const [q, setQ] = useState<Question>(() => makeQuestion('notes', 0));
  const [result, setResult] = useState<null | { ok: boolean; picked: string }>(null);
  const [streak, setStreak] = useState(0);
  const [session, setSession] = useState({ ok: 0, total: 0 });
  const [typed, setTyped] = useState<number[]>([]);
  const stop = useRef<() => void>(() => {});

  const play = useCallback((question: Question) => {
    stop.current();
    stop.current = playSequence(question.play, 80);
  }, []);

  const next = useCallback(
    (m = mode, l = level) => {
      const nq = makeQuestion(m, l);
      setQ(nq);
      setResult(null);
      setTyped([]);
      setTimeout(() => play(nq), 150);
    },
    [mode, level, play],
  );

  useEffect(() => () => stop.current(), []);

  const answer = (opt: string) => {
    if (result) return;
    const ok = opt === q.answer;
    setResult({ ok, picked: opt });
    addEarResult(ok);
    setStreak((s) => (ok ? s + 1 : 0));
    setSession((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
  };

  // Dictado: escucha lo que tocas
  useEffect(() => {
    if (mode !== 'melody') return;
    return input.subscribe((e) => {
      if (e.type !== 'on' || result) return;
      setTyped((t) => {
        const nt = [...t, e.midi];
        const target = q.answer.split(',').map(Number);
        if (nt.length >= target.length) {
          const ok = nt.slice(0, target.length).every((m, i) => m === target[i]);
          setResult({ ok, picked: nt.join(',') });
          addEarResult(ok);
          setStreak((s) => (ok ? s + 1 : 0));
          setSession((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
        }
        return nt;
      });
    });
  }, [mode, q, result, addEarResult]);

  const label = (opt: string) => {
    if (mode === 'notes') return (naming === 'latin' ? NOTE_NAMES_LATIN : NOTE_NAMES_EN)[Number(opt)];
    if (mode === 'intervals') return INTERVAL_NAMES.find((i) => i.semitones === Number(opt))?.name ?? opt;
    return CHORDS.find((c) => c.id === opt)?.name ?? opt;
  };

  const highlights: Record<number, Highlight> = {};
  if (result) q.reveal.forEach((m) => (highlights[m] = result.ok ? 'ok' : 'scale'));
  if (mode === 'melody') typed.forEach((m) => (highlights[m] = highlights[m] ?? 'demo'));

  return (
    <div className="page ear">
      <div className="ear-head">
        <div className="tabs">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`tab ${mode === m.id ? 'active' : ''}`}
              onClick={() => {
                setMode(m.id);
                next(m.id, level);
              }}
            >
              {m.name}
            </button>
          ))}
        </div>
        <div className="chip-row">
          {['Fácil', 'Medio', 'Difícil'].map((n, i) => (
            <button
              key={n}
              className={`chip ${level === i ? 'on' : ''}`}
              onClick={() => {
                setLevel(i);
                next(mode, i);
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="ear-card">
        <p className="muted">{MODES.find((m) => m.id === mode)!.desc}</p>
        <div className="ear-stats">
          <span>
            Sesión: <b>{session.ok}</b>/{session.total}
          </span>
          <span>
            Racha: <b>{streak}</b>
          </span>
          <span>
            Total histórico: {ear.correct}/{ear.total} ({ear.total ? Math.round((ear.correct / ear.total) * 100) : 0}%)
          </span>
        </div>
        <div className="ear-actions">
          <button className="btn primary big" onClick={() => play(q)}>
            <Icon name="speaker" size={17} /> {result ? 'Escuchar otra vez' : 'Escuchar'}
          </button>
          {mode === 'notes' && (
            <button className="btn" onClick={() => playSequence([{ midis: [60], duration: 1 }], 80)}>
              Referencia: {naming === 'latin' ? 'Do4' : 'C4'}
            </button>
          )}
          <button className="btn" onClick={() => next()}>
            Siguiente <Icon name="chevronRight" size={15} />
          </button>
        </div>

        {mode !== 'melody' ? (
          <div className="answers">
            {q.options.map((o) => (
              <button
                key={o}
                className={`answer ${result && o === q.answer ? 'right' : ''} ${result && !result.ok && o === result.picked ? 'bad' : ''}`}
                onClick={() => answer(o)}
              >
                {label(o)}
              </button>
            ))}
          </div>
        ) : (
          <p className="dictation">
            Tus notas: <b>{typed.map((m) => midiToName(m, naming)).join(' · ') || '…'}</b> ({typed.length}/{q.reveal.length}). La primera nota es siempre{' '}
            {naming === 'latin' ? 'Do4' : 'C4'}.
            {typed.length > 0 && !result && (
              <button className="btn small ghost" onClick={() => setTyped([])}>
                Borrar
              </button>
            )}
          </p>
        )}

        {result && (
          <div className={`ear-result ${result.ok ? 'ok' : 'bad'}`}>
            {result.ok
              ? 'Correcto.'
              : mode === 'melody'
                ? `Era: ${q.reveal.map((m) => midiToName(m, naming)).join(' · ')}`
                : `Era: ${label(q.answer)}`}
          </div>
        )}
      </div>
      <Piano low={48} high={84} highlights={highlights} height={170} />
    </div>
  );
}
