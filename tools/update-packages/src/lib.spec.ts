import { describe, expect, it } from 'vitest';
import {
  buildMigrationQueue,
  extractJsonObject,
  type PackageInfo,
} from './lib.js';

// ────────────────────────────────────────────────
// extractJsonObject
// ────────────────────────────────────────────────

describe('extractJsonObject', () => {
  it('returns {} for empty string', () => {
    expect(extractJsonObject('')).toBe('{}');
  });

  it('returns {} for whitespace-only string', () => {
    expect(extractJsonObject('   \n  ')).toBe('{}');
  });

  it('extracts a plain JSON object', () => {
    const input = '{"foo":"bar","baz":1}';
    expect(extractJsonObject(input)).toBe(input);
  });

  it('strips leading pnpm warning text before JSON', () => {
    const json =
      '{"lodash":{"current":"4.17.20","wanted":"4.17.21","latest":"4.17.21","dependent":"root","location":""}}';
    const raw = `\nWarn some pnpm warning\n${json}\n`;
    expect(extractJsonObject(raw)).toBe(json);
  });

  it('throws when no JSON object braces found', () => {
    expect(() => extractJsonObject('no braces here')).toThrow(
      'Could not find JSON object',
    );
  });

  it('handles nested objects', () => {
    const input = '{"a":{"b":{"c":1}}}';
    expect(extractJsonObject(input)).toBe(input);
  });
});

// ────────────────────────────────────────────────
// buildMigrationQueue
// ────────────────────────────────────────────────

const pkg = (name: string): PackageInfo => ({
  name,
  current: '1.0.0',
  latest: '2.0.0',
});

describe('buildMigrationQueue', () => {
  it('preserves input order for plain packages (no sorting)', () => {
    const packages = [pkg('prettier'), pkg('eslint'), pkg('chalk')];
    const tasks = buildMigrationQueue(packages);

    expect(tasks.map((t) => t.id)).toEqual(['prettier', 'eslint', 'chalk']);
    expect(tasks.every((t) => t.status === 'pending')).toBe(true);
    expect(tasks.every((t) => t.hasMigrations === false)).toBe(true);
  });

  it('prioritises @angular/core → @angular/cli → @angular/material', () => {
    const packages = [
      pkg('@angular/material'),
      pkg('@angular/cli'),
      pkg('chalk'),
      pkg('@angular/core'),
    ];
    const ids = buildMigrationQueue(packages).map((t) => t.id);

    expect(ids.indexOf('@angular/core')).toBeLessThan(
      ids.indexOf('@angular/cli'),
    );
    expect(ids.indexOf('@angular/cli')).toBeLessThan(
      ids.indexOf('@angular/material'),
    );
    expect(ids.indexOf('@angular/material')).toBeLessThan(ids.indexOf('chalk'));
  });

  it('creates a single __nx__ task and absorbs @nx/* packages', () => {
    const packages = [
      pkg('nx'),
      pkg('@nx/vite'),
      pkg('@nx/angular'),
      pkg('eslint'),
    ];
    const tasks = buildMigrationQueue(packages);
    const ids = tasks.map((t) => t.id);

    expect(ids[0]).toBe('__nx__');
    expect(ids).not.toContain('nx');
    expect(ids).not.toContain('@nx/vite');
    expect(ids).not.toContain('@nx/angular');
    expect(ids).toContain('eslint');
  });

  it('__nx__ task has pkg="" and displayName including version', () => {
    const nxPkg = { ...pkg('nx'), current: '20.0.0', latest: '21.0.0' };
    const tasks = buildMigrationQueue([nxPkg, pkg('@nx/vite')]);

    const nxTask = tasks.find((t) => t.id === '__nx__')!;
    expect(nxTask.pkg).toBe('');
    expect(nxTask.displayName).toContain('20.0.0');
    expect(nxTask.displayName).toContain('21.0.0');
  });

  it('handles @nx/* without a bare nx package', () => {
    const packages = [pkg('@nx/vite'), pkg('@nx/angular')];
    const tasks = buildMigrationQueue(packages);
    const ids = tasks.map((t) => t.id);

    expect(ids[0]).toBe('__nx__');
    expect(ids.length).toBe(1);
  });

  it('returns empty array for empty input', () => {
    expect(buildMigrationQueue([])).toEqual([]);
  });

  it('does not produce duplicate tasks', () => {
    const packages = [pkg('eslint'), pkg('eslint')];
    const tasks = buildMigrationQueue(packages);
    const ids = tasks.map((t) => t.id);

    expect(ids).toHaveLength([...new Set(ids)].length);
  });

  it('non-@angular/ packages come after all @angular/ packages', () => {
    const packages = [
      pkg('prettier'),
      pkg('@angular/forms'),
      pkg('@angular/core'),
    ];
    const ids = buildMigrationQueue(packages).map((t) => t.id);

    const lastAngular = Math.max(
      ...ids
        .map((id, i) => ({ id, i }))
        .filter(({ id }) => id.startsWith('@angular/'))
        .map(({ i }) => i),
    );
    const firstNonAngular = ids.indexOf('prettier');

    expect(firstNonAngular).toBeGreaterThan(lastAngular);
  });
});
