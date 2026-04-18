import { Spinner } from '@inkjs/ui';
import { Box, Static, Text } from 'ink';
import React from 'react';
import type { MigrationTask } from '../lib.js';

interface MigrationProgressProps {
  tasks: MigrationTask[];
}

export function MigrationProgress({ tasks }: MigrationProgressProps) {
  const completedTasks = tasks.filter((t) => t.status === 'done' || t.status === 'error');
  const runningTask = tasks.find((t) => t.status === 'running');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const total = tasks.length;

  return (
    <>
      <Static items={completedTasks}>
        {(task) => {
          const color = task.status === 'error' ? 'red' : task.hasMigrations ? 'blue' : 'green';
          return (
            <Box key={task.id} gap={2}>
              <Text color={color}>{task.status === 'error' ? '✗' : '✓'}</Text>
              <Text color={color}>
                {task.displayName}
                {task.hasMigrations ? ' (migrations)' : ''}
              </Text>
              {task.status === 'error' && task.error && <Text dimColor>{task.error}</Text>}
            </Box>
          );
        }}
      </Static>

      <Box flexDirection="column" paddingY={1} gap={1}>
        <Box gap={1}>
          <Text bold>Migrating packages</Text>
          <Text dimColor>[{completedTasks.length}/{total}]</Text>
        </Box>
        <Box flexDirection="column">
          {runningTask && <Spinner label={runningTask.displayName} />}
          {pendingTasks.map((task) => (
            <Text key={task.id} dimColor>
              {'  '}
              {task.displayName}
            </Text>
          ))}
        </Box>
      </Box>
    </>
  );
}
