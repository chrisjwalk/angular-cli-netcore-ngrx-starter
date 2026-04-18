import { Spinner } from '@inkjs/ui';
import { Box, Static, Text } from 'ink';
import React from 'react';
import type { MigrationTask } from '../lib.js';

interface MigrationProgressProps {
  tasks: MigrationTask[];
}

export function MigrationProgress({ tasks }: MigrationProgressProps) {
  const completedTasks = tasks.filter((t) => t.status === 'done' || t.status === 'error');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const runningTask = tasks.find((t) => t.status === 'running');
  const total = tasks.length;

  return (
    <>
      {/* Completed tasks scroll up into the permanent scroll buffer. */}
      <Static items={completedTasks}>
        {(task) => {
          const color = task.status === 'error' ? 'red' : task.hasMigrations ? 'blue' : 'green';
          return (
            <Box key={task.id} gap={1}>
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

      {/* Live area: spinner for running task, then pending queue, then counter. */}
      <Box flexDirection="column" marginTop={1}>
        {runningTask && <Spinner label={runningTask.displayName} />}
        {pendingTasks.map((task) => (
          <Box key={task.id} gap={1}>
            <Text> </Text>
            <Text dimColor>{task.displayName}</Text>
          </Box>
        ))}
        <Box gap={1} marginTop={1}>
          <Text bold>Migrating packages</Text>
          <Text dimColor>[{completedTasks.length}/{total}]</Text>
        </Box>
      </Box>
    </>
  );
}

