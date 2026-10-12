import { useEffect, useRef, useState, type ReactNode } from 'react';

interface KnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  log?: boolean;
  disabled?: boolean;
}

/** Deslizador con etiqueta y valor (escala logarítmica opcional para frecuencias/tiempos). */
export function Slider({ label, value, min, max, step = 0.01, unit = '', format, onChange, log, disabled }: KnobProps) {
  const toPos = (v: number) => (log ? Math.log(v / min) / Math.log(max / min) : (v - min) / (max - min));
  const fromPos = (p: number) => (log ? min * Math.pow(max / min, p) : min + p * (max - min));
  const pos = toPos(value);
  const shown = format ? format(value) : `${Number.isInteger(step) ? Math.round(value) : value.toFixed(step < 0.1 ? 2 : 1)}${unit}`;
  return (
    <label className={`slider ${disabled ? 'disabled' : ''}`}>
      <span className="slider-head">
        <span>{label}</span>
        <span className="slider-value">{shown}</span>
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.0005}
        value={pos}
        disabled={disabled}
        style={{ '--p': `${pos * 100}%` } as React.CSSProperties}
        onChange={(e) => {
          let v = fromPos(Number(e.target.value));
          if (!log) v = Math.round(v / step) * step;
          onChange(Number(v.toFixed(4)));
        }}
        onDoubleClick={() => onChange(log ? min : Math.max(min, Math.min(max, 0)))}
      />
    </label>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      <span>{label}</span>
    </label>
  );
}

export function Panel({ title, children, actions, className = '' }: { title: string; children: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-head">
        <h3>{title}</h3>
        {actions}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function Stepper({ label, value, min, max, onChange, format }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <div className="stepper-row">
        <button onClick={() => onChange(Math.max(min, value - 1))} aria-label="menos">−</button>
        <span className="stepper-value">{format ? format(value) : value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} aria-label="más">+</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Campo numérico: deja escribir libremente y valida al confirmar (Enter / salir del campo).
// Flechas ↑↓ (Mayús = ×10), rueda del ratón y botones − / + que repiten al mantenerlos.

interface NumberFieldProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
  width?: number;
  ariaLabel?: string;
}

export function NumberField({ value, min, max, step = 1, onChange, suffix, width = 64, ariaLabel }: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const repeat = useRef<number | undefined>(undefined);
  const valueRef = useRef(value);
  valueRef.current = value;
  const clamp = (v: number) => Math.max(min, Math.min(max, Math.round(v / step) * step));
  const commit = () => {
    if (draft === null) return;
    const v = parseFloat(draft.replace(',', '.'));
    if (isFinite(v)) onChange(clamp(v));
    setDraft(null);
  };
  const nudge = (d: number) => onChange(clamp(valueRef.current + d));
  const startRepeat = (d: number) => {
    nudge(d);
    let delay = 380;
    const tick = () => {
      nudge(d);
      delay = Math.max(40, delay * 0.8);
      repeat.current = window.setTimeout(tick, delay);
    };
    repeat.current = window.setTimeout(tick, delay);
  };
  const stopRepeat = () => window.clearTimeout(repeat.current);
  useEffect(() => stopRepeat, []);

  return (
    <div className="numfield" onWheel={(e) => { if (document.activeElement === e.currentTarget.querySelector('input')) nudge(e.deltaY < 0 ? step : -step); }}>
      <button tabIndex={-1} aria-label="menos" onPointerDown={() => startRepeat(-step)} onPointerUp={stopRepeat} onPointerLeave={stopRepeat}>
        −
      </button>
      <input
        inputMode="decimal"
        aria-label={ariaLabel}
        style={{ width }}
        value={draft ?? String(value)}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d.,-]/g, ''))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === 'Escape') {
            setDraft(null);
            (e.target as HTMLInputElement).blur();
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            setDraft(null);
            nudge((e.key === 'ArrowUp' ? 1 : -1) * step * (e.shiftKey ? 10 : 1));
          }
        }}
      />
      {suffix && <span className="numfield-suffix">{suffix}</span>}
      <button tabIndex={-1} aria-label="más" onPointerDown={() => startRepeat(step)} onPointerUp={stopRepeat} onPointerLeave={stopRepeat}>
        +
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desplegable personalizado con teclado (↑ ↓ Enter Esc) y cierre al hacer clic fuera.

export interface SelectOption<T extends string | number> {
  value: T;
  label: ReactNode;
  hint?: string;
}

interface SelectProps<T extends string | number> {
  value: T;
  options: SelectOption<T>[];
  onChange: (v: T) => void;
  width?: number | string;
  ariaLabel?: string;
}

export function Select<T extends string | number>({ value, options, onChange, width, ariaLabel }: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    setHover(Math.max(0, options.findIndex((o) => o.value === value)));
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pick = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
  };

  return (
    <div className={`select ${open ? 'open' : ''}`} ref={root} style={{ width }}>
      <button
        type="button"
        className="select-btn"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!open) return setOpen(true);
            setHover((h) => (h + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
          } else if (e.key === 'Enter' && open) {
            e.preventDefault();
            pick(hover);
          } else if (e.key === 'Escape') setOpen(false);
        }}
      >
        <span className="select-value">{current?.label ?? '—'}</span>
        <span className="select-chevron">▾</span>
      </button>
      {open && (
        <ul className="select-menu" role="listbox">
          {options.map((o, i) => (
            <li
              key={String(o.value)}
              role="option"
              aria-selected={o.value === value}
              className={`${o.value === value ? 'selected' : ''} ${i === hover ? 'hover' : ''}`}
              onPointerEnter={() => setHover(i)}
              onClick={() => pick(i)}
            >
              <span>{o.label}</span>
              {o.hint && <small>{o.hint}</small>}
              {o.value === value && <span className="select-check">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
