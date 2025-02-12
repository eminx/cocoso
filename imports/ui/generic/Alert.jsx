import React from 'react';
import {
  Alert as CAlert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  Box,
  CloseButton,
} from '@chakra-ui/react';

export default function Alert({
  isClosable,
  message,
  title,
  type = 'error',
  children,
  ...otherProps
}) {
  return (
    <Box w="100%" maxW="500px">
      <CAlert status={type} {...otherProps}>
        <AlertIcon />
        <Box flex="1">
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription display="block">{children || message}</AlertDescription>
        </Box>
        {isClosable && <CloseButton position="absolute" right="8px" top="8px" />}
      </CAlert>
    </Box>
  );
}
