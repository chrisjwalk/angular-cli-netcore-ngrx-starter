import { MultiSelect, Spinner } from '@inkjs/ui';
import { Box, Text, useApp } from 'ink';
import React, { useEffect, useState } from 'react';
import { MigrationProgress } from './components/MigrationProgress.js';
import { NextStepsRunner } from './components/NextStepsRunner.js';
import { PackageTable } from './components/PackageTable.js';
import {
  type MigrationTask,
  type PackageInfo,
  buildMigrationQueue,
  fetchOutdatedPackages,
  finalizeMigrations,
  mergeMigrations,
  nxMigrate,
} from './lib.js';

type Phase =
  | { type: 'loading' }
  | { type: 'omit-select'; packages: PackageInfo[] }
  | { type: 'migrating'; tasks: MigrationTask[]; omitted: string[] }
  | { type: 'next-steps'; tasks: MigrationTask[]; omitted: string[]; nextSteps: string[] };

export interface AppOptions {
  omit: string[];
  interactive: boolean;
}

export interface StepResult {
  step: string;
  ran: boolean;
}

export interface CompletionData {
  tasks: MigrationTask[];
  omitted: string[];
  stepResults: StepResult[];
}

interface AppProps {
  options: AppOptions;
  onComplete: (data: CompletionData) => void;
}

export function App({ options, onComplete }: AppProps) {
  const { exit } = useApp();
  const [phase, setPhase] = useState<Phase>({ type: 'loading' });
  const [error, setError] = useState<string | null>(null);

  // Phase: load outdated packages
  useEffect(() => {
    if (phase.type !== 'loading') {return;}
    fetchOutdatedPackages()
      .then((packages) => {
        if (packages.length === 0) {
          setError('No outdated packages found.');
          return;
        }

        const hasCliOmit = options.omit.length > 0;
        if (!options.interactive || hasCliOmit) {
          startMigration(packages, options.omit);
        } else {
          setPhase({ type: 'omit-select', packages });
        }
      })
      .catch((e) => setError(String(e)));
  }, [phase.type]);

  // Phase: run migrations sequentially
  useEffect(() => {
    if (phase.type !== 'migrating') {return;}
    const { tasks, omitted } = phase;

    (async () => {
      let hasMigrationFile = false;

      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        setPhase((prev) => {
          if (prev.type !== 'migrating') {return prev;}
          return {
            ...prev,
            tasks: prev.tasks.map((t) => (t.id === task.id ? { ...t, status: 'running' } : t)),
          };
        });

        try {
          const hasMigrations = await nxMigrate(task.pkg);
          if (hasMigrations) {
            await mergeMigrations();
            hasMigrationFile = true;
          }
          setPhase((prev) => {
            if (prev.type !== 'migrating') {return prev;}
            return {
              ...prev,
              tasks: prev.tasks.map((t) =>
                t.id === task.id ? { ...t, status: 'done', hasMigrations } : t,
              ),
            };
          });
        } catch (e) {
          setPhase((prev) => {
            if (prev.type !== 'migrating') {return prev;}
            return {
              ...prev,
              tasks: prev.tasks.map((t) =>
                t.id === task.id ? { ...t, status: 'error', error: String(e) } : t,
              ),
            };
          });
        }
      }

      if (hasMigrationFile) {
        await finalizeMigrations();
      }

      const nextSteps = ['pnpm install --no-frozen-lockfile'];
      if (hasMigrationFile) {nextSteps.push('npx nx migrate --run-migrations');}

      setPhase((prev) => {
        if (prev.type !== 'migrating') {return prev;}
        return { type: 'next-steps', tasks: prev.tasks, omitted, nextSteps };
      });
    })();
  }, [phase.type]);

  function startMigration(packages: PackageInfo[], omit: string[]) {
    const toUpdate = packages.filter((p) => !omit.includes(p.name));
    const tasks = buildMigrationQueue(toUpdate);
    setPhase({ type: 'migrating', tasks, omitted: omit });
  }

  if (error) {
    return (
      <Box paddingY={1}>
        <Text color="red">✗ </Text>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  if (phase.type === 'loading') {
    return (
      <Box paddingY={1}>
        <Spinner label="Checking for outdated packages..." />
      </Box>
    );
  }

  if (phase.type === 'omit-select') {
    const { packages } = phase;
    return (
      <Box flexDirection="column" gap={1} paddingY={1}>
        <Text bold>Outdated Packages</Text>
        <PackageTable packages={packages} />
        <Box marginTop={1} flexDirection="column">
          <Text bold>Select packages to omit </Text>
          <Text dimColor>(space to toggle · enter to confirm)</Text>
        </Box>
        <MultiSelect
          options={packages.map((p) => ({
            label: `${p.name}  ${p.current} → ${p.latest}`,
            value: p.name,
          }))}
          onSubmit={(selected) => startMigration(packages, selected)}
        />
      </Box>
    );
  }

  if (phase.type === 'migrating') {
    return (
      <Box paddingY={1}>
        <MigrationProgress tasks={phase.tasks} />
      </Box>
    );
  }

  // phase === 'next-steps'
  const { tasks, omitted, nextSteps } = phase;
  return (
    <Box flexDirection="column" gap={1} paddingY={1}>
      <MigrationProgress tasks={tasks} />
      <NextStepsRunner
        steps={nextSteps}
        interactive={options.interactive}
        onDone={(stepResults) => {
          onComplete({ tasks, omitted, stepResults });
          exit();
        }}
      />
    </Box>
  );
}
