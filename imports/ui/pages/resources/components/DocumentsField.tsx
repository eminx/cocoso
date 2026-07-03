import React, { useEffect, useState } from 'react';
import ReactDropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Box, Code, Flex, Link as CLink, Loader, Text } from '/imports/ui/core';
import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link';
import { useAtomValue } from 'jotai';

import { call } from '../../../../api/_utils/shared';
import { message } from '../../../generic/message';
import NiceList from '../../../generic/NiceList';
import DocumentUploadHelper from '../../../forms/UploadHelpers';
import { isDesktopAtom } from '../../../../state';

export default function DocumentsField({
  contextType,
  contextId,
  isAllowed = false,
}) {
  const isDesktop = useAtomValue(isDesktopAtom);
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tc] = useTranslation('common');

  const getDocuments = async () => {
    if (!contextId) {
      return;
    }
    try {
      const response = await call('getDocumentsByAttachments', contextId);
      setDocuments(response.reverse());
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
  }, [documents.length]);

  const removeDocument = async (documentId: string) => {
    if (!isAllowed) {
      message.error(tc('message.access.deny'));
      return;
    }

    try {
      await call('removeDocument', documentId);
      getDocuments();
      message.success(tc('documents.remove'));
    } catch (error) {
      message.error(error.reason);
    }
  };

  const handleFileDrop = async (files: File[]) => {
    if (files.length !== 1) {
      message.error(tc('plugins.fileDropper.single'));
      return;
    }
    const file = files[0];
    setIsUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', () => {
          resolve((reader.result as string).split(',')[1]);
        });
        reader.addEventListener('error', () => reject(reader.error));
      });
      await call('createDocument', base64, file.name, file.type, contextType, contextId);
      getDocuments();
      message.success(`${file.name} ${tc('documents.fileDropper')}`);
    } catch (error) {
      message.error(error.reason);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <Loader relative />;
  }

  if (!documents) {
    return null;
  }

  const documentsList = documents.map((document) => ({
    ...document,
    actions: [
      {
        content: tc('labels.remove'),
        handleClick: () => removeDocument(document._id),
      },
    ],
  }));

  return (
    <Box>
      <Box mb="4" px={isDesktop ? '0' : '4'}>
        {documents && documents.length > 0 ? (
          <NiceList actionsDisabled={!isAllowed} list={documentsList}>
            {(document) => (
              <Box style={{ width: '100%' }}>
                <Code fontWeight="bold">
                  <CLink
                    color="blue.600"
                    href={document.documentUrl}
                    overflowWrap="anywhere"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {document.documentLabel}{' '}
                    <ExternalLinkIcon
                      style={{ marginRight: '1rem', flexShrink: 0 }}
                    />
                  </CLink>
                </Code>
              </Box>
            )}
          </NiceList>
        ) : (
          <Text fontSize="sm" fontWeight="bold" mb="4" textAlign="center">
            {tc('documents.empty')}
          </Text>
        )}
      </Box>
      {isAllowed && (
        <Box>
          <Box mb="2">
            <ReactDropzone onDrop={handleFileDrop} multiple={false}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <Flex
                  align="center"
                  bg={isDragActive ? 'gray.300' : 'white'}
                  direction="column"
                  h="120px"
                  justify="center"
                  p="4"
                  w="100%"
                  css={{
                    border: '2px dashed',
                    borderColor: 'var(--cocoso-colors-theme-500)',
                    cursor: 'grab',
                    '&:hover': {
                      bg: 'var(--cocoso-colors-theme-50)',
                    },
                  }}
                  {...getRootProps()}
                >
                  {isUploading ? (
                    <Loader relative />
                  ) : (
                    <Text textAlign="center" fontSize="sm">
                      {tc('documents.drop')}
                    </Text>
                  )}
                  <input {...getInputProps()} />
                </Flex>
              )}
            </ReactDropzone>
          </Box>

          <DocumentUploadHelper isImage={false} />
        </Box>
      )}
    </Box>
  );
}
