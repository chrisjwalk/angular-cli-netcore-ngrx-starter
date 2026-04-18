import { ConfirmInput, Spinner } from '@inkjs/ui';
import { Box, Text } from 'ink';
import React, { useEffect, useState } from 'react';
import type { StepResult } from '../App.js';
import { execAsync } from '../lib.js';

interface NextStepsRunnerProps {
  steps: string[];
  interactive: boolean;
  onDone: (results: StepResult[]) => void;
}

type StepState = 'pending' | 'confirming' | 'running' | 'done' | 'skipped';

export function NextStepsRunner({ steps, interactive, onDone }: NextStepsRunnerProps) {
  const [index, setIndex] = useState(0);
  const [stepStates, setStepStates] = useState<StepState[]>(steps.map(() => 'pending'));

  const updateState = (i: number, state: StepState) => {
    setStepStates((prev) => prev.map((s, idx) => (idx === i ? state : s)));
  };

  useEffect(() => {
    if (index >= steps.length) {
      const results: StepResult[] = steps.map((step, i) => ({
        step,
        ran: stepStates[i] === 'done',
      }));
      onDone(results);
      return;
    }

    if (!interactive) {
      updateState(index, 'skipped');
      setIndex((i) => i + 1);
      return;
    }

    updateState(index, 'confirming');
  }, [index]);

  const advance = (state: StepState) => {
    updateState(index, state);
    setIndex((i) => i + 1);
  };

  const handleConfirm = async () => {
    updateState(index, 'running');
    try {
      await execAsync(steps[index], { encoding: 'utf8', ignoreExitCode: true });
      advance('done');
    } catch {
      advance('done');
    }
  };

  return (
    <Box flexDirection="column" gap={1}>
      <Box>
        <Text bold>Next Steps </Text>
        <Text dimColor>{'─'.repeat(42)}</Text>
      </Box>

      {steps.map((step, i) => {
        const state = stepStates[i];
        return (
          <Box key={step} flexDirection="column">
            <Box gap={2}>
              {state === 'running' ? (
                <Spinner label={step} />
              ) : state === 'done' ? (
                <Text color="green">✓ {step}</Text>
              ) : state === 'skipped' ? (
                <Text dimColor>○ {step}</Text>
              ) : state === 'confirming' ? (
                <Box gap={1}>
                  <Text color="cyan">$ {step}</Text>
                </Box>
              ) : (
                <Text dimColor>  {step}</Text>
              )}
            </Box>

            {state === 'confirming' && i === index && (
              <Box marginLeft={2}>
                <ConfirmInput
                  defaultChoice="confirm"
                  onConfirm={handleConfirm}
                  onCancel={() => advance('skipped')}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
