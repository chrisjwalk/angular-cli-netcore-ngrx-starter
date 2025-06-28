import chalk from 'chalk';
import { ExecOptions, exec } from 'child_process';
import { program } from 'commander';
import fs from 'fs';
import inquirer from 'inquirer';

type MigrationsJson = {
  migrations: MigrationsJsonPackage[];
};

type MigrationsJsonPackage = {
  name: string;
  package: string;
  factory: string;
};

type NpmOudated = {
  [key: string]: {
    current: string;
    wanted: string;
    latest: string;
    dependent: string;
    location: string;
  };
};
const execAsync = (
  command: string,
  options: {
    encoding: BufferEncoding;
    ignoreExitCode?: boolean;
  } & ExecOptions = { encoding: 'utf8', ignoreExitCode: false },
) =>
  new Promise<string>((resolve, reject) =>
    exec(command, options, (error, stdout, stderr) => {
      // For commands like 'pnpm outdated', exit code 1 is expected when there are updates
      if (error && !options.ignoreExitCode) {
        reject(error);
      } else if (stderr && stderr.trim() !== '' && !options.ignoreExitCode) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    }),
  );

async function npmOutdated() {
  // pnpm outdated returns exit code 1 when there are updates, which is expected
  const stdout = await execAsync(`pnpm outdated --json`, {
    encoding: 'utf8',
    ignoreExitCode: true,
  });
  return stdout.toString().trim();
}

async function nxMigrateLatest(pkg: string, verbose: boolean, printCmd = true) {
  const cmd = `npx nx migrate ${pkg}${pkg ? '@' : ''}latest --verbose`;
  if (printCmd) {
    console.log(chalk.gray('─'.repeat(56)));
    console.log(chalk.bold('Running: ') + chalk.whiteBright(cmd));
  }
  const stdout = await execAsync(cmd, {
    encoding: 'utf8',
    ignoreExitCode: true,
  });
  if (verbose) {
    console.log(stdout);
  }
  const hasMigrations = stdout.includes('migrations.json has been generated');
  return hasMigrations;
}

async function mergeMigrations(verbose: boolean) {
  const src = `migrations.json`;
  const srcData = await fs.promises.readFile(src, 'utf8');
  const srcParsed = JSON.parse(srcData.toString()) as MigrationsJson;

  const dest = `migrations-merged.json`;
  let destParsed = { migrations: [] } as MigrationsJson;
  try {
    const destData = await fs.promises.readFile(dest, 'utf8');
    destParsed = JSON.parse(destData.toString()) as MigrationsJson;
  } catch (e) {
    if (verbose) {
      console.log(`${dest} does not exist`, e);
    }
  }

  const merged = {
    migrations: removeDuplicateMigrations([
      ...srcParsed.migrations,
      ...destParsed.migrations,
    ]),
  };

  if (verbose) {
    console.log('Merged migrations:');
    console.log(merged);
  }
  await fs.promises.writeFile(dest, JSON.stringify(merged, null, 2));
}

function removeDuplicateMigrations(migrations: MigrationsJsonPackage[]) {
  const uniqueMigrations = new Map<string, MigrationsJsonPackage>();

  migrations.forEach((migration) =>
    uniqueMigrations.set(migration.name, migration),
  );

  return Array.from(uniqueMigrations.values());
}

async function selectOmittedPackages(packages: string[]): Promise<string[]> {
  if (packages.length === 0) return [];
  const { omit } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'omit',
      message: 'Select packages to omit from update:',
      choices: packages,
    },
  ]);
  return omit;
}

