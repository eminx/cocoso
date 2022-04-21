import React from 'react';
import { Box, Heading, Flex, Image, Text, Spacer } from '@chakra-ui/react';
import i18n from 'i18next';
import moment from 'moment';

moment.locale(i18n.language);

export default function GridThumb({ title, image, large = false, children }) {
  if (!title) {
    return null;
  }

  return (
    <Flex bg="white" justify="space-between" m="2" __hover={{ cursor: 'pointer' }}>
      <Box p="4" flexBasis={large ? '50%' : '70%'}>
        <Heading size={large ? 'lg' : 'md'} fontWeight="bold">
          {title}
          </Heading>
        <Spacer my="1" />
        <Box>{children}</Box>
        </Box>

      {image ? (
        <Box flexBasis={large ? '50%' : 180}>
          <Image
            alt={title}
            fit="cover"
            mr="2"
            src={image}
            w={large ? 'md' : 'xs'}
            h={large ? 400 : 150}
          />
          </Box>
      ) : (
        <Box flexBasis={large ? '50%' : 180} h={large ? 400 : 150} bg="pink.100" />
      )}
      </Flex>
  );
}
