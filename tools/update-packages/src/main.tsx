import chalk from 'chalk';
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

    let completionData: CompletionData | null = null;

    const { waitUntilExit } = render(
      React.createElement(App, {
        options: { omit: opts.omit ?? [], interactive },
        onComplete: (data) => { completionData = data; },
      }),
    );

    await waitUntilExit();

    const report = completionData as CompletionData | null;
    if (report && report.stepResults.length) {
      console.log('');
      for (const { step, ran } of report.stepResults) {
        console.log(ran ? chalk.green(`  ✓ ${step}`) : chalk.dim(`  ○ ${step} (skipped)`));
      }
      console.log('');
    }

    process.exit(0);
  });

program.parse();
