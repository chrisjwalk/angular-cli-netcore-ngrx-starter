import { Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import React from 'react';
import type { MigrationTask } from '../lib.js';

interface MigrationProgressProps {
  tasks: MigrationTask[];
}

export function MigrationProgress({ tasks }: MigrationProgressProps) {
  const completedCount = tasks.filter((t) => t.status === 'done' || t.status === 'error').length;
  const runningTask = tasks.find((t) => t.status === 'running');
  const total = tasks.length;

  return (
    <Box flexDirection="column" marginTop={1}>
      {tasks.map((task) => {
        if (task.status === 'done' || task.status === 'error') {
          const color = task.status === 'error' ? 'red' : task.hasMigrations ? 'blue' : 'green';
          return (
            <Box key={task.id} gap={1}>
              <Text color={color}>{task.status === 'error' ? '✗' : '✓'}</Text>
              <Text color={color}>
                {task.displayName}
                {task.hasMigrations ? ' (migrations)' : ''}
              </Text>
              {task.status === 'error' && task.error && (
                <Text dimColor>{task.error}</Text>
              )}
            </Box>
          );
        }
        if (task.status === 'running') {
          return (
            <Box key={task.id} gap={1}>
              <Text color="yellow">◆</Text>
              <Text color="yellow">{task.displayName}</Text>
            </Box>
          );
        }
        return (
          <Box key={task.id} gap={1}>
            <Text> </Text>
            <Text dimColor>{task.displayName}</Text>
          </Box>
        );
      })}
      <Box gap={1} marginTop={1}>
        <Text bold>Migrating packages</Text>
        <Text dimColor>[{completedCount}/{total}]</Text>
      </Box>
      {runningTask && <Spinner label={runningTask.displayName} />}
    </Box>
  );
}

