import React, { useState } from 'react';
import { useRevalidator, useSearchParams } from 'react-router';
import ReactDropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Center,
  Flex,
  Heading,
  Modal,
  Spinner,
  Text,
} from '/imports/ui/core';
import { call } from '/imports/api/_utils/shared';

import DocumentUploadHelper from './UploadHelpers';
import Documents from '../generic/Documents';
import { message } from '../generic/message';

interface DocumentUploaderProps {
  documents: any[];
  itemId: string;
  context: string;
}

export default function DocumentUploader({
  context,
  documents,
  itemId,
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [tc] = useTranslation('common');
  const [searchParams, setSearchParams] = useSearchParams();
  const { revalidate } = useRevalidator();

  const handleFileDrop = async (files: File[]) => {
    if (files.length !== 1) {
      message.error(tc('plugins.fileDropper.single'));
      return;
    }

    setUploading(true);
    const file = files[0];
    const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();

    // Convert to base64 string
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const uploadableFile = {
        fileData: base64,
        fileName: parsedName,
        contentType: file.type,
      };
      await call('createDocument', uploadableFile, itemId, context);
      revalidate();
      message.success(tc('documents.uploaded'));
    } catch (error: any) {
      message.error(error?.reason || error?.error);
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = async (documentId: string) => {
    try {
      await call('removeDocument', documentId);
      revalidate();
      message.success(tc('documents.remove'));
    } catch (error: any) {
      message.error(error?.reason || error?.error);
    }
  };

  const handleClose = () => {
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.set('documents', 'false');
      return next;
    });
  };

  const active = searchParams.get('documents') === 'true';

  const documentList = documents.map((document) => ({
    ...document,
    actions: [
      {
        content: tc('labels.remove'),
        handleClick: () => removeDocument(document._id),
      },
    ],
  }));

  return (
    <Modal
      hideFooter
      id="add-document-modal"
      open={active}
      size="lg"
      title={tc('documents.manage')}
      onClose={handleClose}
    >
      <ReactDropzone onDrop={handleFileDrop} multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <>
            <Heading size="xs">{tc('documents.add')}</Heading>
            <Box
              bg={isDragActive ? 'theme.300' : 'theme.50'}
              h="180px"
              p="4"
              w="100%"
              css={{
                border: '1px dashed',
                borderColor: 'var(--cocoso-colors-theme-300)',
                borderRadius: 'var(--cocoso-border-radius)',
                cursor: 'grab',
              }}
              {...getRootProps()}
            >
              {uploading ? (
                <Center>
                  <Flex align="center" direction="column">
                    <Spinner />
                    <Text
                      css={{
                        marginBottom: '0.5rem',
                        textTransform: 'capitalize',
                      }}
                    >
                      {tc('documents.up')}
                    </Text>
                  </Flex>
                </Center>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  {tc('documents.drop')}
                </div>
              )}
              <input {...getInputProps()} />
            </Box>
          </>
        )}
      </ReactDropzone>

      <DocumentUploadHelper isImage={false} />

      {documents && documents?.length > 0 ? (
        <Box py="8">
          <Heading size="xs">{tc('documents.labelExisting')}</Heading>
          <Documents actionsDisabled={false} documents={documentList} />
        </Box>
      ) : null}
    </Modal>
  );
}
