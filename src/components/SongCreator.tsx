import { useEffect, useRef, useState } from 'react';
import { useApp } from '../state/store';
import { songEvents, tokenize, type Song } from '../lib/notation';
import { importMidiFile } from '../lib/midi';
import { convertAudio, fetchAudioFromUrl, type SourceKind } from '../lib/audioToMidi';
import { SongPlayer } from '../audio/player';
import { NumberField, Select, Slider } from './Controls';
import { Icon } from './Icon';

const preview = new SongPlayer();

interface Props {
  initial: Song | null;
  onClose: () => void;
  onSaved: (s: Song) => void;
}

const EXAMPLE_R = 'E4:q E4 F4 G4 | G4 F4 E4 D4 | C4 C4 D4 E4 | E4:q. D4:e D4:h';
const EXAMPLE_L = 'C3+G3:w | G2+D3:w | C3+G3:w | G2+B2:h G2+D3:h';

export function SongCreator({ initial, onClose, onSaved }: Props) {
  const addUserSong = useApp((s) => s.addUserSong);
  const [tab, setTab] = useState<'write' | 'midi' | 'audio'>(initial?.source === 'midi' ? 'midi' : 'write');
  const [kind, setKind] = useState<SourceKind>('piano');
  const [sens, setSens] = useState(0.5);
  const [audioBpm, setAudioBpm] = useState(0);
  const [busy, setBusy] = useState<{ stage: string; pct: number } | null>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [composer, setComposer] = useState(initial?.composer ?? '');
  const [bpm, setBpm] = useState(initial?.bpm ?? 100);
  const [ts, setTs] = useState(initial?.timeSignature.join('/') ?? '4/4');
  const [rh, setRh] = useState(initial?.tracks?.find((t) => t.hand === 'R')?.notes ?? (initial ? '' : EXAMPLE_R));
  const [lh, setLh] = useState(initial?.tracks?.find((t) => t.hand === 'L')?.notes ?? (initial ? '' : EXAMPLE_L));
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => preview.stop(), []);

  const build = (): Song | null => {
    try {
      tokenize(rh);
      tokenize(lh);
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
    const [a, b] = ts.split('/').map(Number);
    setError(null);
    return {
      id: initial?.id && initial.source !== 'midi' ? initial.id : `user-${Date.now()}`,
      title: title.trim() || 'Sin título',
      composer: composer.trim() || 'Tú',
      difficulty: 3,
      bpm,
      timeSignature: [a || 4, b || 4],
      description: initial?.description ?? 'Escrita con el editor de notación.',
      tracks: [
        ...(rh.trim() ? [{ hand: 'R' as const, notes: rh }] : []),
        ...(lh.trim() ? [{ hand: 'L' as const, notes: lh }] : []),
      ],
      user: true,
      source: 'notation',
    };
  };

  const play = () => {
    if (playing) {
      preview.stop();
      setPlaying(false);
      return;
    }
    const s = build();
    if (!s) return;
    preview.load(songEvents(s), s.bpm, { onEnd: () => setPlaying(false) });
    preview.play(0);
    setPlaying(true);
  };

  const save = () => {
    const s = build();
    if (!s) return;
    preview.stop();
    addUserSong(s);
    onSaved(s);
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    try {
      const s = await importMidiFile(f);
      addUserSong(s);
      onSaved(s);
    } catch (e) {
      setError(`No se pudo leer el archivo MIDI: ${(e as Error).message}`);
    }
  };

  const onAudio = async (f: File | undefined | 'link') => {
    if (!f || busy) return;
    setError(null);
    setBusy({ stage: 'Preparando…', pct: 0 });
    try {
      if (f === 'link') {
        setBusy({ stage: 'Descargando el audio del enlace…', pct: 0 });
        f = await fetchAudioFromUrl(link);
      }
      const s = await convertAudio(f, { kind, sensitivity: sens, bpm: audioBpm, onProgress: (stage, pct) => setBusy({ stage, pct }) });
      addUserSong(s);
      onSaved(s);
    } catch (e) {
      setError(`No se pudo convertir el audio: ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="modal-back" onClick={() => !busy && onClose()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h2>{initial ? 'Editar canción' : 'Nueva canción'}</h2>
          <button className="btn ghost small" onClick={onClose}>
            <Icon name="close" size={16} />
          </button>
        </header>
        <div className="tabs small">
          <button className={`tab ${tab === 'write' ? 'active' : ''}`} onClick={() => setTab('write')}>
            <Icon name="pen" size={15} /> Escribir partitura
          </button>
          <button className={`tab ${tab === 'midi' ? 'active' : ''}`} onClick={() => setTab('midi')}>
            <Icon name="upload" size={15} /> Importar archivo MIDI
          </button>
          <button className={`tab ${tab === 'audio' ? 'active' : ''}`} onClick={() => setTab('audio')}>
            <Icon name="wave" size={15} /> Convertir audio
          </button>
        </div>

        {tab === 'write' ? (
          <div className="creator">
            <div className="form-row">
              <label>
                Título
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mi canción" />
              </label>
              <label>
                Autor
                <input value={composer} onChange={(e) => setComposer(e.target.value)} placeholder="Tú" />
              </label>
              <label className="narrow">
                BPM
                <NumberField value={bpm} min={20} max={300} onChange={setBpm} width={48} />
              </label>
              <label className="narrow">
                Compás
                <Select value={ts} options={['2/4', '3/4', '4/4', '5/4', '6/8', '9/8', '12/8'].map((v) => ({ value: v, label: v }))} onChange={setTs} />
              </label>
            </div>
            <label>
              Mano derecha
              <textarea value={rh} onChange={(e) => setRh(e.target.value)} rows={5} spellCheck={false} />
            </label>
            <label>
              Mano izquierda
              <textarea value={lh} onChange={(e) => setLh(e.target.value)} rows={4} spellCheck={false} />
            </label>
            {error && <div className="callout warn"><span className="callout-label">No se pudo completar</span><p>{error}</p></div>}
            <details className="help">
              <summary>Cómo escribir la notación</summary>
              <ul>
                <li>
                  Cada elemento es <code>NOTA:DURACIÓN</code>. Notas en inglés con octava: <code>C4</code> (Do central), <code>F#3</code>, <code>Bb2</code>. También vale <code>Do4</code>, <code>Sib3</code>.
                </li>
                <li>
                  Duraciones: <code>w</code> redonda, <code>h</code> blanca, <code>q</code> negra, <code>e</code> corchea, <code>s</code> semicorchea, <code>t</code> tresillo, o un número
                  de negras (<code>1.5</code>). Con punto: <code>q.</code> = negra con puntillo.
                </li>
                <li>
                  Acordes con <code>+</code>: <code>C4+E4+G4:h</code>. Silencio: <code>r:q</code>.
                </li>
                <li>Si omites la duración se repite la anterior. Las barras <code>|</code> son opcionales y solo ayudan a leer.</li>
              </ul>
            </details>
            <footer className="modal-foot">
              <button className="btn" onClick={play}>
                <Icon name={playing ? 'stop' : 'play'} size={14} filled /> {playing ? 'Detener' : 'Escuchar'}
              </button>
              <button className="btn primary" onClick={save}>
                Guardar en Mis canciones
              </button>
            </footer>
          </div>
        ) : tab === 'audio' ? (
          <div className="creator">
            <p>
              Elige un archivo de audio (<b>MP3, WAV, OGG, M4A…</b>) y una IA (Basic Pitch de Spotify) detectará las notas y las convertirá en una canción que
              puedes escuchar con cualquier piano, ver en la cascada y practicar. Todo se procesa en tu equipo: el audio no se sube a ningún sitio.
            </p>
            <div className="form-row">
              <label>
                Tipo de audio
                <div className="chip-row">
                  <button className={`chip ${kind === 'piano' ? 'on' : ''}`} onClick={() => setKind('piano')}>
                    Piano solo o cover
                  </button>
                  <button className={`chip ${kind === 'mix' ? 'on' : ''}`} onClick={() => setKind('mix')}>
                    Canción completa
                  </button>
                </div>
              </label>
              <Slider label="Sensibilidad" value={sens} min={0} max={1} step={0.05} format={(v) => `${Math.round(v * 100)}%`} onChange={setSens} />
              <label className="narrow">
                BPM (0 = auto)
                <NumberField value={audioBpm} min={0} max={300} onChange={setAudioBpm} width={48} />
              </label>
            </div>
            <p className="hint">
              Mejor resultado con un <b>cover de piano solo</b>. Con una canción completa (voz, sintes, batería) la IA capta notas de todos los instrumentos:
              sirve como base, pero conviene limpiarla. Al terminar, usa <b>Fijar en la biblioteca</b> para tenerla siempre.
            </p>
            {busy ? (
              <div className="convert-progress">
                <span>{busy.stage}</span>
                <div className="progress big">
                  <div className="progress-bar" style={{ width: `${Math.round(busy.pct * 100)}%` }} />
                </div>
                <span className="muted small">{Math.round(busy.pct * 100)}%</span>
              </div>
            ) : (
              <div
                className="dropzone"
                onClick={() => audioRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onAudio(e.dataTransfer.files[0]);
                }}
              >
                <Icon name="upload" size={22} />
                Arrastra aquí un archivo de audio o haz clic para elegirlo
                <input ref={audioRef} type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac" hidden onChange={(e) => onAudio(e.target.files?.[0])} />
              </div>
            )}
            {!busy && (
              <form
                className="link-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (link.trim()) onAudio('link');
                }}
              >
                <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="…o pega el enlace directo a un archivo de audio (mp3, wav, Dropbox, Google Drive)" />
                <button className="btn primary" type="submit" disabled={!link.trim()}>
                  Convertir enlace
                </button>
              </form>
            )}
            {error && <div className="callout warn"><span className="callout-label">No se pudo completar</span><p>{error}</p></div>}
          </div>
        ) : (
          <div className="creator">
            <p>
              Importa cualquier archivo <b>.mid / .midi</b>: se separará automáticamente en mano derecha e izquierda y podrás escucharlo con cualquier
              sonido, practicarlo en modo espera y verlo en la cascada de notas.
            </p>
            <div
              className="dropzone"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onFile(e.dataTransfer.files[0]);
              }}
            >
              <Icon name="upload" size={22} />
              Arrastra aquí un archivo MIDI o haz clic para elegirlo
              <input ref={fileRef} type="file" accept=".mid,.midi,audio/midi" hidden onChange={(e) => onFile(e.target.files?.[0])} />
            </div>
            {error && <div className="callout warn"><span className="callout-label">No se pudo completar</span><p>{error}</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}
