import { useEffect, useMemo, useRef, useState } from 'react';
import { CLASSICAL_SONGS } from '../data/songs';
import { LIBRARY_SONGS, pinSong } from '../data/library';
import { CARTOON_SONGS } from '../data/cartoons';
import { FILM_LINKS, FILM_SONGS } from '../data/films';
import { applyAutoPedal, songEvents, songLength, type Hand, type NoteEvent, type Song } from '../lib/notation';
import { fitRange } from '../lib/keyboard';
import { SongPlayer } from '../audio/player';
import { engine } from '../audio/engine';
import { input } from '../audio/input';
import { useApp, useLive } from '../state/store';
import { Piano, type Highlight } from '../components/Piano';
import { Waterfall } from '../components/Waterfall';
import { exportMidi, eventsToNotation } from '../lib/midi';
import { SongCreator } from '../components/SongCreator';
import { ScoreView } from '../components/ScoreView';
import { FloatingPanel } from '../components/FloatingPanel';
import { midiToName } from '../lib/music';
import * as Tone from 'tone';
import { Icon, type IconName } from '../components/Icon';

const player = new SongPlayer();

type Role = 'listen' | 'R' | 'L' | 'both';
type Mode = 'play' | 'wait';

const ROLE_LABEL: Record<Role, [IconName, string]> = {
  listen: ['headphones', 'Solo escuchar'],
  R: ['handRight', 'Toco la derecha'],
  L: ['handLeft', 'Toco la izquierda'],
  both: ['hands', 'Toco las dos'],
};

