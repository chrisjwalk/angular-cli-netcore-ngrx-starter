import { Box, Text } from 'ink';
import React from 'react';
import type { PackageInfo } from '../lib.js';

interface PackageTableProps {
  packages: PackageInfo[];
}

export function PackageTable({ packages }: PackageTableProps) {
  if (packages.length === 0) {
    return (
      <Box>
        <Text color="green">✓ All packages are up to date</Text>
      </Box>
    );
  }

  const nameWidth = Math.max(7, ...packages.map((p) => p.name.length));
  const currentWidth = Math.max(7, ...packages.map((p) => p.current.length));

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold color="white">
          {'Package'.padEnd(nameWidth + 2)}
        </Text>
        <Text bold color="white">
          {'Current'.padEnd(currentWidth + 2)}
        </Text>
        <Text bold color="white">
          Latest
        </Text>
      </Box>
      <Box>
        <Text dimColor>{'─'.repeat(nameWidth + currentWidth + 16)}</Text>
      </Box>
      {packages.map((pkg) => (
        <Box key={pkg.name}>
          <Text color="cyan">{pkg.name.padEnd(nameWidth + 2)}</Text>
          <Text color="red">{pkg.current.padEnd(currentWidth + 2)}</Text>
          <Text dimColor>→ </Text>
          <Text color={pkg.isMajor ? 'yellow' : 'green'}>{pkg.latest}</Text>
          {pkg.isMajor && <Text color="yellow"> MAJOR</Text>}
        </Box>
      ))}
    </Box>
  );
}
