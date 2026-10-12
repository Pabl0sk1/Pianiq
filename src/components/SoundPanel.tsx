import { useState } from 'react';
import { BUILTIN_PRESETS, useApp, useLive, type OscType, type SoundSettings } from '../state/store';
import { INSTRUMENTS, instrumentInfo } from '../audio/instruments';
import { Panel, Select, Slider, Stepper, Toggle } from './Controls';
import { NOTE_NAMES_LATIN, NOTE_NAMES_EN } from '../lib/music';

const OSC_TYPES: { id: OscType; name: string }[] = [
  { id: 'sine', name: 'Senoidal' },
  { id: 'triangle', name: 'Triangular' },
  { id: 'square', name: 'Cuadrada' },
  { id: 'sawtooth', name: 'Diente de sierra' },
  { id: 'fatsine', name: 'Seno ancho' },
  { id: 'fattriangle', name: 'Triángulo ancho' },
  { id: 'fatsquare', name: 'Cuadrada ancha' },
  { id: 'fatsawtooth', name: 'Supersaw' },
  { id: 'pulse', name: 'Pulso' },
  { id: 'pwm', name: 'PWM' },
];

const hz = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)} kHz` : `${Math.round(v)} Hz`);
const sec = (v: number) => (v < 1 ? `${Math.round(v * 1000)} ms` : `${v.toFixed(2)} s`);
const pct = (v: number) => `${Math.round(v * 100)}%`;
const db = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)} dB`;

export function InstrumentPicker() {
  const sound = useApp((s) => s.sound);
  const setSound = useApp((s) => s.setSound);
  const { samplesLoading, samplesError } = useLive();
  return (
    <div className="instrument-grid">
      {INSTRUMENTS.map((i) => (
        <button
          key={i.id}
          className={`instrument ${sound.instrument === i.id ? 'active' : ''}`}
          style={{ '--accent': i.color } as React.CSSProperties}
          onClick={() => setSound({ instrument: i.id })}
          title={i.description}
        >
          <span className="instrument-tag">{i.short}</span>
          <span className="instrument-name">{i.name}</span>
          {sound.instrument === i.id && i.sampled && samplesLoading && <span className="instrument-status">Cargando muestras…</span>}
          {sound.instrument === i.id && i.sampled && samplesError && <span className="instrument-status err">Sin conexión: sonido sintético</span>}
        </button>
      ))}
    </div>
  );
}

