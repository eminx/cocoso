import React from 'react';
import { Box, Code, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import {
  acceptedDocumentFormatsForUploads,
  maximumDocumentSizeForUploads,
} from '../utils/constants/general';

function DocumentUploadHelper() {
  const [tc] = useTranslation('common');

  return (
    <Box w="100%">
      <Flex justify="space-between">
        <Text fontSize="sm" mb="2" px="2">
          {tc('documents.acceptedFormats')}: <br />
          {acceptedDocumentFormatsForUploads?.map((format) => (
            <Code key={format} fontSize="12px" mr="2">
              {format}
            </Code>
          ))}
        </Text>

        <Text fontSize="sm" px="2">
          {tc('documents.maxSize')}: <br />
          <Code fontSize="12px">{maximumDocumentSizeForUploads}</Code>
        </Text>
      </Flex>
    </Box>
  );
}

export { DocumentUploadHelper };
