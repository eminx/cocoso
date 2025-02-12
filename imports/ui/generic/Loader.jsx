import React from 'react';
import { Box, Progress } from '@chakra-ui/react';

export default function Loader({ relative = true, ...props }) {
  return (
    <Box position={relative ? 'relative' : 'absolute'} top="0" left="0" right="0" zIndex={1500}>
      <Progress colorScheme="gray" hasStripe isIndeterminate size="xs" {...props} />
    </Box>
  );
}
