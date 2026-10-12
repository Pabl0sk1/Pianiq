import { useId } from 'react';

/**
 * Marca de Pianiq: una "P" cuyo hueco es un fragmento de teclado.
 * Dibujada a mano en SVG a partir del logo oficial (branding/pianiq-logo-original.png).
 */
export function PianiqMark({ size = 28, className }: { size?: number; className?: string }) {
  const clip = useId();
  return (
    <svg className={className} width={size * (92 / 124)} height={size} viewBox="0 0 92 124" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <path d="M30 16H58a26 26 0 0 1 0 52H30Z" />
        </clipPath>
      </defs>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 2H58a40 40 0 0 1 0 80H46c-10 0-16 6-16 16v24H6V13C6 8.5 3.5 6 0 6Z M30 16H58a26 26 0 0 1 0 52H30Z"
      />
      <g clipPath={`url(#${clip})`} fill="currentColor">
        <rect x="43" y="16" width="2.6" height="52" />
        <rect x="57" y="16" width="2.6" height="52" />
        <rect x="71" y="16" width="2.6" height="52" />
        <rect x="39.2" y="14" width="10" height="31" rx="1.6" />
        <rect x="53.2" y="14" width="10" height="31" rx="1.6" />
        <rect x="67.2" y="14" width="10" height="31" rx="1.6" />
      </g>
    </svg>
  );
}

export function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <span className="wordmark" style={{ fontSize: size * 0.62 }}>
      <PianiqMark size={size} />
      <span className="wordmark-text">PIANIQ</span>
    </span>
  );
}
