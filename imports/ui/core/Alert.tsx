import React from 'react';
import { styled } from 'restyle';
import AlertIcon from 'lucide-react/dist/esm/icons/alert-circle';
import InfoIcon from 'lucide-react/dist/esm/icons/info';
import WarningIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import CheckIcon from 'lucide-react/dist/esm/icons/check';

import { Box, Flex } from './Box';

const alertColors = {
  info: '#3182CE',
  warning: '#DD6B20',
  success: '#38A169',
  error: '#E53E3E',
};

const AlertTitle = styled('h3', {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
});

const AlertDescription = styled('div', {
  fontSize: '1.25rem',
});

// AlertContainer
interface AlertContainerProps {
  status?: 'info' | 'warning' | 'success' | 'error';
}

const AlertContainer = styled('div', (props: AlertContainerProps) => {
  const color =
    props.status === 'error'
      ? 'red'
      : props.status === 'warning'
      ? 'orange'
      : props.status === 'success'
      ? 'green'
      : 'blue';

  return {
    padding: '1rem',
    borderRadius: 'var(--cocoso-border-radius)',
    backgroundColor: `var(--cocoso-colors-${color}-50)`,
    border: '1px solid',
    borderColor: `var(--cocoso-colors-${color}-300)`,
    color: `var(--cocoso-colors-${color}-700)`,
  };
});

interface AlertProps {
  message?: string | React.ReactNode;
  title?: string | React.ReactNode;
  type?: 'info' | 'warning' | 'success' | 'error';
  children?: React.ReactNode;
}

export default function Alert({
  message,
  title,
  type = 'info',
  children,
  ...props
}: AlertProps) {
  return (
    <AlertContainer status={type} {...props}>
      <Flex>
        {type === 'info' && <InfoIcon color={alertColors[type]} />}
        {type === 'warning' && (
          <WarningIcon color={alertColors[type]} />
        )}
        {type === 'success' && <CheckIcon color={alertColors[type]} />}
        {type === 'error' && <AlertIcon color={alertColors[type]} />}
        <Box>
          {title && <AlertTitle>{title}</AlertTitle>}
          {(message || children) && (
            <AlertDescription>{message || children}</AlertDescription>
          )}
        </Box>
      </Flex>
    </AlertContainer>
  );
}