function Stars({ n }: { n: number }) {
  return (
    <span className="stars" title={`Dificultad ${n} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={10} filled className={i > n ? 'off' : ''} />
      ))}
    </span>
  );
}

function fmt(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function Songs() {
  const userSongs = useApp((s) => s.userSongs);
  const removeUserSong = useApp((s) => s.removeUserSong);
  const naming = useApp((s) => s.ui.naming);
  const ui = useApp((s) => s.ui);
  const setUi = useApp((s) => s.setUi);
  const all = useMemo(() => [...CLASSICAL_SONGS, ...CARTOON_SONGS, ...FILM_SONGS, ...LIBRARY_SONGS, ...userSongs], [userSongs]);
  const [songId, setSongId] = useState(() => localStorage.getItem('piano-pro-song') ?? CLASSICAL_SONGS[0].id);
  const song = all.find((s) => s.id === songId) ?? CLASSICAL_SONGS[0];
  const [creator, setCreator] = useState<Song | 'new' | null>(null);

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [role, setRole] = useState<Role>('listen');
  const [mode, setMode] = useState<Mode>('play');
  const [sounding, setSounding] = useState<Record<number, Hand>>({});
  const [beat, setBeat] = useState(0);
  const [showNotation, setShowNotation] = useState(false);
  const pendingNotes = useRef(new Map<number, Hand | null>());
  const flushRaf = useRef(0);

  const events = useMemo(() => {
    try {
      return songEvents(song);
    } catch (e) {
      console.error(e);
      return [] as NoteEvent[];
    }
  }, [song]);
  const length = useMemo(() => songLength(events), [events]);
  const samples = { loading: useLive((s) => s.samplesLoading), error: useLive((s) => s.samplesError) };
  const barLenForPedal = song.timeSignature[0] * (4 / song.timeSignature[1]);
  const playEvents = useMemo(
    () => (ui.autoPedal ? applyAutoPedal(events, barLenForPedal, song.pickup ?? 0) : events),
    [events, ui.autoPedal, barLenForPedal, song.pickup],
  );
  const [low, high] = useMemo(() => fitRange(events.map((e) => e.midi), 3), [events]);
  const userHands: Hand[] = role === 'listen' ? [] : role === 'both' ? ['R', 'L'] : [role];
  const barLen = song.timeSignature[0] * (4 / song.timeSignature[1]);
  const spb = 60 / (song.bpm * speed);

  // ---- Carga de canción -------------------------------------------------
  useEffect(() => {
    localStorage.setItem('piano-pro-song', song.id);
    const resume = player.isPlaying ? player.getBeat() : -1;
    player.load(playEvents, song.bpm, {
      // Las teclas iluminadas se agrupan en un solo redibujado por fotograma
      onNote: (e, on) => {
        if (on) pendingNotes.current.set(e.midi, e.hand);
        else pendingNotes.current.set(e.midi, null);
        if (!flushRaf.current)
          flushRaf.current = requestAnimationFrame(() => {
            flushRaf.current = 0;
            const changes = pendingNotes.current;
            pendingNotes.current = new Map();
            setSounding((s) => {
              const n = { ...s };
              changes.forEach((h, m) => (h ? (n[m] = h) : delete n[m]));
              return n;
            });
          });
      },
      onEnd: () => {
        setPlaying(false);
        setSounding({});
      },
    });
    player.setSpeed(speed);
    setSounding({});
    if (resume >= 0) {
      // Cambió solo el pedal automático: seguir sonando desde el mismo punto
      player.setMuted(userHands);
      player.play(resume);
      return;
    }
    setPlaying(false);
    setBeat(0);
    setWaitIdx(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.id, playEvents]);

  useEffect(() => () => player.stop(), []);
  useEffect(() => player.setSpeed(speed), [speed]);
  useEffect(() => player.setMuted(userHands), [role]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reloj de interfaz para la barra de progreso
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setBeat(player.getBeat()), 100);
    return () => clearInterval(id);
  }, [playing]);

  // ---- Modo práctica (espera) ------------------------------------------
  const waitSteps = useMemo(() => {
    const hands = userHands.length ? userHands : (['R', 'L'] as Hand[]);
    const map = new Map<number, NoteEvent[]>();
    for (const e of events) {
      if (!hands.includes(e.hand)) continue;
      const t = Math.round(e.time * 1000) / 1000;
      map.set(t, [...(map.get(t) ?? []), e]);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([time, evs]) => ({ time, midis: [...new Set(evs.map((e) => e.midi))] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, role]);
  const [waitIdx, setWaitIdx] = useState(0);
  const [waitErrors, setWaitErrors] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const pressed = useRef(new Set<number>());
  const displayBeat = useRef(0);

  useEffect(() => {
    if (mode !== 'wait') return;
    player.stop();
    setPlaying(false);
    setWaitIdx(0);
    setWaitErrors(0);
    pressed.current.clear();
  }, [mode, song.id, role]);

  useEffect(() => {
    if (mode !== 'wait') return;
    return input.subscribe((e) => {
      if (e.type === 'off') {
        pressed.current.delete(e.midi);
        return;
      }
      if (e.type !== 'on') return;
      const step = waitSteps[waitIdx];
      if (!step) return;
      if (!step.midis.includes(e.midi)) {
        setWaitErrors((x) => x + 1);
        setWrong(e.midi);
        setTimeout(() => setWrong((w) => (w === e.midi ? null : w)), 300);
        return;
      }
      pressed.current.add(e.midi);
      if (step.midis.every((m) => pressed.current.has(m))) {
        pressed.current.clear();
        // Acompañamiento: las manos que no tocas suenan hasta el siguiente paso
        const nextT = waitSteps[waitIdx + 1]?.time ?? Infinity;
        const now = Tone.immediate() + 0.03;
        for (const ev of playEvents) {
          if (userHands.length === 0 || userHands.includes(ev.hand)) continue;
          if (ev.time >= step.time - 0.001 && ev.time < nextT - 0.001) {
            engine.playScheduled(ev.midi, (ev.sound ?? ev.duration) * spb, now + (ev.time - step.time) * spb, ev.velocity);
          }
        }
        setWaitIdx((i) => i + 1);
      }
    });
  }, [mode, waitSteps, waitIdx, playEvents, role, spb]); // eslint-disable-line react-hooks/exhaustive-deps

  // Función estable (no provoca redibujar la partitura): lee el estado actual desde una ref
  const beatState = useRef({ mode, waitSteps, waitIdx });
  beatState.current = { mode, waitSteps, waitIdx };
  const getBeat = useRef(() => {
    const st = beatState.current;
    if (st.mode === 'wait') {
      const target = st.waitSteps[Math.min(st.waitIdx, st.waitSteps.length - 1)]?.time ?? 0;
      displayBeat.current += (target - displayBeat.current) * 0.18;
      return displayBeat.current;
    }
    return player.getBeat();
  }).current;

  // ---- Controles ---------------------------------------------------------
  const toggle = () => {
    if (mode === 'wait') setMode('play');
    if (playing) {
      player.pause();
      setPlaying(false);
      setBeat(player.getBeat());
    } else {
      player.setMuted(userHands);
      player.play();
      setPlaying(true);
    }
  };
  const stop = () => {
    player.stop();
    setPlaying(false);
    setSounding({});
    setBeat(0);
  };
  const seek = useRef((b: number) => {
    player.seek(b);
    setBeat(b);
    setSounding({});
  }).current;

  // Atajo: tecla Enter = play/pausa
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Enter' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ---- Resaltado del teclado -----------------------------------------------
  const highlights: Record<number, Highlight> = {};
  if (mode === 'wait') {
    waitSteps[waitIdx]?.midis.forEach((m) => (highlights[m] = 'target'));
  } else {
    for (const [m, h] of Object.entries(sounding)) highlights[Number(m)] = userHands.includes(h) ? 'target' : h === 'R' ? 'rh' : 'lh';
  }
  if (wrong !== null) highlights[wrong] = 'wrong';

  const classical = CLASSICAL_SONGS;
  const waitDone = mode === 'wait' && waitIdx >= waitSteps.length && waitSteps.length > 0;

  return (
    <div className="page songs">
      <aside className="song-list">
        <button className="btn primary block" onClick={() => setCreator('new')}>
          ＋ Crear / Importar canción
        </button>
        <h3>Música clásica</h3>
        {classical.map((s) => (
          <button key={s.id} className={`song-item ${s.id === song.id ? 'active' : ''}`} onClick={() => setSongId(s.id)}>
            <span className="song-title">{s.title}</span>
            <span className="song-sub">
              {s.composer} · <Stars n={s.difficulty} />
            </span>
          </button>
        ))}
        <h3>Música de dibujos animados</h3>
        {CARTOON_SONGS.map((s) => (
          <button key={s.id} className={`song-item ${s.id === song.id ? 'active' : ''}`} onClick={() => setSongId(s.id)}>
            <span className="song-title">{s.title}</span>
            <span className="song-sub">
              {s.composer} · <Stars n={s.difficulty} />
            </span>
          </button>
        ))}
        <h3>Música de películas</h3>
        {FILM_LINKS.map(({ id, film }) => {
          const s = all.find((x) => x.id === id);
          if (!s) return null;
          return (
            <button key={id} className={`song-item ${s.id === song.id ? 'active' : ''}`} onClick={() => setSongId(s.id)}>
              <span className="song-title">{s.title}</span>
              <span className="song-sub">{film}</span>
            </button>
          );
        })}
        <h3>Biblioteca permanente</h3>
        {LIBRARY_SONGS.length === 0 && <p className="muted small">Fija aquí las canciones que conviertas o importes para tenerlas siempre.</p>}
        {LIBRARY_SONGS.map((s) => (
          <button key={s.id} className={`song-item ${s.id === song.id ? 'active' : ''}`} onClick={() => setSongId(s.id)}>
            <span className="song-title">
              <Icon name="pin" size={12} /> {s.title}
            </span>
            <span className="song-sub">{s.composer}</span>
          </button>
        ))}
        <h3>Mis canciones</h3>
        {userSongs.length === 0 && <p className="muted small">Graba en "Tocar", importa un MIDI o escribe tu propia partitura.</p>}
        {userSongs.map((s) => (
          <button key={s.id} className={`song-item ${s.id === song.id ? 'active' : ''}`} onClick={() => setSongId(s.id)}>
            <span className="song-title">{s.title}</span>
            <span className="song-sub">
              {s.composer} · {{ midi: 'MIDI', recording: 'Grabación', notation: 'Partitura', audio: 'Audio' }[s.source ?? 'notation']}
            </span>
          </button>
        ))}
      </aside>

      <main className="song-main">
        <header className="song-head">
          <div>
            <h1>{song.title}</h1>
            <p className="song-meta">
              <b>{song.composer}</b>
              {song.period && <span>{song.period}</span>}
              <span>{song.bpm} BPM</span>
              <span>{song.timeSignature.join('/')}</span>
              <Stars n={song.difficulty} />
            </p>
            {song.description && <p className="muted">{song.description}</p>}
          </div>
          <div className="song-head-actions">
            <button className={`btn small ${ui.scoreVisible ? 'primary' : ''}`} onClick={() => setUi({ scoreVisible: !ui.scoreVisible })}>
              <Icon name="score" size={15} /> Partitura
            </button>
            {ui.scoreVisible && (
              <span className="chip-row">
                {(['top', 'side', 'float'] as const).map((p) => (
                  <button key={p} className={`chip ${ui.scorePos === p ? 'on' : ''}`} onClick={() => setUi({ scorePos: p })}>
                    <Icon name={({ top: 'layoutTop', side: 'layoutSide', float: 'layoutFloat' } as const)[p]} size={14} />
                    {{ top: 'Arriba', side: 'Al lado', float: 'Flotante' }[p]}
                  </button>
                ))}
              </span>
            )}
            <button className="btn small ghost" onClick={() => exportMidi(events, song.bpm, song.title)}>
              Exportar MIDI
            </button>
            <button className="btn small ghost" onClick={() => setShowNotation((v) => !v)}>
              {showNotation ? 'Ocultar' : 'Ver'} notación
            </button>
            {song.user && (
              <>
                <button
                  className="btn small"
                  title="Guardar en src/data/library para que esté siempre en la página"
                  onClick={async () => {
                    try {
                      await pinSong(song);
                      removeUserSong(song.id);
                      alert('Guardada en la biblioteca permanente.');
                    } catch {
                      alert('Solo se puede fijar con la app abierta mediante "npm run dev" (Iniciar Piano.bat).');
                    }
                  }}
                >
                  <Icon name="pin" size={14} /> Fijar en la biblioteca
                </button>
                <button className="btn small ghost" onClick={() => setCreator(song)}>
                  Editar
                </button>
                <button
                  className="btn small danger"
                  onClick={() => {
                    if (confirm(`¿Borrar "${song.title}"?`)) {
                      removeUserSong(song.id);
                      setSongId(CLASSICAL_SONGS[0].id);
                    }
                  }}
                >
                  Borrar
                </button>
              </>
            )}
          </div>
        </header>

        {showNotation && (
          <div className="notation-view">
            {(song.tracks ?? [
              { hand: 'R' as Hand, notes: eventsToNotation(events, 'R') },
              { hand: 'L' as Hand, notes: eventsToNotation(events, 'L') },
            ]).map((t, i) => (
              <div key={i}>
                <b>{t.hand === 'R' ? 'Mano derecha' : 'Mano izquierda'}</b>
                <pre>{t.notes.replace(/\s+/g, ' ').trim()}</pre>
              </div>
            ))}
          </div>
        )}

        <div className="transport">
          <button className="btn play" onClick={toggle}>
            <Icon name={playing ? 'pause' : 'play'} size={14} filled /> {playing ? 'Pausa' : 'Reproducir'}
          </button>
          <button className="btn" onClick={stop}>
            <Icon name="stop" size={13} filled />
          </button>
          <div className="seek">
            <span className="time">{fmt(beat * spb)}</span>
            <input
              type="range"
              min={0}
              max={length}
              step={0.01}
              value={Math.min(beat, length)}
              onChange={(e) => seek(Number(e.target.value))}
              style={{ '--p': `${(beat / (length || 1)) * 100}%` } as React.CSSProperties}
            />
            <span className="time">{fmt(length * spb)}</span>
            <span className="muted small">Compás {Math.floor(beat / barLen) + 1}</span>
          </div>
          <div className="speed">
            <span>Velocidad</span>
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5].map((v) => (
              <button key={v} className={`chip ${speed === v ? 'on' : ''}`} onClick={() => setSpeed(v)}>
                {Math.round(v * 100)}%
              </button>
            ))}
          </div>
        </div>

        <div className="transport second">
          <div className="chip-row">
            {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
              <button key={r} className={`chip ${role === r ? 'on' : ''}`} onClick={() => setRole(r)}>
                <Icon name={ROLE_LABEL[r][0]} size={15} /> {ROLE_LABEL[r][1]}
              </button>
            ))}
          </div>
          <div className="chip-row">
            <button
              className={`chip ${ui.autoPedal ? 'on' : ''}`}
              title="Mantiene las notas sonando como lo haría el pedal de un pianista"
              onClick={() => setUi({ autoPedal: !ui.autoPedal })}
            >
              <Icon name="pedal" size={14} /> Pedal automático
            </button>
            <button className={`chip ${mode === 'play' ? 'on' : ''}`} onClick={() => setMode('play')}>
              <Icon name="flow" size={14} /> Continuo
            </button>
            <button className={`chip ${mode === 'wait' ? 'on' : ''}`} onClick={() => setMode('wait')}>
              <Icon name="wait" size={14} /> Práctica: espera mis notas
            </button>
          </div>
        </div>

        {(samples.loading || samples.error) && (
          <div className="wait-status">
            {samples.loading
              ? 'Cargando las muestras del piano de cola… mientras tanto suena un piano sintético provisional.'
              : 'No se pudieron descargar las muestras del piano (¿sin conexión?). Está sonando un piano sintético.'}
          </div>
        )}
        {mode === 'wait' && (
          <div className="wait-status">
            {waitDone ? (
              <span className="ok-text">Pieza completada · {waitErrors} error{waitErrors === 1 ? '' : 'es'}</span>
            ) : (
              <span>
                Paso {Math.min(waitIdx + 1, waitSteps.length)}/{waitSteps.length} · Toca:{' '}
                <b>{waitSteps[waitIdx]?.midis.map((m) => midiToName(m, naming)).join(' + ')}</b> · Errores: {waitErrors}
              </span>
            )}
            <button
              className="btn small ghost"
              onClick={() => {
                setWaitIdx(0);
                setWaitErrors(0);
                displayBeat.current = 0;
              }}
            >
              <Icon name="restart" size={14} /> Reiniciar
            </button>
          </div>
        )}

        <div className={`perf-layout ${ui.scoreVisible ? `score-${ui.scorePos}` : ''}`}>
        {ui.scoreVisible && ui.scorePos !== 'float' && (
          <div className="score-panel">
            <ScoreView events={events} timeSignature={song.timeSignature} getBeat={getBeat} onSeek={mode === 'play' ? seek : undefined} naming={naming} />
          </div>
        )}
        <div className="performance">
          <Waterfall
            events={events}
            low={low}
            high={high}
            getBeat={getBeat}
            secondsPerBeat={spb}
            beatsPerBar={barLen}
            naming={naming}
            userHands={mode === 'wait' && userHands.length === 0 ? ['R', 'L'] : userHands}
            height={300}
          />
          <Piano low={low} high={high} highlights={highlights} height={170} />
        </div>
        </div>
        {ui.scoreVisible && ui.scorePos === 'float' && (
          <FloatingPanel
            title={song.title}
            pos={ui.scoreFloat}
            onMove={(p) => setUi({ scoreFloat: p })}
            onClose={() => setUi({ scoreVisible: false })}
          >
            <ScoreView events={events} timeSignature={song.timeSignature} getBeat={getBeat} onSeek={mode === 'play' ? seek : undefined} naming={naming} />
          </FloatingPanel>
        )}
        <p className="hint center">
          Enter = reproducir/pausa · Azul = mano derecha · Cobre = mano izquierda · Las notas con borde claro son las que tocas tú.
        </p>
      </main>

      {creator && (
        <SongCreator
          initial={creator === 'new' ? null : creator}
          onClose={() => setCreator(null)}
          onSaved={(s) => {
            setCreator(null);
            setSongId(s.id);
          }}
        />
      )}
    </div>
  );
}
