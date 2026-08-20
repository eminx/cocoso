import React, { useState } from 'react';
import { useRevalidator } from 'react-router';
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
import DocumentUploadHelper from '/imports/ui/forms/UploadHelpers';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';

import Documents from '/imports/ui/generic/Documents';

export default function AddDocument({ itemId, documents, onClose }) {
  const [uploading, setUploading] = useState(false);
  const [tc] = useTranslation('common');
  const { revalidate } = useRevalidator();

  if (!itemId) {
    return null;
  }

  const handleFileDrop = async (files: File[]) => {
    if (files.length !== 1) {
      message.error(tc('plugins.fileDropper.single'));
      return;
    }

    setUploading(true);
    const file = files[0];
    const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
    const uploadableFile = new File([file], parsedName, {
      type: file.type,
    });

    try {
      await call('createDocument', parsedName, uploadableFile, groupId);
      await call(
        'addGroupDocument',
        { name: parsedName, downloadUrl: uploadedDocument },
        groupId
      );
      revalidate();
      message.success(tc('message.success.create'));
    } catch (error: any) {
      message.error(error?.reason || error?.error);
    } finally {
      setUploading(false);
      setGroup(await call('getGroupWithMeetings', groupId));
    }
  };

  return (
    <Modal
      hideFooter
      id="group-add-document"
      open
      size="lg"
      title={tc('documents.label')}
      onClose={onClose}
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

      {documents?.length > 0 ? (
        <Box py="8">
          <Heading mb="2" size="sm">
            {tc('documents.label')}
          </Heading>
          <Documents documents={documents} />
        </Box>
      ) : null}
    </Modal>
  );
}
