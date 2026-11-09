import React from 'react';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { Box, Code, Link } from '/imports/ui/core';
import NiceList from '/imports/ui/generic/NiceList';
import { DocumentFile } from '/imports/ui/types';

export default function Documents({
  actionsDisabled = true,
  documents,
}: {
  actionsDisabled?: boolean;
  documents: any[];
}) {
  if (!documents || documents.length < 1) {
    return null;
  }

  return (
    <Box bg="white" p="6" mb="2">
      <NiceList
        actionsDisabled={actionsDisabled}
        keySelector="documentUrl"
        list={documents}
      >
        {(document: DocumentFile) => (
          <Code color="blue.500" size="sm" truncated>
            <Link
              color="blue.500"
              href={document.documentUrl}
              rel="noreferrer"
              size="sm"
              target="_blank"
              css={{ marginRight: '1em', fontSize: '16px' }}
            >
              {document.documentLabel || document.name}
            </Link>
            <ExternalLink size="18px" />
          </Code>
        )}
      </NiceList>
    </Box>
  );
}
