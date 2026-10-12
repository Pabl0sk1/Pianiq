import { useState } from 'react';
import { Avatar } from './Avatar';
import { Icon } from './Icon';
import { useOutsideClose } from './useOutsideClose';
import { linkProps, navigate } from '../lib/router';
import { useAuth } from '../state/auth';

export function UserMenu() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const devMailbox = useAuth((s) => s.devMailbox);
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose<HTMLDivElement>(open, () => setOpen(false));
  if (!user) return null;

  const go = (to: string) => {
    const props = linkProps(to);
    return {
      href: props.href,
      onClick: (e: React.MouseEvent) => {
        props.onClick(e);
        setOpen(false);
      },
    };
  };

  return (
    <div className="user-menu" ref={ref}>
      <button className={`user-btn ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Menú de usuario">
        <Avatar user={user} size={30} />
      </button>
      {open && (
        <div className="user-pop">
          <div className="user-pop-head">
            <Avatar user={user} size={40} />
            <div>
              <b>{user.name}</b>
              <span className="muted small">{user.email}</span>
            </div>
          </div>
          <a className="menu-item" {...go('/perfil')}>
            <Icon name="pen" size={16} /> Mi perfil
          </a>
          {user.role === 'admin' && (
            <a className="menu-item" {...go('/admin')}>
              <Icon name="gear" size={16} /> Administración
            </a>
          )}
          {devMailbox && import.meta.env.DEV && (
            <a className="menu-item" {...go('/dev/buzon')}>
              <Icon name="book" size={16} /> Buzón de pruebas
            </a>
          )}
          <hr />
          <button
            className="menu-item"
            onClick={async () => {
              setOpen(false);
              await logout();
              navigate('/login', true);
            }}
          >
            <Icon name="chevronLeft" size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
