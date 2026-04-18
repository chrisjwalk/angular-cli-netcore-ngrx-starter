import chalk from 'chalk';
import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';
import { type CompletionData, App } from './App.js';

function printReport({ tasks, omitted, stepResults }: CompletionData) {
  const updated = tasks.filter((t) => t.status === 'done');
  const failed = tasks.filter((t) => t.status === 'error');
  const withMigrations = updated.filter((t) => t.hasMigrations);
  const sep = chalk.dim('─'.repeat(50));

  console.log('');
  console.log(chalk.bold('Update Summary'));
  console.log(sep);

  if (updated.length > 0) {
    const names = updated.map((t) => chalk.green(t.displayName)).join(chalk.dim(' · '));
    console.log(chalk.green.bold(`✓ Updated  (${updated.length}): `) + names);
  } else {
    console.log(chalk.yellow('No packages were updated.'));
  }

  if (failed.length > 0) {
    const names = failed.map((t) => chalk.red(t.displayName)).join(chalk.dim(' · '));
    console.log(chalk.red.bold(`✗ Failed   (${failed.length}): `) + names);
  }

  if (omitted.length > 0) {
    const names = omitted.map((o) => chalk.dim(o)).join(chalk.dim(' · '));
    console.log(chalk.dim(`○ Omitted  (${omitted.length}): `) + names);
  }

  if (withMigrations.length > 0) {
    const names = withMigrations.map((t) => chalk.blue(t.displayName)).join(chalk.dim(' · '));
    console.log(chalk.blue.bold(`⬡ Migrated (${withMigrations.length}): `) + names);
  }

  if (stepResults.length > 0) {
    console.log('');
    for (const { step, ran } of stepResults) {
      console.log(ran ? chalk.green(`  ✓ ${step}`) : chalk.dim(`  ○ ${step} (skipped)`));
    }
  }

  console.log('');
}

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

    if (completionData) {
      printReport(completionData);
    }

    process.exit(0);
  });

program.parse();
