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
      {/* Completed tasks scroll into terminal history — one line committed
          per completion, matching the one line removed from the live area,
          so the cursor row stays fixed and the footer truly stays pinned. */}
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

      {/* Live area: running + pending shrink from top as items complete.
          Footer MUST be last so it occupies the fixed bottom cursor row. */}
      <Box flexDirection="column">
        {runningTask && <Spinner label={runningTask.displayName} />}
        {pendingTasks.map((task) => (
          <Text key={task.id} dimColor>
            {'  '}
            {task.displayName}
          </Text>
        ))}
        <Box gap={1} marginTop={1}>
          <Text bold>Migrating packages</Text>
          <Text dimColor>[{completedTasks.length}/{total}]</Text>
        </Box>
      </Box>
    </>
  );
}

