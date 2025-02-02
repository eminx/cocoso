import React from 'react';
import { Box, Progress } from '@chakra-ui/react';

export default function Loader({ ...props }) {
  return (
    <Box position="absolute" top="0" left="0" right="0">
      <Progress colorScheme="gray" hasStripe isIndeterminate size="xs" {...props} />
    </Box>
  );
}
