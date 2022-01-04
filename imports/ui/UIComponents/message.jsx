import React from 'react';
import {
  Alert as CAlert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Center,
  CloseButton,
  createStandaloneToast,
} from '@chakra-ui/react';

import { chakraTheme } from '../constants/theme';

const timeOutTime = 5;

const Alert = ({
  children,
  isClosable,
  message,
  type = 'error',
  ...otherProps
}) => {
  const success = type === 'success';
  const info = type === 'info';
  const warning = type === 'warning';

  return (
    <Center w="100%">
      <Box>
        <CAlert status={type} {...otherProps}>
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>
              {success
                ? 'Success!'
                : info
                ? 'Info'
                : warning
                ? 'Warning'
                : 'Error'}
            </AlertTitle>
            <AlertDescription display="block">
              {children || message}
            </AlertDescription>
          </Box>
          {isClosable && (
            <CloseButton position="absolute" right="8px" top="8px" />
          )}
        </CAlert>
      </Box>
    </Center>
  );
};

const toast = createStandaloneToast({ theme: chakraTheme });

const renderToast = (status, text, duration) => {
  toast({
    description: text,
    duration: (duration || timeOutTime) * 1000,
    isClosable: true,
    position: 'top',
    status: status,
  });
};

const message = {
  success: (text, duration) => renderToast('success', text, duration * 1000),

  error: (text, duration) => renderToast('error', text, duration),

  info: (text, duration = timeOutTime) => renderToast('info', text, duration),
};

export { message, Alert };
