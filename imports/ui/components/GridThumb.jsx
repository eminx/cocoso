import React from 'react';
import { Box, Heading, Flex, Image, Spacer } from '@chakra-ui/react';
import i18n from 'i18next';
import moment from 'moment';

moment.locale(i18n.language);

export default function GridThumb({ title, image, imageFit = 'cover', large = false, children }) {
  if (!title) {
    return null;
  }

  return (
    <Flex justify="space-between" flexDirection={large ? 'column' : 'row'} m="2" w={290}>
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

      <Box p="4" flexBasis={large ? '50%' : '70%'} isTruncated>
        <Heading size={large ? 'lg' : 'md'} fontWeight="light" linebreak="anywhere">
          {title}
        </Heading>
        <Spacer my="1" />
        <Box>{children}</Box>
      </Box>
    </Flex>
  );
}
