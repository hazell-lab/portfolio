// the goatcounter code decides which server the csp allows, so only real codes get through
import { describe, expect, it } from 'vitest';
import { goatCounter } from '@/lib/analytics.mjs';

describe('goatCounter', () => {
  it('is off when no code is set', () => {
    expect(goatCounter(undefined)).toBeNull();
    expect(goatCounter('')).toBeNull();
    expect(goatCounter('   ')).toBeNull();
  });

  it('builds the count endpoint and origin from a code', () => {
    expect(goatCounter('hazimaqil')).toEqual({
      endpoint: 'https://hazimaqil.goatcounter.com/count',
      origin: 'https://hazimaqil.goatcounter.com',
    });
  });

  it('trims and lowercases the code', () => {
    expect(goatCounter('  HazimAqil ')?.origin).toBe('https://hazimaqil.goatcounter.com');
  });

  it('rejects anything that could change the host', () => {
    for (const bad of ['evil.com/x', 'a b', 'name.goatcounter.com', 'https://x', '-name', 'name-', 'x']) {
      expect(goatCounter(bad)).toBeNull();
    }
  });
});
