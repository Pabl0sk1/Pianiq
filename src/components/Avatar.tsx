import type { User } from '../lib/api';

// Colores de las iniciales: tonos de la marca, elegidos de forma estable por usuario
const TONES = ['#1f3044', '#2c4a3e', '#4b2532', '#5b3a24', '#33475e', '#4a4f2a', '#3d2f4f'];

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export function Avatar({ user, size = 32 }: { user: Pick<User, 'name' | 'username' | 'avatar'>; size?: number }) {
  if (user.avatar) return <img className="avatar" src={user.avatar} alt="" width={size} height={size} style={{ width: size, height: size }} />;
  let h = 0;
  for (const c of user.username) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.4, background: TONES[h % TONES.length] }} aria-hidden="true">
      {initials(user.name)}
    </span>
  );
}

/** Reduce una imagen a un cuadrado de 192 px (JPEG) para guardarla como avatar. */
export function resizeAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) return reject(new Error('Elige una imagen PNG, JPG o WebP.'));
    const img = new Image();
    img.onload = () => {
      const s = Math.min(img.width, img.height);
      const c = document.createElement('canvas');
      c.width = c.height = 192;
      const ctx = c.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 192, 192);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    img.src = URL.createObjectURL(file);
  });
}
