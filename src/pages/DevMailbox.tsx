import { useEffect, useState } from 'react';
import { PianiqMark } from '../components/Brand';
import { api, formatDate } from '../lib/api';
import { linkProps, navigate } from '../lib/router';

interface Mail {
  id: number;
  to_email: string;
  subject: string;
  body: string;
  link: string | null;
  created_at: string;
}

/** Buzón de pruebas: los correos que se enviarían si hubiera un servidor SMTP configurado. */
export function DevMailbox() {
  const [mails, setMails] = useState<Mail[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    api
      .get<{ mails: Mail[] }>('/dev/outbox')
      .then((r) => setMails(r.mails))
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mailbox">
      <header>
        <a className="wordmark" {...linkProps('/')}>
          <PianiqMark size={26} />
          <span className="wordmark-text">PIANIQ</span>
        </a>
        <span className="tag">Buzón de pruebas</span>
      </header>
      <h1>Correos enviados</h1>
      <p className="muted">
        No hay un servidor de correo configurado, así que Pianiq guarda aquí los correos (recuperación de contraseña, bienvenida…). Para enviar correos reales,
        define <code>SMTP_HOST</code> y compañía antes de arrancar.
      </p>
      {error && <p className="field-error">{error}</p>}
      {mails?.length === 0 && <p className="muted">Todavía no se ha enviado ningún correo.</p>}
      <ul className="mail-list">
        {mails?.map((m) => (
          <li key={m.id}>
            <div className="mail-head">
              <b>{m.subject}</b>
              <span className="muted small">
                Para {m.to_email} · {formatDate(m.created_at, true)}
              </span>
            </div>
            <pre>{m.body}</pre>
            {m.link && (
              <button className="btn primary small" onClick={() => navigate(new URL(m.link!).pathname + new URL(m.link!).search)}>
                Abrir el enlace
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
