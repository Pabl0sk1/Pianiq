import { useRef, type ReactNode } from 'react';
import { Icon } from './Icon';

interface Props {
  title: string;
  pos: { x: number; y: number };
  onMove: (p: { x: number; y: number }) => void;
  onClose: () => void;
  children: ReactNode;
}

/** Ventana flotante que se arrastra por la cabecera y se redimensiona desde la esquina. */
export function FloatingPanel({ title, pos, onMove, onClose, children }: Props) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const clamp = (x: number, y: number) => ({
    x: Math.max(0, Math.min(window.innerWidth - 160, x)),
    y: Math.max(60, Math.min(window.innerHeight - 60, y)),
  });
  return (
    <div className="floating" style={{ left: pos.x, top: pos.y }}>
      <header
        className="floating-head"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => drag.current && onMove(clamp(e.clientX - drag.current.dx, e.clientY - drag.current.dy))}
        onPointerUp={() => (drag.current = null)}
      >
        <span>
          <Icon name="drag" size={14} /> {title}
        </span>
        <button className="btn ghost small" onClick={onClose}>
          <Icon name="close" size={15} />
        </button>
      </header>
      <div className="floating-body">{children}</div>
    </div>
  );
}
