import { spawnSync } from 'child_process';
import { describe, expect, it } from 'vitest';

describe('Api .NET tests', () => {
  it('all dotnet tests pass', () => {
    const result = spawnSync('dotnet', ['test', '--nologo'], {
      cwd: import.meta.dirname,
      encoding: 'utf-8',
    });

    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);

    expect(result.status, 'dotnet test failed').toBe(0);
  });
});
