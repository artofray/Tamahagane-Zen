import { describe, expect, it } from 'vitest';
import { MIN_QUALITY, measurePulse, RgbSample } from './rppg';

// Deterministic PRNG so the tests never flake.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

// Synthetic face trace: skin tone, slow lighting drift, camera noise, jittery
// frame timing, and an optional pulse with the usual G > B > R strength.
function trace(bpm: number | null, seconds = 10, seed = 1): RgbSample[] {
  const rand = rng(seed);
  const noise = () => (rand() - 0.5) * 0.004;
  const out: RgbSample[] = [];
  for (let t = 0; t < seconds; t += 1 / 30 + (rand() - 0.5) * 0.01) {
    const light = 1 + 0.05 * Math.sin(2 * Math.PI * 0.1 * t);
    const pulse = bpm ? 0.01 * Math.sin(2 * Math.PI * (bpm / 60) * t) : 0;
    out.push({
      t,
      r: 180 * light * (1 + 0.33 * pulse + noise()),
      g: 130 * light * (1 + 0.77 * pulse + noise()),
      b: 110 * light * (1 + 0.53 * pulse + noise()),
    });
  }
  return out;
}

describe('measurePulse', () => {
  it.each([55, 72, 120, 160])('recovers %i BPM', bpm => {
    const est = measurePulse(trace(bpm))!;
    expect(Math.abs(est.bpm - bpm)).toBeLessThanOrEqual(2);
    expect(est.quality).toBeGreaterThan(MIN_QUALITY);
  });

  it('reports low quality when there is no pulse', () => {
    for (let seed = 1; seed <= 200; seed++) {
      expect(measurePulse(trace(null, 10, seed))!.quality).toBeLessThan(MIN_QUALITY);
    }
  });

  it('returns null until there is enough video', () => {
    expect(measurePulse(trace(72, 3))).toBeNull();
    expect(measurePulse([])).toBeNull();
  });
});
