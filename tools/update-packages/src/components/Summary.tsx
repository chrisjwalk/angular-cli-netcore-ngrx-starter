import { Box, Text } from 'ink';
import React from 'react';
import type { MigrationTask } from '../lib.js';

interface SummaryProps {
  tasks: MigrationTask[];
  omitted: string[];
  hasMigrationFile: boolean;
}

function TagList({ items, color }: { items: string[]; color: string }) {
  return (
    <Box gap={1} flexWrap="wrap">
      {items.map((item, i) => (
        <React.Fragment key={item}>
          <Text color={color as Parameters<typeof Text>[0]['color']}>{item}</Text>
          {i < items.length - 1 && <Text dimColor>·</Text>}
        </React.Fragment>
      ))}
    </Box>
  );
}

export function Summary({ tasks, omitted, hasMigrationFile }: SummaryProps) {
  const updated = tasks.filter((t) => t.status === 'done').map((t) => t.displayName);
  const failed = tasks.filter((t) => t.status === 'error').map((t) => t.displayName);
  const withMigrations = tasks.filter((t) => t.status === 'done' && t.hasMigrations).map((t) => t.displayName);

  return (
    <Box flexDirection="column" gap={1}>
      <Box>
        <Text bold>Update Summary </Text>
        <Text dimColor>{'─'.repeat(40)}</Text>
      </Box>

      {updated.length > 0 ? (
        <Box gap={1}>
          <Text color="green" bold>{`✓ Updated (${updated.length}):`}</Text>
          <TagList items={updated} color="green" />
        </Box>
      ) : (
        <Text color="yellow">No packages were updated.</Text>
      )}

      {failed.length > 0 && (
        <Box gap={1}>
          <Text color="red" bold>{`✗ Failed (${failed.length}):`}</Text>
          <TagList items={failed} color="red" />
        </Box>
      )}

      {omitted.length > 0 && (
        <Box gap={1}>
          <Text dimColor bold>{`○ Omitted (${omitted.length}):`}</Text>
          <TagList items={omitted} color="gray" />
        </Box>
      )}

      {withMigrations.length > 0 ? (
        <Box gap={1}>
          <Text color="blue" bold>{`⬡ Migrations (${withMigrations.length}):`}</Text>
          <TagList items={withMigrations} color="blue" />
        </Box>
      ) : (
        !hasMigrationFile && <Text dimColor>No migrations generated.</Text>
      )}
    </Box>
  );
}
