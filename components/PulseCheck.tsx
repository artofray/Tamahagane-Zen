import React, { useEffect, useRef, useState } from 'react';
import { HeartPulse } from 'lucide-react';
import { Button } from './Button';
import { MIN_QUALITY, PulseEstimate, RgbSample, measurePulse } from '../services/rppg';

const WINDOW_SECONDS = 10;
const ROI = 32; // px, side of the canvas the face region is averaged on

export const PulseCheck: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [estimate, setEstimate] = useState<PulseEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let stream: MediaStream | null = null;
    let raf = 0;
    let cancelled = false;
    const samples: RgbSample[] = [];
    const ctx = Object.assign(document.createElement('canvas'), { width: ROI, height: ROI })
      .getContext('2d', { willReadFrequently: true })!;
    let lastSample = 0;
    let lastEstimate = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const video = videoRef.current;
      if (!video || !video.videoWidth || now - lastSample < 30) return;
      lastSample = now;

      // Average the colour of the central region, where the guide oval sits.
      const w = video.videoWidth * 0.3;
      const h = video.videoHeight * 0.5;
      ctx.drawImage(video, (video.videoWidth - w) / 2, (video.videoHeight - h) / 2, w, h, 0, 0, ROI, ROI);
      const px = ctx.getImageData(0, 0, ROI, ROI).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < px.length; i += 4) {
        r += px[i];
        g += px[i + 1];
        b += px[i + 2];
      }
      const n = px.length / 4;
      samples.push({ t: now / 1000, r: r / n, g: g / n, b: b / n });
      while (samples[0].t < now / 1000 - WINDOW_SECONDS) samples.shift();

      if (now - lastEstimate >= 1000) {
        lastEstimate = now;
        setEstimate(measurePulse(samples));
      }
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then(s => {
        if (cancelled) return s.getTracks().forEach(t => t.stop());
        stream = s;
        videoRef.current!.srcObject = s;
        raf = requestAnimationFrame(tick);
      })
      .catch(() => {
        setError('Camera unavailable or permission denied.');
        setActive(false);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach(t => t.stop());
      setEstimate(null);
    };
  }, [active]);

  const steady = estimate && estimate.quality >= MIN_QUALITY;

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-4 shadow-xl">
      <div className="flex items-center gap-2">
        <HeartPulse size={16} className="text-red-500" />
        <h3 className="font-orbitron font-bold text-slate-500 text-[10px] tracking-[0.3em] uppercase">Pulse Check</h3>
      </div>

      {active && (
        <>
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-slate-800">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
            <div className="absolute inset-0 m-auto w-[30%] h-[50%] rounded-[50%] border-2 border-white/60" />
          </div>
          <div className="text-center" data-testid="pulse-readout">
            {steady ? (
              <p className="text-5xl font-orbitron font-bold text-white">
                {estimate.bpm} <span className="text-sm text-slate-500">BPM</span>
              </p>
            ) : (
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {estimate ? 'Weak signal: hold still, face the light' : 'Reading... keep your face in the oval'}
              </p>
            )}
          </div>
        </>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <Button
        fullWidth
        variant="secondary"
        className="py-2 text-xs"
        onClick={() => {
          setError(null);
          setActive(a => !a);
        }}
      >
        {active ? 'Stop' : 'Measure Pulse'}
      </Button>
      <p className="text-[10px] text-slate-600 leading-relaxed">
        Camera wellness estimate, processed on this device. Not a medical device.
      </p>
    </div>
  );
};
