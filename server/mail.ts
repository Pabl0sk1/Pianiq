import { getDb } from './db.ts';

export interface Mail {
  to: string;
  subject: string;
  text: string;
  link?: string;
}

const smtpConfigured = () => !!process.env.SMTP_HOST;

/**
 * Envía un correo. Con SMTP_HOST configurado usa SMTP real (nodemailer);
 * si no, lo guarda en el buzón de pruebas (visible en /dev/buzon) y lo muestra en consola.
 */
export async function sendMail(mail: Mail): Promise<void> {
  if (smtpConfigured()) {
    const { createTransport } = await import('nodemailer');
    const transport = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await transport.sendMail({
      from: process.env.MAIL_FROM ?? 'Pianiq <no-reply@pianiq.local>',
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
    });
    return;
  }
  getDb()
    .prepare('INSERT INTO outbox (to_email, subject, body, link) VALUES (?, ?, ?, ?)')
    .run(mail.to, mail.subject, mail.text, mail.link ?? null);
  console.log(`[pianiq] correo para ${mail.to}: ${mail.subject}${mail.link ? `\n          ${mail.link}` : ''}`);
}

export const usingDevMailbox = () => !smtpConfigured();
