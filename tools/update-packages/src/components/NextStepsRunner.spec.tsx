import { render } from 'ink-testing-library';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { StepResult } from '../App.js';
import { NextStepsRunner } from './NextStepsRunner.js';

describe('NextStepsRunner — non-interactive mode', () => {
  it('marks all steps as skipped and calls onDone immediately', async () => {
    const onDone = vi.fn<[StepResult[]], void>();
    const steps = ['pnpm install --no-frozen-lockfile', 'npx nx migrate --run-migrations'];

    render(
      React.createElement(NextStepsRunner, {
        steps,
        interactive: false,
        onDone,
      }),
    );

    await vi.waitFor(() => expect(onDone).toHaveBeenCalledOnce());

    const results: StepResult[] = onDone.mock.calls[0][0];
    expect(results).toHaveLength(2);
    expect(results.every((r) => r.ran === false)).toBe(true);
    expect(results[0].step).toBe('pnpm install --no-frozen-lockfile');
    expect(results[1].step).toBe('npx nx migrate --run-migrations');
  });

  it('shows skipped steps with ○ symbol', async () => {
    const onDone = vi.fn();
    const steps = ['pnpm install --no-frozen-lockfile'];

    const { lastFrame } = render(
      React.createElement(NextStepsRunner, {
        steps,
        interactive: false,
        onDone,
      }),
    );

    await vi.waitFor(() => expect(onDone).toHaveBeenCalled());

    expect(lastFrame()!).toContain('○');
    expect(lastFrame()!).toContain('pnpm install --no-frozen-lockfile');
  });

  it('works with a single step', async () => {
    const onDone = vi.fn<[StepResult[]], void>();

    render(
      React.createElement(NextStepsRunner, {
        steps: ['pnpm install --no-frozen-lockfile'],
        interactive: false,
        onDone,
      }),
    );

    await vi.waitFor(() => expect(onDone).toHaveBeenCalledOnce());

    const [result] = onDone.mock.calls[0][0];
    expect(result.ran).toBe(false);
  });

  it('works with no steps', async () => {
    const onDone = vi.fn<[StepResult[]], void>();

    render(
      React.createElement(NextStepsRunner, {
        steps: [],
        interactive: false,
        onDone,
      }),
    );

    await vi.waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(onDone.mock.calls[0][0]).toEqual([]);
  });
});