async function main({ verbose, omit }: { verbose: boolean; omit: string[] }) {
  const sectionDivider = chalk.gray('─'.repeat(56));
  console.log(chalk.bold(' Nx Package Update Tool'));
  console.log(sectionDivider);
  if (verbose) {
    console.log(chalk.gray(`Verbose: ${verbose}`));
  }
  const data = await npmOutdated();
  const parsed = JSON.parse(data.toString()) as NpmOudated;
  let packages = Object.keys(parsed);

  // Interactive omit selection if not provided
  if (!omit || omit.length === 0) {
    const selectedOmit = await selectOmittedPackages(packages);
    omit = selectedOmit;
  }
  // Print summary of outdated packages
  console.log('\n' + chalk.bold('Outdated packages:'));
  if (packages.length === 0) {
    console.log(chalk.green('  None!'));
  } else {
    packages.forEach((p) => {
      const info = parsed[p];
      console.log(
        `  ${chalk.yellow(p)}: ${chalk.red(info.current)} ${chalk.gray('→')} ${chalk.green(info.latest)}`,
      );
    });
  }
  if (omit?.length) {
    console.log('\n' + chalk.bold('Omitting:'));
    omit.forEach((p) => console.log(`  ${chalk.gray(p)}`));
  }
  packages = packages.filter((p) => !omit.includes(p));
  if (packages.length === 0) {
    console.log('\n' + chalk.yellow('No packages to update.'));
    return;
  }
  console.log('\n' + chalk.bold('Packages to update:'));
  packages.forEach((p) => console.log(`  ${chalk.cyan(p)}`));

  const hasAngularCore = packages.some((p) => p.startsWith('@angular/core'));
  const hasAngularCLI = packages.some((p) => p.startsWith('@angular/cli'));

  const hasAngularMaterial = packages.some((p) =>
    p.startsWith('@angular/material'),
  );
  if (hasAngularCore || hasAngularMaterial || hasAngularCLI) {
    packages = packages.filter((p) => !p.startsWith('@angular/'));
    if (hasAngularMaterial) {
      packages.unshift('@angular/material');
    }
    if (hasAngularCLI) {
      packages.unshift('@angular/cli');
    }
    if (hasAngularCore) {
      packages.unshift('@angular/core');
    }
  }
  if (packages.some((p) => p.startsWith('@nx/') || p === 'nx')) {
    packages = packages.filter((p) => !p.startsWith('@nx/') || p === 'nx');
    packages.unshift('');
  }
  if (packages.length === 0) {
    console.log('\n' + chalk.yellow('No packages to update after grouping.'));
    return;
  }

  let migrationCommandsLength = 0;
  const updatedPackages: string[] = [];
  const migratedPackages: string[] = [];
  const migrationCommands: string[] = [];
  for (const pkg of packages) {
    let hasMigrations = false;
    const cmd = `npx nx migrate ${pkg}${pkg ? '@' : ''}latest --verbose`;
    migrationCommands.push(cmd);
    try {
      hasMigrations = await nxMigrateLatest(pkg, verbose, false); // don't print command in nxMigrateLatest
      updatedPackages.push(pkg);
    } catch (e) {
      if (verbose) {
        console.log(chalk.red(`Error running nx migrate for ${pkg}`), e);
      }
      continue;
    }
    if (hasMigrations) {
      if (verbose) {
        console.log(chalk.green(`${pkg} has migrations`));
      }
      await mergeMigrations(verbose);
      migrationCommandsLength++;
      migratedPackages.push(pkg);
    } else {
      if (verbose) {
        console.log(chalk.gray(`${pkg} has no migrations`));
      }
    }
  }

  if (migrationCommands.length) {
    console.log('\n' + chalk.bold('Running migration commands:'));
    console.log(sectionDivider);
    migrationCommands.forEach((cmd) => {
      console.log('   ' + chalk.whiteBright(cmd));
    });
    console.log(sectionDivider + '\n');
  }

  // Update summary header to match divider style
  console.log(chalk.bold(' Update Summary'));
  console.log(sectionDivider);
  if (updatedPackages.length) {
    console.log(chalk.green('Updated packages:'));
    updatedPackages.forEach((p) => console.log(`  ${chalk.green(p)}`));
  } else {
    console.log(chalk.yellow('No packages were updated.'));
  }
  if (omit?.length) {
    console.log('\n' + chalk.gray('Omitted packages:'));
    omit.forEach((p) => console.log(`  ${chalk.gray(p)}`));
  }
  if (migratedPackages.length) {
    console.log('\n' + chalk.blue('Migrations file generated for:'));
    migratedPackages.forEach((p) => console.log(`  ${chalk.blue(p)}`));
  } else {
    console.log('\n' + chalk.gray('No migrations were generated.'));
  }

  // Draw a box for next steps commands (no extra chars in the commands themselves)
  const boxWidth = 48;
  const boxTop = chalk.cyan('┌' + '─'.repeat(boxWidth - 2) + '┐');
  const boxBottom = chalk.cyan('└' + '─'.repeat(boxWidth - 2) + '┘');
  const pad = (cmd: string) => {
    const visibleLength = cmd.length;
    // Remove the +1 in padEnd, and use exact padding
    return (
      ' ' + cmd + ' '.repeat(Math.max(0, boxWidth - 4 - visibleLength)) + ' '
    );
  };
  const nextSteps: string[] = ['pnpm install --no-frozen-lockfile'];
  if (migrationCommandsLength > 0) {
    await fs.promises.unlink('migrations.json');
    await fs.promises.rename('migrations-merged.json', 'migrations.json');
    nextSteps.push('npx nx migrate --run-migrations');
  }
  console.log('\n' + chalk.bold('Next steps:'));
  console.log(boxTop);
  nextSteps.forEach((cmd) =>
    console.log(chalk.cyan('│') + pad(cmd) + chalk.cyan('│')),
  );
  console.log(boxBottom);
}

program
  .option('-o, --omit [omit...]', 'Omit packages', [])
  .option('-v, --verbose [verbose]', 'Verbose', false)
  .action((options) => main(options));

program.parse();
