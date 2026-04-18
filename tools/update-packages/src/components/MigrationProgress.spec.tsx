import { render } from 'ink-testing-library';
import React from 'react';
import { describe, expect, it } from 'vitest';
import type { MigrationTask } from '../lib.js';
import { MigrationProgress } from './MigrationProgress.js';

function makeTask(overrides: Partial<MigrationTask> = {}): MigrationTask {
  return {
    id: 'test-pkg',
    pkg: 'test-pkg',
    displayName: 'test-pkg',
    status: 'pending',
    hasMigrations: false,
    ...overrides,
  };
}

describe('MigrationProgress', () => {
  it('shows all pending tasks dimmed with counter [0/N]', () => {
    const tasks = [
      makeTask({ id: 'pkg-a', displayName: 'pkg-a' }),
      makeTask({ id: 'pkg-b', displayName: 'pkg-b' }),
    ];
    const { lastFrame } = render(React.createElement(MigrationProgress, { tasks }));
    const frame = lastFrame()!;

    expect(frame).toContain('pkg-a');
    expect(frame).toContain('pkg-b');
    expect(frame).toContain('[0/2]');
  });

  it('shows ✓ (green) for done tasks without migrations', () => {
    const tasks = [makeTask({ status: 'done', hasMigrations: false })];
    const { lastFrame } = render(React.createElement(MigrationProgress, { tasks }));

    expect(lastFrame()!).toContain('✓');
    expect(lastFrame()!).toContain('test-pkg');
    expect(lastFrame()!).not.toContain('(migrations)');
  });

  it('shows ✓ with "(migrations)" for done tasks that had migrations', () => {
    const tasks = [makeTask({ status: 'done', hasMigrations: true })];
    const { lastFrame } = render(React.createElement(MigrationProgress, { tasks }));

    expect(lastFrame()!).toContain('✓');
    expect(lastFrame()!).toContain('(migrations)');
  });

  it('shows ✗ for error tasks', () => {
    const tasks = [makeTask({ status: 'error', error: 'something broke' })];
    const { lastFrame } = render(React.createElement(MigrationProgress, { tasks }));

    expect(lastFrame()!).toContain('✗');
    expect(lastFrame()!).toContain('something broke');
  });

  it('shows ◆ for running tasks', () => {
    const tasks = [makeTask({ status: 'running' })];
    const { lastFrame } = render(React.createElement(MigrationProgress, { tasks }));

    expect(lastFrame()!).toContain('◆');
    expect(lastFrame()!).toContain('test-pkg');
  });

  it('updates counter as tasks complete', () => {
    const tasks = [
      makeTask({ id: 'a', displayName: 'a', status: 'done' }),
      makeTask({ id: 'b', displayName: 'b', status: 'done' }),
      makeTask({ id: 'c', displayName: 'c', status: 'pending' }),
    ];
    const { lastFrame } = render(React.createElement(MigrationProgress, { tasks }));

    expect(lastFrame()!).toContain('[2/3]');
  });

  it('shows all tasks regardless of status (no items hidden)', () => {
    const tasks = [
      makeTask({ id: 'a', displayName: 'pkg-a', status: 'done' }),
      makeTask({ id: 'b', displayName: 'pkg-b', status: 'running' }),
      makeTask({ id: 'c', displayName: 'pkg-c', status: 'pending' }),
    ];
    const { lastFrame } = render(React.createElement(MigrationProgress, { tasks }));
    const frame = lastFrame()!;

    expect(frame).toContain('pkg-a');
    expect(frame).toContain('pkg-b');
    expect(frame).toContain('pkg-c');
  });
});
