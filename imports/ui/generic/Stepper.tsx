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
  gap: 32,
});

const StepItem = styled(Flex, {
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  position: 'relative',
});

const StepIndicator = styled(Box, {
  width: 32,
  height: 32,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f0f0f0',
  marginBottom: 8,
});

const StepSeparator = styled(Box, {
  position: 'absolute',
  top: 16,
  left: '100%',
  width: 32,
  height: 2,
  backgroundColor: '#e0e0e0',
  zIndex: 0,
});

const StepContent = styled(Box, {
  textAlign: 'center',
});

const Stepper: React.FC<StepperProps> = ({ steps, activeStep }) => {
  return (
    <StepperContainer>
      {steps.map((step, index) => {
        const isComplete = index < activeStep;
        const isActive = index === activeStep;
        return (
          <StepItem key={step.title}>
            <StepIndicator>
              {isComplete ? (
                <CheckIcon width={20} height={20} color="#4caf50" />
              ) : isActive ? (
                <DotIcon width={20} height={20} color="#1976d2" />
              ) : (
                <CircleIcon width={20} height={20} color="#bdbdbd" />
              )}
            </StepIndicator>
            {index < steps.length - 1 && <StepSeparator />}
            <StepContent>
              <Heading as="h4" size="md">
                {step.title}
              </Heading>
              <Box style={{ marginBottom: '8px' }} />
              {step.description && (
                <Text size="sm" color="#757575">
                  {step.description}
                </Text>
              )}
            </StepContent>
          </StepItem>
        );
      })}
    </StepperContainer>
  );
};

export default Stepper;
