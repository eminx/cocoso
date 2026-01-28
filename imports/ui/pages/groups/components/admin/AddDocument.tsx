import React, { useState } from 'react';
import { useRevalidator } from 'react-router';
import ReactDropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';

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
import { call, uploadImage } from '/imports/api/_utils/shared';

import GroupDocuments from '../GroupDocuments';
import { groupAtom } from '../../GroupItemHandler';

export default function AddDocument({ onClose }) {
  const [isUploading, setIsUploading] = useState(false);
  const [tc] = useTranslation('common');
  const [group, setGroup] = useAtom(groupAtom);
  const revalidator = useRevalidator();

  if (!group) {
    return null;
  }

  const handleFileDrop = async (files: File[]) => {
    if (files.length !== 1) {
      message.error(tc('plugins.fileDropper.single'));
      return;
    }

    setIsUploading(true);
    const file = files[0];
    const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
    const uploadableFile = new File([file], parsedName, {
      type: file.type,
    });
    const groupId = group?._id;

    try {
      const uploadedDocument = await uploadImage(
        uploadableFile,
        'groupDocumentUpload'
      );
      console.log('uploadedDocument:', uploadedDocument);
      await call(
        'createDocument',
        parsedName,
        uploadedDocument,
        'group',
        groupId
      );
      await call(
        'addGroupDocument',
        { name: parsedName, downloadUrl: uploadedDocument },
        groupId
      );
      revalidator.revalidate();
      message.success(tc('message.success.create'));
    } catch (error: any) {
      message.error(error?.reason || error?.error);
    } finally {
      setIsUploading(false);
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
            {isUploading ? (
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

      {group.documents?.length > 0 ? (
        <Box py="8">
          <Heading mb="2" size="sm">
            {tc('documents.label')}
          </Heading>
          <GroupDocuments documents={group.documents} />
        </Box>
      ) : null}
    </Modal>
  );
}
