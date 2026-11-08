import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
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
import { uploadDocument } from '/imports/actions';
import DocumentUploadHelper from '/imports/ui/forms/UploadHelpers';
import { message } from '/imports/ui/generic/message';
import Documents from '/imports/ui/generic/Documents';

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
      await uploadDocument({
        uploadableFile,
        itemId,
        context,
      });
      handleClose();
    } catch (error: any) {
      console.log(error?.reason || error?.error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.set('addDocument', 'false');
      return next;
    });
  };

  const active = searchParams.get('addDocument') === 'true';

  return (
    <Modal
      hideFooter
      id="add-document-modal"
      open={active}
      size="lg"
      title={tc('documents.add')}
      onClose={handleClose}
    >
      <ReactDropzone onDrop={handleFileDrop} multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => (
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
                  <Text mt="2" textTransform="capitalize">
                    {tc('documents.up')}
                  </Text>
                </Flex>
              </Center>
            ) : (
              <div style={{ textAlign: 'center' }}>{tc('documents.drop')}</div>
            )}
            <input {...getInputProps()} />
          </Box>
        )}
      </ReactDropzone>

      <DocumentUploadHelper isImage={false} />

      {documents && documents?.length > 0 ? (
        <Box py="8">
          <Heading size="xs" css={{ marginBottom: '1rem' }}>
            {tc('documents.labelExisting')}
          </Heading>
          <Documents documents={documents} />
        </Box>
      ) : null}
    </Modal>
  );
}
