import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ALL_LESSONS, LEVELS, findLesson, type Block } from '../data/lessons';
import { useApp } from '../state/store';
import { Staff } from '../components/Staff';
import { Piano, type Highlight } from '../components/Piano';
import { ExerciseRunner } from '../components/ExerciseRunner';
import { playSequence } from '../audio/player';
import { parseSteps } from '../lib/notation';
import { noteToMidi } from '../lib/music';
import { fitRange } from '../lib/keyboard';
import { Icon } from '../components/Icon';

/** Texto con **negritas** */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => (p.startsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}

function ListenButton({ label, notes, bpm }: { label: string; notes: string; bpm?: number }) {
  const [playing, setPlaying] = useState(false);
  const stop = useRef<() => void>(() => {});
  useEffect(() => () => stop.current(), []);
  return (
    <button
      className={`listen ${playing ? 'on' : ''}`}
      onClick={() => {
        if (playing) {
          stop.current();
          return;
        }
        stop.current = playSequence(parseSteps(notes), bpm ?? 90, (i) => setPlaying(i >= 0));
        setPlaying(true);
      }}
    >
      <span className="listen-icon">
        <Icon name={playing ? 'stop' : 'play'} size={12} filled />
      </span>{' '}
      {label}
    </button>
  );
}

function KeysBlock({ notes, labels, low, high }: { notes: string[]; labels?: Record<string, string>; low?: string; high?: string }) {
  const midis = notes.map(noteToMidi);
  const [lo, hi] = low && high ? [noteToMidi(low), noteToMidi(high)] : fitRange(midis, 1);
  const hl: Record<number, Highlight> = {};
  midis.forEach((m) => (hl[m] = 'scale'));
  const lb: Record<number, string> = {};
  if (labels) for (const [n, l] of Object.entries(labels)) lb[noteToMidi(n)] = l;
  return (
    <div className="keys-block">
      <Piano low={lo} high={hi} highlights={hl} labels={lb} height={110} compact showComputerKeys={false} />
    </div>
  );
}

