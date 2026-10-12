import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon } from './Icon';

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: ReactNode;
  aside?: ReactNode;
}

export function Field({ label, value, onChange, error, hint, aside, ...rest }: FieldProps) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="field-label">
        {label}
        {aside}
      </span>
      <input {...rest} type={rest.type ?? 'text'} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

/** Puntuación orientativa de 0 a 4 */
export function passwordScore(p: string): number {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p) && /[^a-zA-Z0-9]/.test(p)) s++;
  if (p.length < 8 || !/\d/.test(p) || !/[a-zA-Z]/.test(p)) s = Math.min(s, 1);
  return s;
}

const SCORE_LABEL = ['', 'Débil', 'Aceptable', 'Buena', 'Muy buena'];

export function PasswordField({
  label,
  value,
  onChange,
  error,
  meter,
  autoComplete = 'current-password',
  aside,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  meter?: boolean;
  autoComplete?: string;
  aside?: ReactNode;
}) {
  const [show, setShow] = useState(false);
  const score = passwordScore(value);
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="field-label">
        {label}
        {aside}
      </span>
      <span className="field-pass">
        <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} aria-invalid={!!error} />
        <button type="button" className="field-eye" onClick={() => setShow((s) => !s)} title={show ? 'Ocultar' : 'Mostrar'} tabIndex={-1}>
          {show ? 'Ocultar' : 'Ver'}
        </button>
      </span>
      {meter && value && (
        <span className="meter" data-score={score}>
          <i />
          <i />
          <i />
          <i />
          <em>{SCORE_LABEL[score]}</em>
        </span>
      )}
      {error ? (
        <span className="field-error">{error}</span>
      ) : meter ? (
        <span className="field-hint">Mínimo 8 caracteres, con letras y números.</span>
      ) : null}
    </label>
  );
}

export function FormError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <div className="form-error" role="alert">
      <Icon name="alert" size={16} />
      <span>{children}</span>
    </div>
  );
}
