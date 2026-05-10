import { exec, type ExecOptions } from 'child_process';

export type PackageInfo = {
  name: string;
  current: string;
  latest: string;
  isMajor: boolean;
};

export function isMajorBump(current: string, latest: string): boolean {
  const currentMajor = parseInt(current.split('.')[0], 10);
  const latestMajor = parseInt(latest.split('.')[0], 10);
  return (
    !isNaN(currentMajor) && !isNaN(latestMajor) && latestMajor > currentMajor
  );
}

export type MigrationTask = {
  id: string;
  pkg: string;
  displayName: string;
  status: 'pending' | 'running' | 'done' | 'error';
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

export function extractJsonObject(raw: string): string {
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
    isMajor: isMajorBump(info.current, info.latest),
  }));
}

export async function pnpmUpdate(pkg: string): Promise<void> {
  const cmd = `pnpm up --latest ${pkg}`;
  await execAsync(cmd, { encoding: 'utf8' });
}

/**
 * Builds the ordered update queue from a list of packages to update.
 * - @angular/core, @angular/cli, @angular/material → first among Angular
 * - other @angular/* packages → next
 * - everything else in input order
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
    });
  };

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
