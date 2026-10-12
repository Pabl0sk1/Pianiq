import { useEffect, useMemo, useRef, useState } from 'react';
import { input } from '../audio/input';
import { playSequence } from '../audio/player';
import { fitRange } from '../lib/keyboard';
import { parseSteps } from '../lib/notation';
import { spellName } from '../lib/music';
import { useApp } from '../state/store';
import { Piano, type Highlight } from './Piano';
import { Staff } from './Staff';
import type { Exercise } from '../data/lessons';
import { Icon } from './Icon';

interface Props {
  exercise: Exercise;
  id: string;
}

/** Ejercicio interactivo: resalta la siguiente nota/acorde y avanza cuando lo tocas. */
export function ExerciseRunner({ exercise, id }: Props) {
  const naming = useApp((s) => s.ui.naming);
  const done = useApp((s) => !!s.progress.exercises[id]);
  const markExercise = useApp((s) => s.markExercise);
  const steps = useMemo(() => parseSteps(exercise.steps), [exercise.steps]);
  const fingers = useMemo(() => exercise.fingers?.split(/\s+/) ?? [], [exercise.fingers]);
  const [low, high] = useMemo(() => fitRange(steps.flatMap((s) => s.midis), 2), [steps]);

  const [pos, setPos] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [demo, setDemo] = useState(-1);
  const [finished, setFinished] = useState(false);
  const pressed = useRef(new Set<number>());
  const stopDemo = useRef<() => void>(() => {});

  const reset = () => {
    setPos(0);
    setErrors(0);
    setFinished(false);
    pressed.current.clear();
  };
  useEffect(reset, [exercise]);

  useEffect(
    () =>
      input.subscribe((e) => {
        if (e.type !== 'on' || finished || demo >= 0) return;
        const step = steps[pos];
        if (!step) return;
        if (step.midis.includes(e.midi)) {
          pressed.current.add(e.midi);
          if (step.midis.every((m) => pressed.current.has(m))) {
            pressed.current.clear();
            const next = pos + 1;
            if (next >= steps.length) {
              setFinished(true);
              setPos(next);
              markExercise(id);
            } else setPos(next);
          }
        } else {
          setErrors((x) => x + 1);
          setWrong(e.midi);
          window.setTimeout(() => setWrong((w) => (w === e.midi ? null : w)), 350);
        }
      }),
    [steps, pos, finished, demo, id, markExercise],
  );

  // Un acorde se considera tocado si las notas se pulsan juntas: al soltar todas, se reinicia el conjunto.
  useEffect(
    () =>
      input.subscribe((e) => {
        if (e.type === 'off') pressed.current.delete(e.midi);
      }),
    [],
  );

  useEffect(() => () => stopDemo.current(), []);

  const listen = () => {
    stopDemo.current();
    stopDemo.current = playSequence(steps, exercise.bpm ?? 80, (i) => setDemo(i));
  };

  const highlights: Record<number, Highlight> = {};
  if (demo >= 0) steps[demo]?.midis.forEach((m) => (highlights[m] = 'demo'));
  else if (!finished) steps[pos]?.midis.forEach((m) => (highlights[m] = 'target'));
  if (wrong !== null) highlights[wrong] = 'wrong';

  const fingerLabels: Record<number, string> = {};
  if (!finished && demo < 0 && fingers[pos]) steps[pos].midis.forEach((m) => (fingerLabels[m] = fingers[pos]));

  const clef = exercise.clef ?? 'treble';
  const progress = Math.round((Math.min(pos, steps.length) / steps.length) * 100);

  return (
    <div className={`exercise ${finished ? 'finished' : ''}`}>
      <div className="exercise-head">
        <div>
          <h4>
            {done && <Icon name="check" size={16} className="badge ok" />} {exercise.title}
          </h4>
          <p>{exercise.text}</p>
        </div>
        <div className="exercise-actions">
          <button className="btn small" onClick={listen}>
            <Icon name="speaker" size={15} /> Escuchar
          </button>
          <button className="btn small ghost" onClick={reset}>
            <Icon name="restart" size={15} /> Reiniciar
          </button>
        </div>
      </div>
      {clef !== 'none' && (
        <div className="staff-wrap">
          <Staff items={steps.map((s) => s.names.join('+'))} clef={clef} current={finished ? -1 : demo >= 0 ? demo : pos} done={pos - 1} naming={naming} />
        </div>
      )}
      <div className="exercise-status">
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        {finished ? (
          <span className="ok-text">
            Completado, {errors === 0 ? 'sin un solo error.' : `${errors} nota${errors > 1 ? 's' : ''} equivocada${errors > 1 ? 's' : ''}.`}
          </span>
        ) : (
          <span>
            Paso {pos + 1}/{steps.length}: toca <b>{steps[pos]?.names.map((n) => spellName(n, naming)).join(' + ')}</b>
            {fingers[pos] && <> · dedo {fingers[pos]}</>} · errores: {errors}
          </span>
        )}
      </div>
      <Piano low={low} high={high} highlights={highlights} labels={fingerLabels} height={150} />
    </div>
  );
}
