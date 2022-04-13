import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useContext } from 'react';
import ReactDropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Heading,
  Text,
  Button,
  Link,
  List,
  ListItem,
} from '@chakra-ui/react';
import { ExternalLinkIcon, DeleteIcon } from '@chakra-ui/icons';

import { call } from '../../../@/shared';
import Loader from '../../../components/Loader';
import { message } from '../../../components/message';
import { StateContext } from '../../../LayoutContainer';

export default function DocumentsField({ domainType, domainId }) {
  const { role, canCreateContent } = useContext(StateContext);
  const isAdmin = role === 'admin' ? true : false;

  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [t] = useTranslation('resources');
  const [tc] = useTranslation('common');

  const getDocuments = async () => {
    try {
      const response = await call('getDocumentsByAttachments', domainId);
      setDocuments(response);
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
  }, [documents.length]);

  const createDocument = (uploadableFile, downloadUrl) => {
    Meteor.call(
      'createDocument',
      uploadableFile.name,
      downloadUrl,
      domainType,
      domainId,
      (error, respond) => {
        if (error) {
          message.error(error.reason);
          setIsUploading(false);
        } else {
          message.success(
            `${uploadableFile.name} ${t('documents.fileDropper')}`
          );
          setIsUploading(false);
        }
      }
    );
  };

  const removeDocument = (documentId) => {
    if (!isAdmin) {
      message.error(tc('message.access.deny'));
      return;
    }
    Meteor.call('removeManual', documentId, (error, respond) => {
      if (error) {
        console.log('error', error);
        message.error(error.reason);
      } else {
        message.success(tc('documents.remove'));
      }
    });
  };

  const handleFileDrop = (files) => {
    if (files.length !== 1) {
      message.error(tc('plugins.fileDropper.single'));
      return;
    }
    setIsUploading(true);
    const upload = new Slingshot.Upload('processDocumentUpload');
    files.forEach((file) => {
      const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
      const uploadableFile = new File([file], parsedName, {
        type: file.type,
      });
      upload.send(uploadableFile, (error, downloadUrl) => {
        if (error) {
          console.error('Error uploading:', error);
          message.error(error.reason);
          setIsUploading(false);
          return;
        } else {
          createDocument(uploadableFile, downloadUrl);
        }
      });
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box mt="5">
      <Heading mb="4" ml="4" size="sm">
        {tc('documents.label')}
      </Heading>

      {canCreateContent && (
        <ReactDropzone onDrop={handleFileDrop} multiple={false}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <Box bg="white" cursor="grab" px="2" py="4" {...getRootProps()}>
              {isUploading ? (
                <div style={{ textAlign: 'center' }}>
                  <Loader />
                  {tc('documents.up')}
                </div>
              ) : (
                <Button
                  width="100%"
                  textAlign="left"
                  textColor="gray.400"
                  justifyContent="start"
                >
                  {tc('documents.drop')}
                </Button>
              )}
              <input {...getInputProps()} />
            </Box>
          )}
        </ReactDropzone>
      )}

      <Box bg="white" mt="2">
        {documents && documents.length > 0 ? (
          <List>
            {documents.map((document) => (
              <ListItem
                key={document._id}
                p="4"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Link href={document.documentUrl} isExternal>
                  <ExternalLinkIcon mr="2px" fontSize="sm" />
                  {document.documentLabel}
                </Link>
                <Button variant="ghost">
                  <DeleteIcon onClick={() => removeDocument(document._id)} />
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <Text size="small" pad="2" p="4" margin={{ bottom: 'small' }}>
            <em>{tc('documents.empty')}</em>
          </Text>
        )}
      </Box>
    </Box>
  );
}
