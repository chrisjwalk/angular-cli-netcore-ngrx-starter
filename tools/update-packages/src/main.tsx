import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';
import { type CompletionData, App } from './App.js';

const program = new Command();

program
  .option('-o, --omit [omit...]', 'Packages to omit from update', [])
  .option('-v, --verbose', 'Verbose output', false)
  .option('-i, --interactive [interactive]', 'Prompt to run next steps', true)
  .action(async (opts) => {
    const interactive = typeof opts.interactive === 'string'
      ? opts.interactive !== 'false'
      : Boolean(opts.interactive);

    const { waitUntilExit } = render(
      React.createElement(App, {
        options: { omit: opts.omit ?? [], interactive },
        onComplete: (_data: CompletionData) => {},
      }),
    );

    await waitUntilExit();
    process.exit(0);
  });

program.parse();
