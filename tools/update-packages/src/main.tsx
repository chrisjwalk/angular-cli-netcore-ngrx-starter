import { Writable } from 'stream';
import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';
import { App } from './App.js';
import type { CompletionData } from './App.js';

const program = new Command();

program
  .option('-o, --omit [omit...]', 'Packages to omit from update', [])
  .option('-v, --verbose', 'Verbose output', false)
  .option('-i, --interactive [interactive]', 'Prompt to run next steps', true)
  .option('-m, --minor-only', 'Skip major version bumps', false)
  .option('-j, --json', 'Output results as JSON (implies --interactive=false)', false)
  .action(async (opts) => {
    const isJson: boolean = opts.json ?? false;
    const interactive = isJson
      ? false
      : typeof opts.interactive === 'string'
        ? opts.interactive !== 'false'
        : Boolean(opts.interactive);

    let exitCode = 0;

    const nullStream = new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    }) as unknown as NodeJS.WriteStream;

    const buildJsonOutput = (data: CompletionData) => ({
      updated: data.tasks
        .filter((t) => t.status === 'done')
        .map((t) => (t.id === '__nx__' ? 'nx' : t.id)),
      omitted: data.omitted,
      failed: data.tasks
        .filter((t) => t.status === 'error')
        .map((t) => ({ name: t.id === '__nx__' ? 'nx' : t.id, error: t.error ?? '' })),
      hasMigrations: data.tasks.some((t) => t.hasMigrations),
      nextSteps: data.stepResults.map((s) => s.step),
    });

    const { waitUntilExit } = render(
      React.createElement(App, {
        options: { omit: opts.omit ?? [], interactive, minorOnly: opts.minorOnly ?? false },
        onComplete: isJson
          ? (data) => {
              process.stdout.write(JSON.stringify(buildJsonOutput(data), null, 2) + '\n');
            }
          : undefined,
        onError: isJson
          ? (error) => {
              process.stderr.write(JSON.stringify({ error }) + '\n');
              exitCode = 1;
            }
          : undefined,
      }),
      isJson ? { stdout: nullStream } : undefined,
    );

    await waitUntilExit();
    process.exit(exitCode);
  });

program.parse();