export function SoundPanel() {
  const sound = useApp((s) => s.sound);
  const setSound = useApp((s) => s.setSound);
  const resetSound = useApp((s) => s.resetSound);
  const presets = useApp((s) => s.presets);
  const savePreset = useApp((s) => s.savePreset);
  const deletePreset = useApp((s) => s.deletePreset);
  const naming = useApp((s) => s.ui.naming);
  const [presetName, setPresetName] = useState('');
  const info = instrumentInfo(sound.instrument);
  const set = <K extends keyof SoundSettings>(k: K) => (v: SoundSettings[K]) => setSound({ [k]: v } as Partial<SoundSettings>);

  const names = naming === 'latin' ? NOTE_NAMES_LATIN : NOTE_NAMES_EN;
  const keyName = (t: number) => {
    const n = names[((t % 12) + 12) % 12];
    return t === 0 ? 'Do (original)' : `${t > 0 ? '+' : ''}${t} → ${n}`;
  };

  const allPresets = [...BUILTIN_PRESETS, ...presets];

  return (
    <div className="sound-panel">
      <Panel
        title="Presets de sonido"
        className="span-2"
        actions={
          <button className="btn ghost small" onClick={resetSound}>
            Restablecer todo
          </button>
        }
      >
        <div className="preset-row">
          {allPresets.map((p) => (
            <span key={p.name} className="preset-chip">
              <button className="chip" onClick={() => setSound(p.sound)}>
                {p.name}
              </button>
              {!p.builtin && (
                <button className="chip-x" onClick={() => deletePreset(p.name)} title="Borrar preset">
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
        <form
          className="preset-save"
          onSubmit={(e) => {
            e.preventDefault();
            if (presetName.trim()) {
              savePreset(presetName.trim());
              setPresetName('');
            }
          }}
        >
          <input value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder="Nombre para guardar el sonido actual…" />
          <button className="btn small" type="submit">
            Guardar preset
          </button>
        </form>
      </Panel>

      <Panel title="Afinación y tono">
        <Stepper label="Transposición" value={sound.transpose} min={-12} max={12} onChange={set('transpose')} format={keyName} />
        <Stepper label="Octava" value={sound.octave} min={-3} max={3} onChange={set('octave')} format={(v) => (v === 0 ? '0' : `${v > 0 ? '+' : ''}${v}`)} />
        <Slider label="Afinación fina" value={sound.fineTune} min={-100} max={100} step={1} unit=" cents" onChange={set('fineTune')} />
        <Slider label="La de referencia (A4)" value={sound.a4} min={415} max={466} step={1} unit=" Hz" onChange={set('a4')} />
        <div className="chip-row">
          {[415, 432, 440, 442, 444].map((f) => (
            <button key={f} className={`chip ${sound.a4 === f ? 'on' : ''}`} onClick={() => setSound({ a4: f })}>
              {f} Hz
            </button>
          ))}
        </div>
        <p className="hint">Flechas ↑ ↓ del teclado: transponer. Flechas ← →: mover la octava del teclado del ordenador.</p>
      </Panel>

      <Panel title="Dinámica y envolvente">
        <Toggle label="Sensible a la velocidad (fuerza)" checked={sound.velocitySensitive} onChange={set('velocitySensitive')} />
        <Slider label="Velocidad fija" value={sound.fixedVelocity} min={0.1} max={1} format={pct} onChange={set('fixedVelocity')} disabled={sound.velocitySensitive} />
        <Slider label="Ataque" value={Math.max(0.001, sound.attack)} min={0.001} max={2} log format={sec} onChange={set('attack')} />
        <Slider label="Caída (decay)" value={sound.decay} min={0.05} max={5} log format={sec} onChange={set('decay')} disabled={info.envelope !== 'full'} />
        <Slider label="Sostenido (sustain)" value={sound.sustain} min={0} max={1} format={pct} onChange={set('sustain')} disabled={info.envelope !== 'full'} />
        <Slider label="Liberación (release)" value={sound.release} min={0.05} max={6} log format={sec} onChange={set('release')} />
        {info.envelope !== 'full' && <p className="hint">En pianos muestreados, ataque y liberación modelan el sonido; caída y sostenido son los naturales del piano real.</p>}
      </Panel>

      <Panel title="Oscilador (Sintetizador Pro)">
        <div className={`field-row ${info.oscillator ? '' : 'disabled'}`}>
          <span>Forma de onda</span>
          <Select value={sound.oscType} options={OSC_TYPES.map((o) => ({ value: o.id, label: o.name }))} onChange={(oscType) => setSound({ oscType })} width={190} />
        </div>
        <Slider label="Desafinación (osciladores anchos)" value={sound.detuneSpread} min={0} max={80} step={1} unit=" cents" onChange={set('detuneSpread')} disabled={!info.oscillator || !sound.oscType.startsWith('fat')} />
        {!info.oscillator && (
          <p className="hint">
            Elige <b>Sintetizador Pro</b> para diseñar tu propio timbre desde la forma de onda.{' '}
            <button className="link" onClick={() => setSound({ instrument: 'synth' })}>
              Cambiar ahora
            </button>
          </p>
        )}
      </Panel>

      <Panel title="Filtro y ecualizador">
        <div className="field-row">
          <span>Tipo de filtro</span>
          <Select
            value={sound.filterType}
            options={[
              { value: 'lowpass', label: 'Paso bajo', hint: 'quita agudos' },
              { value: 'highpass', label: 'Paso alto', hint: 'quita graves' },
              { value: 'bandpass', label: 'Paso banda', hint: 'solo medios' },
              { value: 'notch', label: 'Notch', hint: 'hueco en una frecuencia' },
            ]}
            onChange={(filterType) => setSound({ filterType })}
            width={190}
          />
        </div>
        <Slider label="Corte / brillo" value={sound.filterCutoff} min={60} max={20000} log format={hz} onChange={set('filterCutoff')} />
        <Slider label="Resonancia (Q)" value={sound.filterQ} min={0.1} max={18} step={0.1} onChange={set('filterQ')} />
        <Slider label="Graves" value={sound.eqLow} min={-15} max={15} step={0.5} format={db} onChange={set('eqLow')} />
        <Slider label="Medios" value={sound.eqMid} min={-15} max={15} step={0.5} format={db} onChange={set('eqMid')} />
        <Slider label="Agudos" value={sound.eqHigh} min={-15} max={15} step={0.5} format={db} onChange={set('eqHigh')} />
      </Panel>

      <Panel title="Espacio: reverb y delay">
        <Slider label="Reverb · mezcla" value={sound.reverbWet} min={0} max={1} format={pct} onChange={set('reverbWet')} />
        <Slider label="Reverb · tamaño de sala" value={sound.reverbDecay} min={0.3} max={12} log format={sec} onChange={set('reverbDecay')} />
        <Slider label="Delay · mezcla" value={sound.delayWet} min={0} max={1} format={pct} onChange={set('delayWet')} />
        <Slider label="Delay · tiempo" value={sound.delayTime} min={0.02} max={1.5} log format={sec} onChange={set('delayTime')} />
        <Slider label="Delay · repeticiones" value={sound.delayFeedback} min={0} max={0.9} format={pct} onChange={set('delayFeedback')} />
      </Panel>

      <Panel title="Modulación">
        <Slider label="Chorus · mezcla" value={sound.chorusWet} min={0} max={1} format={pct} onChange={set('chorusWet')} />
        <Slider label="Chorus · velocidad" value={sound.chorusFreq} min={0.1} max={8} log format={hz} onChange={set('chorusFreq')} />
        <Slider label="Chorus · profundidad" value={sound.chorusDepth} min={0} max={1} format={pct} onChange={set('chorusDepth')} />
        <Slider label="Phaser · mezcla" value={sound.phaserWet} min={0} max={1} format={pct} onChange={set('phaserWet')} />
        <Slider label="Phaser · velocidad" value={sound.phaserFreq} min={0.05} max={8} log format={hz} onChange={set('phaserFreq')} />
        <Slider label="Trémolo · mezcla" value={sound.tremoloWet} min={0} max={1} format={pct} onChange={set('tremoloWet')} />
        <Slider label="Trémolo · velocidad" value={sound.tremoloFreq} min={0.5} max={15} log format={hz} onChange={set('tremoloFreq')} />
        <Slider label="Vibrato · mezcla" value={sound.vibratoWet} min={0} max={1} format={pct} onChange={set('vibratoWet')} />
        <Slider label="Vibrato · velocidad" value={sound.vibratoFreq} min={0.3} max={12} log format={hz} onChange={set('vibratoFreq')} />
      </Panel>

      <Panel title="Color y salida">
        <Slider label="Distorsión · mezcla" value={sound.distortionWet} min={0} max={1} format={pct} onChange={set('distortionWet')} />
        <Slider label="Distorsión · intensidad" value={sound.distortion} min={0} max={1} format={pct} onChange={set('distortion')} />
        <Slider label="Panorama" value={sound.pan} min={-1} max={1} format={(v) => (Math.abs(v) < 0.02 ? 'Centro' : v < 0 ? `I ${Math.round(-v * 100)}` : `D ${Math.round(v * 100)}`)} onChange={set('pan')} />
        <Slider label="Amplitud estéreo" value={sound.width} min={0} max={1} format={pct} onChange={set('width')} />
        <Slider label="Volumen maestro" value={sound.volume} min={-40} max={6} step={0.5} format={db} onChange={set('volume')} />
      </Panel>
    </div>
  );
}
