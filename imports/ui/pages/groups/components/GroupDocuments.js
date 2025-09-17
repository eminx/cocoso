import React from 'react';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { Box, Code, Flex, Link as CLink } from '/imports/ui/core';
import NiceList from '/imports/ui/generic/NiceList';

export default function GroupDocuments({ documents }) {
  if (!documents || documents.length < 1) {
    return null;
  }

  return (
    <Box p="6" mb="2">
      <NiceList keySelector="downloadUrl" list={documents}>
        {(document) => (
          <Flex align="center" color="blue.500">
            <Code truncated mr="1">
              <CLink
                color="blue.500"
                href={document.downloadUrl}
                rel="noreferrer"
                target="_blank"
              >
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
