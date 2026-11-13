// Remote photoplethysmography: pulse rate from the mean skin colour of a face video.
// Method: POS (Wang et al., "Algorithmic Principles of Remote PPG", 2017).

export interface RgbSample {
  t: number; // seconds
  r: number;
  g: number;
  b: number;
}

export interface PulseEstimate {
  bpm: number;
  quality: number; // 0..1, share of in-band power sitting at the peak
}

export const FS = 30; // Hz, uniform rate the samples are resampled to
export const MIN_SECONDS = 8;
export const MIN_QUALITY = 0.6;

const MIN_HZ = 0.7; // 42 BPM
const MAX_HZ = 3.0; // 180 BPM
const PEAK_HALF_WIDTH_HZ = 0.15;

// Linear interpolation of irregular camera frames onto a uniform grid.
export function resample(samples: RgbSample[], fs = FS): number[][] {
  const out: number[][] = [];
  if (samples.length < 2) return out;
  const t0 = samples[0].t;
  const n = Math.floor((samples[samples.length - 1].t - t0) * fs) + 1;
  let j = 0;
  for (let i = 0; i < n; i++) {
    const t = t0 + i / fs;
    while (j < samples.length - 2 && samples[j + 1].t < t) j++;
    const a = samples[j];
    const b = samples[j + 1];
    const w = b.t > a.t ? Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))) : 0;
    out.push([a.r + w * (b.r - a.r), a.g + w * (b.g - a.g), a.b + w * (b.b - a.b)]);
  }
  return out;
}

const mean = (x: number[]) => x.reduce((s, v) => s + v, 0) / x.length;
const std = (x: number[]) => {
  const m = mean(x);
  return Math.sqrt(mean(x.map(v => (v - m) ** 2)));
};

// POS: per 1.6 s window, normalise each channel by its mean, project onto the
// plane orthogonal to skin tone, and overlap-add the windows into one signal.
export function posPulse(rgb: number[][], fs = FS): number[] {
  const n = rgb.length;
  const l = Math.round(1.6 * fs);
  const h = new Array<number>(n).fill(0);
  for (let m = 0; m + l <= n; m++) {
    const win = rgb.slice(m, m + l);
    const mr = mean(win.map(c => c[0]));
    const mg = mean(win.map(c => c[1]));
    const mb = mean(win.map(c => c[2]));
    if (!mr || !mg || !mb) continue;
    const s1 = win.map(c => c[1] / mg - c[2] / mb);
    const s2 = win.map(c => c[1] / mg + c[2] / mb - 2 * (c[0] / mr));
    const sd2 = std(s2);
    const alpha = sd2 > 0 ? std(s1) / sd2 : 0;
    const p = s1.map((v, i) => v + alpha * s2[i]);
    const mp = mean(p);
    for (let i = 0; i < l; i++) h[m + i] += p[i] - mp;
  }
  return h;
}

// Strongest frequency in the heart-rate band, scanned in 1 BPM steps.
export function estimateBpm(signal: number[], fs = FS): PulseEstimate {
  const n = signal.length;
  const m = mean(signal);
  const x = signal.map((v, i) => (v - m) * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1))));
  const freqs: number[] = [];
  const power: number[] = [];
  for (let bpm = MIN_HZ * 60; bpm <= MAX_HZ * 60; bpm++) {
    const f = bpm / 60;
    let re = 0;
    let im = 0;
    for (let i = 0; i < n; i++) {
      const a = (2 * Math.PI * f * i) / fs;
      re += x[i] * Math.cos(a);
      im -= x[i] * Math.sin(a);
    }
    freqs.push(f);
    power.push(re * re + im * im);
  }
  const peak = power.indexOf(Math.max(...power));
  const total = power.reduce((s, v) => s + v, 0);
  const near = power.reduce(
    (s, v, i) => (Math.abs(freqs[i] - freqs[peak]) <= PEAK_HALF_WIDTH_HZ ? s + v : s),
    0,
  );
  return { bpm: Math.round(freqs[peak] * 60), quality: total > 0 ? near / total : 0 };
}

// Full pipeline. Returns null until there is enough video to estimate from.
export function measurePulse(samples: RgbSample[]): PulseEstimate | null {
  if (samples.length < 2 || samples[samples.length - 1].t - samples[0].t < MIN_SECONDS) return null;
  return estimateBpm(posPulse(resample(samples)));
}
