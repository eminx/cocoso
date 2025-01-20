import React from 'react';
import { Box, Code, Flex, Link as CLink } from '@chakra-ui/react';

import NiceList from '/imports/ui/components/NiceList';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

export default function GroupDocuments({ documents }) {
  if (!documents || documents.length < 1) {
    return null;
  }

  return (
    <Box bg="white" p="4" pt="6">
      <NiceList keySelector="downloadUrl" list={documents}>
        {(document) => (
          <Flex align="center" color="blue.500">
            <Code bg="white" fontWeight="bold" mr="2">
              <CLink color="blue.500" href={document.downloadUrl} target="_blank" rel="noreferrer">
                {document.name}
              </CLink>
            </Code>
            <ExternalLink size="18px" />
          </Flex>
        )}
      </NiceList>
    </Box>
  );
}
