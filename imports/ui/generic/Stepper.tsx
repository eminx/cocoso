import React from 'react';
import { styled } from '/stitches.config';
import CheckIcon from 'lucide-react/dist/esm/icons/check';
import CircleIcon from 'lucide-react/dist/esm/icons/circle';
import DotIcon from 'lucide-react/dist/esm/icons/dot';

import { Box, Flex, Heading, Text } from '../core';

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
}

const StepperContainer = styled(Flex, {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '8',
  flexWrap: 'wrap',
});

const StepIndicator = styled(Box, {
  width: 32,
  height: 32,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f0f0f0',
});

const StepSeparator = styled(Box, {
  width: 2,
  height: 32,
  backgroundColor: '#e0e0e0',
});

const Stepper: React.FC<StepperProps> = ({ steps, activeStep }) => {
  return (
    <StepperContainer>
      {steps.map((step, index) => {
        const isComplete = index < activeStep;
        const isActive = index === activeStep;
        return (
          <Box key={step.title}>
            <Flex align="center">
              <StepIndicator>
                {isComplete ? (
                  <CheckIcon width={32} height={32} color="#4caf50" />
                ) : isActive ? (
                  <DotIcon width={32} height={32} color="#1976d2" />
                ) : (
                  <CircleIcon width={32} height={32} color="#bdbdbd" />
                )}
              </StepIndicator>
              <Heading
                as="h2"
                fontWeight={isActive ? 'bold' : 'lighter'}
                size="md"
              >
                {step.title}
              </Heading>
              {index < steps.length - 1 && <StepSeparator />}
            </Flex>
            <Box>
              {step.description && (
                <Text size="sm" color="#757575">
                  {step.description}
                </Text>
              )}
            </Box>
          </Box>
        );
      })}
    </StepperContainer>
  );
};

export default Stepper;