function BlockView({ b }: { b: Block }): ReactNode {
  const naming = useApp((s) => s.ui.naming);
  switch (b.t) {
    case 'p':
      return (
        <p>
          <Rich text={b.text} />
        </p>
      );
    case 'h':
      return <h3>{b.text}</h3>;
    case 'list': {
      const items = b.items.map((it, i) => (
        <li key={i}>
          <Rich text={it} />
        </li>
      ));
      return b.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case 'tip':
      return (
        <div className="callout tip">
          <span className="callout-label">Consejo</span>
          <p>
            <Rich text={b.text} />
          </p>
        </div>
      );
    case 'warn':
      return (
        <div className="callout warn">
          <span className="callout-label">Atención</span>
          <p>
            <Rich text={b.text} />
          </p>
        </div>
      );
    case 'table':
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {b.head.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>
                      <Rich text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'staff':
      return (
        <div className="staff-wrap">
          <Staff items={b.items} clef={b.clef} naming={naming} />
        </div>
      );
    case 'keys':
      return <KeysBlock notes={b.notes} labels={b.labels} low={b.low} high={b.high} />;
    case 'listen':
      return <ListenButton label={b.label} notes={b.notes} bpm={b.bpm} />;
  }
}

export function Learn() {
  const progress = useApp((s) => s.progress);
  const markLesson = useApp((s) => s.markLesson);
  const resetProgress = useApp((s) => s.resetProgress);
  const [lessonId, setLessonId] = useState<string>(() => localStorage.getItem('piano-pro-lesson') ?? ALL_LESSONS[0].lesson.id);
  const [exIndex, setExIndex] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  const ref = findLesson(lessonId) ?? ALL_LESSONS[0];
  const { lesson, module, level, index } = ref;

  useEffect(() => {
    localStorage.setItem('piano-pro-lesson', lesson.id);
    setExIndex(0);
    document.querySelector('.content')?.scrollTo({ top: 0 });
  }, [lesson.id]);

  const total = ALL_LESSONS.length;
  const completed = ALL_LESSONS.filter((r) => progress.completed[r.lesson.id]).length;
  const levelStats = useMemo(
    () =>
      LEVELS.map((lv) => {
        const ls = lv.modules.flatMap((m) => m.lessons);
        return { done: ls.filter((l) => progress.completed[l.id]).length, total: ls.length };
      }),
    [progress.completed],
  );

  const prev = ALL_LESSONS[index - 1];
  const next = ALL_LESSONS[index + 1];
  const isDone = !!progress.completed[lesson.id];
  const exercises = lesson.exercises ?? [];

  return (
    <div className="page learn">
      <aside className="curriculum">
        <div className="curriculum-head">
          <h2>Curso de piano</h2>
          <div className="progress big">
            <div className="progress-bar" style={{ width: `${(completed / total) * 100}%` }} />
          </div>
          <span className="muted">
            {completed} de {total} lecciones completadas
          </span>
        </div>
        {LEVELS.map((lv, li) => (
          <details key={lv.id} open={lv.id === level.id} className="level" style={{ '--accent-level': lv.color } as React.CSSProperties}>
            <summary>
              <span className="level-title">{lv.title}</span>
              <span className="level-count">
                {levelStats[li].done}/{levelStats[li].total}
              </span>
            </summary>
            {lv.modules.map((m) => (
              <div key={m.id} className="module">
                <div className="module-title">{m.title}</div>
                {m.lessons.map((l) => (
                  <button key={l.id} className={`lesson-link ${l.id === lesson.id ? 'active' : ''}`} onClick={() => setLessonId(l.id)}>
                    <span className={`check ${progress.completed[l.id] ? 'done' : ''}`}>{progress.completed[l.id] && <Icon name="check" size={10} />}</span>
                    {l.title}
                  </button>
                ))}
              </div>
            ))}
          </details>
        ))}
        <button
          className="btn ghost small"
          onClick={() => {
            if (confirm('¿Borrar todo tu progreso del curso?')) resetProgress();
          }}
        >
          Reiniciar progreso
        </button>
      </aside>

      <main className="lesson" ref={mainRef}>
        <div className="breadcrumbs">
          {level.title} › {module.title}
        </div>
        <h1>{lesson.title}</h1>
        <div className="lesson-meta">
          <span>
            <Icon name="clock" size={14} /> {lesson.minutes} min
          </span>
          <span>
            Lección {index + 1} de {total}
          </span>
          {exercises.length > 0 && <span>
              <Icon name="keys" size={14} /> {exercises.length} ejercicio{exercises.length > 1 ? 's' : ''}
            </span>}
        </div>
        <div className="goals">
          <b>Objetivos</b>
          <ul>
            {lesson.goals.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
        <article className="lesson-body">
          {lesson.blocks.map((b, i) => (
            <BlockView key={`${lesson.id}-${i}`} b={b} />
          ))}
        </article>

        {exercises.length > 0 && (
          <section className="practice">
            <h2>Práctica</h2>
            <div className="tabs small">
              {exercises.map((e, i) => (
                <button key={i} className={`tab ${i === exIndex ? 'active' : ''}`} onClick={() => setExIndex(i)}>
                  {progress.exercises[`${lesson.id}-${i}`] && <Icon name="check" size={13} />}
                  {i + 1}. {e.title}
                </button>
              ))}
            </div>
            <ExerciseRunner key={`${lesson.id}-${exIndex}`} exercise={exercises[exIndex]} id={`${lesson.id}-${exIndex}`} />
          </section>
        )}

        <footer className="lesson-nav">
          <button className="btn ghost" disabled={!prev} onClick={() => prev && setLessonId(prev.lesson.id)}>
            <Icon name="chevronLeft" size={15} /> {prev?.lesson.title ?? 'Inicio'}
          </button>
          <button className={`btn ${isDone ? 'done' : 'primary'}`} onClick={() => markLesson(lesson.id, !isDone)}>
            {isDone ? 'Lección completada' : 'Marcar como completada'}
          </button>
          <button
            className="btn ghost"
            disabled={!next}
            onClick={() => {
              if (!isDone) markLesson(lesson.id, true);
              if (next) setLessonId(next.lesson.id);
            }}
          >
            {next?.lesson.title ?? 'Fin'} <Icon name="chevronRight" size={15} />
          </button>
        </footer>
      </main>
    </div>
  );
}
