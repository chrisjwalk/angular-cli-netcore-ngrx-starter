import { Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import React from 'react';
import type { MigrationTask } from '../lib.js';

interface MigrationProgressProps {
  tasks: MigrationTask[];
}

function TaskRow({ task }: { task: MigrationTask }) {
  if (task.status === 'running') {
    return <Spinner label={task.displayName} />;
  }
  if (task.status === 'done') {
    const color = task.hasMigrations ? 'blue' : 'green';
    return (
      <Text color={color}>
        ✓ {task.displayName}
        {task.hasMigrations ? ' (migrations)' : ''}
      </Text>
    );
  }
  if (task.status === 'error') {
    return (
      <Box gap={2}>
        <Text color="red">✗ {task.displayName}</Text>
        {task.error && <Text dimColor>{task.error}</Text>}
      </Box>
    );
  }
  return <Text dimColor>  {task.displayName}</Text>;
}

export function MigrationProgress({ tasks }: MigrationProgressProps) {
  const done = tasks.filter((t) => t.status === 'done' || t.status === 'error').length;
  const total = tasks.length;

  return (
    <Box flexDirection="column" paddingY={1} gap={1}>
      <Box gap={1}>
        <Text bold>Migrating packages</Text>
        <Text dimColor>[{done}/{total}]</Text>
      </Box>
      <Box flexDirection="column">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </Box>
    </Box>
  );
}
