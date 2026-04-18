import { Spinner } from '@inkjs/ui';
import { Box, Static, Text } from 'ink';
import React from 'react';
import type { MigrationTask } from '../lib.js';

interface MigrationProgressProps {
  tasks: MigrationTask[];
}

function CompletedTaskRow({ task }: { task: MigrationTask }) {
  const isError = task.status === 'error';
  const color = isError ? 'red' : task.hasMigrations ? 'blue' : 'green';
  return (
    <Box gap={2}>
      <Text color={color}>{isError ? '✗' : '✓'}</Text>
      <Text color={color}>
        {task.displayName}
        {task.hasMigrations ? ' (migrations)' : ''}
      </Text>
      {isError && task.error && <Text dimColor>  {task.error}</Text>}
    </Box>
  );
}

export function MigrationProgress({ tasks }: MigrationProgressProps) {
  const completedTasks = tasks.filter((t) => t.status === 'done' || t.status === 'error');
  const runningTask = tasks.find((t) => t.status === 'running');
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const total = tasks.length;

  return (
    <>
      <Static items={completedTasks}>
        {(task) => <CompletedTaskRow key={task.id} task={task} />}
      </Static>
      <Box flexDirection="column" paddingY={1} gap={1}>
        <Box gap={1}>
          <Text bold>Migrating packages</Text>
          <Text dimColor>[{completedTasks.length}/{total}]</Text>
        </Box>
        {runningTask ? (
          <Spinner label={runningTask.displayName} />
        ) : pendingCount > 0 ? (
          <Text dimColor>Preparing…</Text>
        ) : null}
      </Box>
    </>
  );
}
