import React from 'react';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { Box, Code, Flex, Link } from '/imports/ui/core';
import NiceList from '/imports/ui/generic/NiceList';

export default function GroupDocuments({ documents }) {
  if (!documents || documents.length < 1) {
    return null;
  }

  return (
    <Box bg="white" p="6" mb="2">
      <NiceList keySelector="downloadUrl" list={documents}>
        {(document) => (
          <Flex align="center" color="blue.500">
            <Code truncated mr="1">
              <Link
                color="blue.500"
                href={document.documentUrl}
                rel="noreferrer"
                target="_blank"
                css={{ marginRight: '1em' }}
              >
                {document.documentLabel || document.name}
              </Link>
              <ExternalLink size="18px" />
            </Code>
          </Flex>
        )}
      </NiceList>
    </Box>
  );
}
