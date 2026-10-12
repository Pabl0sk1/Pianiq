import { useEffect, useMemo, useRef, useState } from 'react';
import { Piano } from '../components/Piano';
import { InstrumentPicker, SoundPanel } from '../components/SoundPanel';
import { Visualizer } from '../components/Visualizer';
import { Toggle } from '../components/Controls';
import { input } from '../audio/input';
import { SongPlayer } from '../audio/player';
import { useApp, useLive, type KeyCount } from '../state/store';
import { KEYBOARD_RANGES } from '../lib/keyboard';
import { exportMidi } from '../lib/midi';
import { midiToName } from '../lib/music';
import type { NoteEvent, Song } from '../lib/notation';
import { instrumentInfo } from '../audio/instruments';
import { Icon } from '../components/Icon';

const player = new SongPlayer();

export function FreePlay() {
  const ui = useApp((s) => s.ui);
  const setUi = useApp((s) => s.setUi);
  const sound = useApp((s) => s.sound);
  const bpm = useApp((s) => s.metronome.bpm);
  const addUserSong = useApp((s) => s.addUserSong);
  const { sustain, active, midiDevices } = useLive();

  const [low, high] = useMemo(() => {
    if (ui.keyCount === 88) return KEYBOARD_RANGES[88];
    const [a, b] = KEYBOARD_RANGES[ui.keyCount];
    const lo = Math.max(21, (ui.lowestC + 1) * 12);
    return [lo, Math.min(108, lo + (b - a))];
  }, [ui.keyCount, ui.lowestC]);

  // ---- Grabadora --------------------------------------------------------
  const [recording, setRecording] = useState(false);
  const [take, setTake] = useState<NoteEvent[] | null>(null);
  const [playing, setPlaying] = useState(false);
  const rec = useRef({ start: 0, open: new Map<number, { t: number; v: number }>(), held: new Map<number, { t: number; v: number }>(), pedal: false, events: [] as NoteEvent[] });

  useEffect(() => {
    if (!recording) return;
    const r = rec.current;
    const spb = 60 / bpm;
    const close = (midi: number, from: { t: number; v: number }, t: number) => {
      r.events.push({
        midi,
        name: midiToName(midi, 'english'),
        time: (from.t - r.start) / 1000 / spb,
        duration: Math.max(0.05, (t - from.t) / 1000 / spb),
        hand: midi >= 60 ? 'R' : 'L',
        velocity: from.v,
      });
    };
    return input.subscribe((e) => {
      if (e.type === 'on') {
        const prev = r.held.get(e.midi);
        if (prev) {
          close(e.midi, prev, e.t);
          r.held.delete(e.midi);
        }
        r.open.set(e.midi, { t: e.t, v: e.velocity });
      } else if (e.type === 'off') {
        const o = r.open.get(e.midi);
        if (!o) return;
        r.open.delete(e.midi);
        if (r.pedal) r.held.set(e.midi, o);
        else close(e.midi, o, e.t);
      } else {
        r.pedal = e.down;
        if (!e.down) {
          r.held.forEach((o, m) => close(m, o, e.t));
          r.held.clear();
        }
      }
    });
  }, [recording, bpm]);

  const startRec = () => {
    player.stop();
    setPlaying(false);
    rec.current = { start: performance.now(), open: new Map(), held: new Map(), pedal: useLive.getState().sustain, events: [] };
    setTake(null);
    setRecording(true);
  };
  const stopRec = () => {
    const r = rec.current;
    const now = performance.now();
    const spb = 60 / bpm;
    [...r.open, ...r.held].forEach(([m, o]) =>
      r.events.push({ midi: m, name: midiToName(m, 'english'), time: (o.t - r.start) / 1000 / spb, duration: (now - o.t) / 1000 / spb, hand: m >= 60 ? 'R' : 'L', velocity: o.v }),
    );
    // Recorta el silencio inicial
    const first = Math.min(...r.events.map((e) => e.time));
    const events = r.events.map((e) => ({ ...e, time: e.time - (isFinite(first) ? first : 0) })).sort((a, b) => a.time - b.time);
    setRecording(false);
    setTake(events.length ? events : null);
  };
  const playTake = () => {
    if (!take) return;
    if (playing) {
      player.stop();
      setPlaying(false);
      return;
    }
    player.load(take, bpm, { onEnd: () => setPlaying(false) });
    player.play(0);
    setPlaying(true);
  };
  const saveTake = () => {
    if (!take) return;
    const title = prompt('Nombre de la grabación:', `Mi grabación ${new Date().toLocaleString()}`);
    if (!title) return;
    const song: Song = {
      id: `rec-${Date.now()}`,
      title,
      composer: 'Tú',
      difficulty: 3,
      bpm,
      timeSignature: [4, 4],
      description: `Grabado con ${instrumentInfo(sound.instrument).name}`,
      events: take,
      user: true,
      source: 'recording',
    };
    addUserSong(song);
    alert('Guardada en Canciones → Mis canciones.');
  };

  useEffect(() => () => player.stop(), []);

  const activeNames = Object.keys(active)
    .map(Number)
    .sort((a, b) => a - b)
    .map((m) => midiToName(m, ui.naming));

  return (
    <div className="page freeplay">
      <div className="stage">
        <div className="stage-top">
          <InstrumentPicker />
        </div>
        <div className="stage-display">
          <div className="lcd">
            <div className="lcd-main">
              <span className="lcd-label">{instrumentInfo(sound.instrument).name}</span>
              <span className="lcd-notes">{activeNames.length ? activeNames.join('  ') : '—'}</span>
            </div>
            <div className="lcd-stats">
              <span className={sustain ? 'lit' : ''}>PEDAL</span>
              <span className={sound.transpose ? 'lit' : ''}>TRANSP {sound.transpose > 0 ? '+' : ''}{sound.transpose}</span>
              <span className={sound.octave ? 'lit' : ''}>OCT {sound.octave > 0 ? '+' : ''}{sound.octave}</span>
              <span>A4 {sound.a4}</span>
              <span className={midiDevices.length ? 'lit' : ''} title={midiDevices.join(', ')}>
                MIDI {midiDevices.length ? 'ON' : '--'}
              </span>
              {recording && <span className="rec-lit">REC</span>}
            </div>
          </div>
          <Visualizer />
        </div>

        <div className="stage-tools">
          <div className="tool-group">
            {!recording ? (
              <button className="btn rec" onClick={startRec}>
                <Icon name="record" size={14} filled /> Grabar
              </button>
            ) : (
              <button className="btn rec on" onClick={stopRec}>
                <Icon name="stop" size={13} filled /> Parar
              </button>
            )}
            <button className="btn" disabled={!take || recording} onClick={playTake}>
              <Icon name={playing ? 'stop' : 'play'} size={13} filled /> {playing ? 'Detener' : 'Escuchar toma'}
            </button>
            <button className="btn" disabled={!take || recording} onClick={saveTake}>
              Guardar
            </button>
            <button className="btn" disabled={!take || recording} onClick={() => take && exportMidi(take, bpm, 'grabacion-pianiq')}>
              Exportar MIDI
            </button>
          </div>
          <div className="tool-group">
            <span className="tool-label">Teclas</span>
            {([25, 37, 49, 61, 76, 88] as KeyCount[]).map((k) => (
              <button key={k} className={`chip ${ui.keyCount === k ? 'on' : ''}`} onClick={() => setUi({ keyCount: k })}>
                {k}
              </button>
            ))}
            {ui.keyCount !== 88 && (
              <>
                <button className="chip" onClick={() => setUi({ lowestC: Math.max(0, ui.lowestC - 1) })} title="Desplazar teclado a la izquierda">
                  <Icon name="chevronLeft" size={14} />
                </button>
                <button className="chip" onClick={() => setUi({ lowestC: Math.min(6, ui.lowestC + 1) })} title="Desplazar teclado a la derecha">
                  <Icon name="chevronRight" size={14} />
                </button>
              </>
            )}
          </div>
          <div className="tool-group">
            <Toggle label="Nombres" checked={ui.showNoteLabels} onChange={(v) => setUi({ showNoteLabels: v })} />
            <Toggle label="Teclas PC" checked={ui.showKeyboardLabels} onChange={(v) => setUi({ showKeyboardLabels: v })} />
            <button className={`btn pedal ${sustain ? 'on' : ''}`} onPointerDown={() => input.pedal(!sustain)}>
              Pedal {sustain ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <Piano low={low} high={high} height={ui.keyCount >= 76 ? 200 : 240} />
        <p className="hint center">
          Toca con el ratón (más abajo en la tecla = más fuerte), con el teclado del ordenador (Z…M y Q…P, Mayús = forte, Espacio = pedal) o
          conecta un teclado MIDI.
        </p>
      </div>
      <SoundPanel />
    </div>
  );
}
