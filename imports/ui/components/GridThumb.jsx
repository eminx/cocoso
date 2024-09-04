import React from 'react';
import { Box, Heading, Flex, Image, Spacer } from '@chakra-ui/react';

export default function GridThumb({ title, image, imageFit = 'cover', large = false, children }) {
  if (!title) {
    return null;
  }

  return (
    <Flex bg="white" justify="space-between" flexDirection={large ? 'column' : 'row'} w={280}>
      {image ? (
        <Box bg="gray.100" flexBasis={large ? '50%' : 150}>
          <Image
            alt={title}
            fit={imageFit}
            mr="2"
            src={image}
            w={large ? '100%' : 'xs'}
            h={large ? 300 : 150}
          />
        </Box>
      ) : (
        <Box flexBasis={large ? '50%' : 150} h={large ? 300 : 150} bg="pink.100" />
      )}

      <Box p="4" flexBasis={large ? '50%' : '70%'} noOfLines={3}>
        <Heading size="1.3rem" fontWeight="bold" linebreak="anywhere">
          {title}
        </Heading>
        <Spacer my="1" />
        <Box>{children}</Box>
      </Box>
    </Flex>
  );
}
