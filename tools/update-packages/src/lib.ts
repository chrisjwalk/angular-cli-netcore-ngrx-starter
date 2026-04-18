import { exec, type ExecOptions } from 'child_process';
import fs from 'fs';

export type PackageInfo = {
  name: string;
  current: string;
  latest: string;
};

export type MigrationTask = {
  id: string;
  pkg: string;
  displayName: string;
  status: 'pending' | 'running' | 'done' | 'error';
  hasMigrations: boolean;
  error?: string;
};

type NpmOutdated = {
  [key: string]: {
    current: string;
    wanted: string;
    latest: string;
    dependent: string;
    location: string;
  };
};

type MigrationsJson = {
  migrations: MigrationsJsonPackage[];
};

type MigrationsJsonPackage = {
  name: string;
  package: string;
  factory: string;
};

export function execAsync(
  command: string,
  options: {
    encoding: BufferEncoding;
    ignoreExitCode?: boolean;
  } & ExecOptions = {
    encoding: 'utf8',
    ignoreExitCode: false,
  },
): Promise<string> {
  return new Promise((resolve, reject) =>
    exec(command, options, (error, stdout, stderr) => {
      if (error && !options.ignoreExitCode) {
        reject(error);
      } else if (stderr?.trim() && !options.ignoreExitCode) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    }),
  );
}

function extractJsonObject(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return '{}';
  }
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first === -1 || last === -1 || last < first) {
    throw new Error('Could not find JSON object in pnpm outdated output.');
  }
  return trimmed.slice(first, last + 1);
}

export async function fetchOutdatedPackages(): Promise<PackageInfo[]> {
  const stdout = await execAsync('pnpm outdated --json', {
    encoding: 'utf8',
    ignoreExitCode: true,
  });
  const json = extractJsonObject(stdout.trim());
  const parsed = JSON.parse(json) as NpmOutdated;
  return Object.entries(parsed).map(([name, info]) => ({
    name,
    current: info.current,
    latest: info.latest,
  }));
}

export async function nxMigrate(pkg: string): Promise<boolean> {
  const cmd = `npx nx migrate ${pkg}${pkg ? '@' : ''}latest`;
  const stdout = await execAsync(cmd, {
    encoding: 'utf8',
    ignoreExitCode: true,
  });
  return stdout.includes('migrations.json has been generated');
}

function removeDuplicateMigrations(migrations: MigrationsJsonPackage[]) {
  const unique = new Map<string, MigrationsJsonPackage>();
  migrations.forEach((m) => unique.set(m.name, m));
  return Array.from(unique.values());
}

export async function mergeMigrations(): Promise<void> {
  const srcData = await fs.promises.readFile('migrations.json', 'utf8');
  const src = JSON.parse(srcData) as MigrationsJson;

  let dest: MigrationsJson = { migrations: [] };
  try {
    const destData = await fs.promises.readFile(
      'migrations-merged.json',
      'utf8',
    );
    dest = JSON.parse(destData) as MigrationsJson;
  } catch {
    // file doesn't exist yet
  }

  const merged = {
    migrations: removeDuplicateMigrations([
      ...src.migrations,
      ...dest.migrations,
    ]),
  };
  await fs.promises.writeFile(
    'migrations-merged.json',
    JSON.stringify(merged, null, 2),
  );
}

export async function finalizeMigrations(): Promise<void> {
  await fs.promises.unlink('migrations.json');
  await fs.promises.rename('migrations-merged.json', 'migrations.json');
}

/**
 * Builds the ordered migration queue from a list of packages to update.
 * - nx packages → single "nx migrate latest" run (pkg = '')
 * - @angular/core, @angular/cli, @angular/material → first among Angular
 * - everything else alphabetically
 */
export function buildMigrationQueue(packages: PackageInfo[]): MigrationTask[] {
  const tasks: MigrationTask[] = [];
  const names = new Set(packages.map((p) => p.name));
  const used = new Set<string>();

  const add = (name: string, pkg: string, displayName: string) => {
    if (used.has(name)) {
      return;
    }
    used.add(name);
    tasks.push({
      id: name,
      pkg,
      displayName,
      status: 'pending',
      hasMigrations: false,
    });
  };

  const hasNx = packages.some(
    (p) => p.name === 'nx' || p.name.startsWith('@nx/'),
  );
  if (hasNx) {
    const nxInfo = packages.find((p) => p.name === 'nx');
    add(
      '__nx__',
      '',
      nxInfo ? `nx ${nxInfo.current} → ${nxInfo.latest}` : 'nx (all)',
    );
    packages
      .filter((p) => p.name.startsWith('@nx/'))
      .forEach((p) => used.add(p.name));
    if (nxInfo) {
      used.add('nx');
    }
  }

  for (const priority of [
    '@angular/core',
    '@angular/cli',
    '@angular/material',
  ]) {
    if (names.has(priority)) {
      add(priority, priority, priority);
    }
  }

  for (const p of packages) {
    if (p.name.startsWith('@angular/') && !used.has(p.name)) {
      add(p.name, p.name, p.name);
    }
  }

  for (const p of packages) {
    if (!used.has(p.name)) {
      add(p.name, p.name, p.name);
    }
  }

  return tasks;
}
