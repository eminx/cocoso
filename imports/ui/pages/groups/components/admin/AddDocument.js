import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import React, { useContext, useState } from 'react';
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

import { GroupContext } from '../../Group';
import GroupDocuments from '../GroupDocuments';

export default function AddDocument({ onClose }) {
  const [isUploading, setIsUploading] = useState(false);
  const [tc] = useTranslation('common');
  const { group, getGroupById } = useContext(GroupContext);

  if (!group) {
    return null;
  }

  const handleFileDrop = (files) => {
    if (files.length !== 1) {
      message.error(tc('plugins.fileDropper.single'));
      return;
    }

    const closeLoader = () => {
      getGroupById();
      setIsUploading(false);
    };

    setIsUploading(true);
    const upload = new Slingshot.Upload('groupDocumentUpload');
    const file = files[0];
    const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
    const uploadableFile = new File([file], parsedName, {
      type: file.type,
    });

    upload.send(uploadableFile, (error, downloadUrl) => {
      if (error) {
        message.error(error.reason || error.error);
        closeLoader();
      } else {
        Meteor.call(
          'createDocument',
          uploadableFile.name,
          downloadUrl,
          'group',
          group._id,
          (error1) => {
            if (error1) {
              return;
            }
            Meteor.call(
              'addGroupDocument',
              { name: uploadableFile.name, downloadUrl },
              group._id,
              (error2) => {
                if (error2) {
                  return;
                }
                closeLoader();
              }
            );
          }
        );
      }
    });
  };

  return (
    <Modal
      hideFooter
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
