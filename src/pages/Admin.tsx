import { useEffect, useMemo, useState } from 'react';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { Select, Toggle } from '../components/Controls';
import { LEVEL_LABEL, api, formatDate, type User } from '../lib/api';
import { useAuth } from '../state/auth';

type AdminUser = User & { disabled: boolean; sessions: number };

export function AdminPage() {
  const me = useAuth((s) => s.user)!;
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    api
      .get<{ users: AdminUser[] }>('/admin/users')
      .then((r) => setUsers(r.users))
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  const update = async (u: AdminUser, patch: Partial<{ role: string; disabled: boolean }>) => {
    try {
      await api.patch(`/admin/users/${u.id}`, patch);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const remove = async (u: AdminUser) => {
    if (!confirm(`¿Eliminar la cuenta de ${u.name} (@${u.username})? Se borran todos sus datos.`)) return;
    try {
      await api.del(`/admin/users/${u.id}`);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? users.filter((u) => [u.name, u.username, u.email].some((v) => v.toLowerCase().includes(s))) : users;
  }, [users, q]);

  const admins = users.filter((u) => u.role === 'admin').length;
  const active = users.filter((u) => u.sessions > 0).length;

  return (
    <div className="page admin">
      <header className="admin-head">
        <div>
          <h1>Administración</h1>
          <p className="muted">Usuarios registrados en esta instalación de Pianiq.</p>
        </div>
        <dl className="admin-stats">
          <div>
            <dt>Usuarios</dt>
            <dd>{users.length}</dd>
          </div>
          <div>
            <dt>Con sesión abierta</dt>
            <dd>{active}</dd>
          </div>
          <div>
            <dt>Administradores</dt>
            <dd>{admins}</dd>
          </div>
        </dl>
      </header>
      {error && (
        <div className="form-error">
          <Icon name="alert" size={16} /> <span>{error}</span>
        </div>
      )}
      <div className="admin-toolbar">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre, usuario o correo…" />
      </div>
      <div className="table-wrap card-table">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Nivel</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Alta</th>
              <th>Último acceso</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {shown.map((u) => {
              const self = u.id === me.id;
              return (
                <tr key={u.id} className={u.disabled ? 'is-disabled' : ''}>
                  <td>
                    <div className="user-cell">
                      <Avatar user={u} size={30} />
                      <div>
                        <b>{u.name}</b>
                        <span className="muted small">
                          @{u.username}
                          {self && ' · tú'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{LEVEL_LABEL[u.level]}</td>
                  <td>
                    {self ? (
                      <span className="tag accent">Administrador</span>
                    ) : (
                      <Select
                        value={u.role}
                        options={[
                          { value: 'user', label: 'Usuario' },
                          { value: 'admin', label: 'Administrador' },
                        ]}
                        onChange={(role) => update(u, { role })}
                        width={150}
                      />
                    )}
                  </td>
                  <td>{self ? '—' : <Toggle label="" checked={!u.disabled} onChange={(on) => update(u, { disabled: !on })} />}</td>
                  <td className="muted">{formatDate(u.createdAt)}</td>
                  <td className="muted">
                    {formatDate(u.lastLoginAt, true)}
                    {u.sessions > 0 && <span className="online" title={`${u.sessions} sesión(es) abiertas`} />}
                  </td>
                  <td>
                    {!self && (
                      <button className="btn small ghost danger" onClick={() => remove(u)} title="Eliminar cuenta">
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && <p className="muted center">Ningún usuario coincide con la búsqueda.</p>}
      </div>
    </div>
  );
}
