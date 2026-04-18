import { Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import React from 'react';
import type { MigrationTask } from '../lib.js';

interface MigrationProgressProps {
  tasks: MigrationTask[];
}

function StatusIcon({ task }: { task: MigrationTask }) {
  switch (task.status) {
    case 'running':
      return <Spinner label="" />;
    case 'done':
      return <Text color={task.hasMigrations ? 'blue' : 'green'}>✓</Text>;
    case 'error':
      return <Text color="red">✗</Text>;
    default:
      return <Text dimColor>○</Text>;
  }
}

function TaskLabel({ task }: { task: MigrationTask }) {
  switch (task.status) {
    case 'done':
      return (
        <Box>
          <Text color={task.hasMigrations ? 'blue' : 'green'}>{task.displayName}</Text>
          {task.hasMigrations && (
            <Text dimColor> (migrations generated)</Text>
          )}
        </Box>
      );
    case 'error':
      return (
        <Box flexDirection="column">
          <Text color="red">{task.displayName}</Text>
          {task.error && <Text color="red" dimColor>  {task.error}</Text>}
        </Box>
      );
    case 'running':
      return <Text color="cyan">{task.displayName}</Text>;
    default:
      return <Text dimColor>{task.displayName}</Text>;
  }
}

export function MigrationProgress({ tasks }: MigrationProgressProps) {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>Running migrations</Text>
      <Box flexDirection="column">
        {tasks.map((task) => (
          <Box key={task.id} gap={2}>
            <StatusIcon task={task} />
            <TaskLabel task={task} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
