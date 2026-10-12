import { useEffect, useRef } from 'react';
import { engine } from '../audio/engine';

/** Osciloscopio + espectro en tiempo real de la salida de audio. */
export function Visualizer({ height = 90 }: { height?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    engine.setAnalysis(true);
    return () => engine.setAnalysis(false);
  }, []);
  useEffect(() => {
    let raf = 0;
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== Math.round(w * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!engine.isReady) return;
      // Espectro
      const fft = engine.fft.getValue() as Float32Array;
      const n = fft.length;
      const bw = w / n;
      for (let i = 0; i < n; i++) {
        const v = Math.max(0, (fft[i] + 110) / 110);
        const bh = v * h * 0.9;
        ctx.fillStyle = `rgba(176, 122, 67, ${0.18 + v * 0.3})`;
        ctx.fillRect(i * bw, h - bh, bw - 1, bh);
      }
      // Forma de onda
      const wave = engine.waveform.getValue() as Float32Array;
      ctx.beginPath();
      for (let i = 0; i < wave.length; i++) {
        const x = (i / (wave.length - 1)) * w;
        const y = h / 2 - wave[i] * h * 0.45;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#f0b45c';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = 'rgba(240,180,92,0.6)';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="visualizer" style={{ height }} />;
}
