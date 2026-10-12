// Iconos de línea propios (24×24, trazo 1.7) para no depender de emojis.
const PATHS = {
  keys: 'M3 5h18v14H3z M8 5v14 M13 5v14 M18 5v14 M6.5 5v8 M11.5 5v8 M16.5 5v8',
  learn: 'M3 7l9-4 9 4-9 4-9-4z M7 9v5c0 1.7 2.2 3 5 3s5-1.3 5-3V9 M21 7v6',
  songs: 'M9 18V5l11-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  ear: 'M6 9a6 6 0 1 1 12 0c0 3-2 4-3 5.5S14 18 12 20c-1.6 1.4-4 .4-4-1.7 M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-1.5 3',
  book: 'M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z M4 19.5A1.5 1.5 0 0 0 5.5 21H20 M8 7h8 M8 11h6',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4.9a7.5 7.5 0 0 0-1.7-1L15 3h-4l-.4 2.6a7.5 7.5 0 0 0-1.7 1l-2.4-.9-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-.9a7.5 7.5 0 0 0 1.7 1L11 21h4l.4-2.6a7.5 7.5 0 0 0 1.7-1l2.4.9 2-3.4z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  system: 'M3 4h18v12H3z M8 20h8 M12 16v4',
  play: 'M7 4.5v15l12-7.5z',
  pause: 'M7 4h3.5v16H7z M13.5 4H17v16h-3.5z',
  stop: 'M6 6h12v12H6z',
  record: 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z',
  speaker: 'M4 9h4l5-4v14l-5-4H4z M16.5 8.5a5 5 0 0 1 0 7 M19 6a8.5 8.5 0 0 1 0 12',
  restart: 'M4 12a8 8 0 1 0 2.3-5.7 M4 4v4h4',
  close: 'M6 6l12 12 M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7',
  plus: 'M12 5v14 M5 12h14',
  pin: 'M9 3h6l-1 6 4 4H6l4-4z M12 13v8',
  upload: 'M12 16V4 M7 9l5-5 5 5 M4 16v4h16v-4',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  pen: 'M4 20h4L19 9l-4-4L4 16z M14 6l4 4',
  wave: 'M2 12h2l2-6 3 12 3-15 3 15 3-9 2 3h2',
  score: 'M3 6h18 M3 10h18 M3 14h18 M3 18h18 M9 18V7.5 M9 7.5l6-1.5',
  pedal: 'M7 21h10 M9 21l1-8h4l1 8 M8.5 13L6 5h12l-2.5 8',
  headphones: 'M4 15v-3a8 8 0 0 1 16 0v3 M4 15h3v5H4z M17 15h3v5h-3z',
  handRight: 'M8 13V6.5a1.5 1.5 0 0 1 3 0V11 M11 11V4.5a1.5 1.5 0 0 1 3 0V11 M14 11V6a1.5 1.5 0 0 1 3 0v6 M17 10a1.5 1.5 0 0 1 3 0v4c0 4-3 7-7 7h-1c-3 0-4.5-1.5-6-4l-2-3.5a1.5 1.5 0 0 1 2.6-1.5L8 14',
  handLeft: 'M16 13V6.5a1.5 1.5 0 0 0-3 0V11 M13 11V4.5a1.5 1.5 0 0 0-3 0V11 M10 11V6a1.5 1.5 0 0 0-3 0v6 M7 10a1.5 1.5 0 0 0-3 0v4c0 4 3 7 7 7h1c3 0 4.5-1.5 6-4l2-3.5a1.5 1.5 0 0 0-2.6-1.5L16 14',
  hands: 'M3 12V8a1.5 1.5 0 0 1 3 0v3 M6 9V5.5a1.5 1.5 0 0 1 3 0V11 M9 11c0 4.5-1 9-4 9 M21 12V8a1.5 1.5 0 0 0-3 0v3 M18 9V5.5a1.5 1.5 0 0 0-3 0V11 M15 11c0 4.5 1 9 4 9',
  wait: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
  flow: 'M3 12h14 M13 7l5 5-5 5 M21 5v14',
  layoutTop: 'M3 4h18v16H3z M3 10h18',
  layoutSide: 'M3 4h18v16H3z M13 4v16',
  layoutFloat: 'M3 4h18v16H3z M11 11h8v6h-8z',
  bulb: 'M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
  alert: 'M12 3l10 18H2z M12 10v5 M12 18v.5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5h4',
  chevronLeft: 'M15 5l-7 7 7 7',
  chevronRight: 'M9 5l7 7-7 7',
  metronome: 'M8 3h8l3 18H5z M12 17l5-11 M8 15h8',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  drag: 'M9 6h.01 M15 6h.01 M9 12h.01 M15 12h.01 M9 18h.01 M15 18h.01',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 18, className, filled }: { name: IconName; size?: number; className?: string; filled?: boolean }) {
  return (
    <svg
      className={`icon ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={name === 'drag' ? 3 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
