import { provideSpartanConfig } from './spartan-config';

describe('provideSpartanConfig', () => {
  it('should return an array of providers', () => {
    const providers = provideSpartanConfig();
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBeGreaterThan(0);
  });
});
