import { ExecOptions, exec } from 'child_process';
import { program } from 'commander';
import fs from 'fs';

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
  } & ExecOptions = { encoding: 'utf8' },
) =>
  new Promise<string>((resolve, reject) =>
    exec(command, options, (error, stdout, stderr) =>
      stderr !== '' ? reject(stderr) : resolve(stdout),
    ),
  );

async function npmOutdated() {
  const stdout = await execAsync(`pnpm outdated --json`);
  return stdout.toString().trim();
}

async function nxMigrateLatest(pkg: string, verbose: boolean) {
  const cmd = `npx nx migrate ${pkg}${pkg ? '@' : ''}latest`;
  console.log(cmd);
  const stdout = await execAsync(cmd);
  if (verbose) {
    console.log(stdout);
  }
  const hasMigrateions = stdout.includes('migrations.json has been generated');
  return hasMigrateions;
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

async function main({ verbose, omit }: { verbose: boolean; omit: string[] }) {
  console.log(`Updating packages...`);
  if (omit?.length) {
    console.log(`Omitting: ${omit}`);
  }
  if (verbose) {
    console.log(`Verbose: ${verbose}`);
  }
  const data = await npmOutdated();
  const parsed = JSON.parse(data.toString()) as NpmOudated;
  let packages = Object.keys(parsed).filter((p) => !omit.includes(p));
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
    console.log('No packages to update');
    return;
  }
  let migrationCommandsLength = 0;
  for (const pkg of packages) {
    const hasMigrateions = await nxMigrateLatest(pkg, verbose);
    if (hasMigrateions) {
      if (verbose) {
        console.log(`${pkg} has migrations`);
      }
      await mergeMigrations(verbose);
      migrationCommandsLength++;
    } else {
      if (verbose) {
        console.log(`${pkg} has no migrations`);
      }
    }
  }

  console.log('pnpm install');
  if (migrationCommandsLength === 0) {
    console.log('No migrations to run');
  } else {
    await fs.promises.unlink('migrations.json');
    await fs.promises.rename('migrations-merged.json', 'migrations.json');
    console.log(`npx nx migrate --run-migrations`);
  }
}

program
  .option('-o, --omit [omit...]', 'Omit packages', [])
  .option('-v, --verbose [verbose]', 'Verbose', false)
  .action((options) => main(options));

program.parse();
