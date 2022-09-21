import React, { useState, useEffect, useContext } from 'react';
import ReactDropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Box, Button, Code, Link as CLink, List, ListItem, Text } from '@chakra-ui/react';
import { ExternalLinkIcon, DeleteIcon } from '@chakra-ui/icons';

import { call } from '../../../utils/shared';
import Loader from '../../../components/Loader';
import { Alert, message } from '../../../components/message';
import { StateContext } from '../../../LayoutContainer';

export default function DocumentsField({ contextType, contextId }) {
  const { role, canCreateContent } = useContext(StateContext);
  const isAdmin = role === 'admin';

  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [t] = useTranslation('resources');
  const [tc] = useTranslation('common');

  const getDocuments = async () => {
    try {
      const response = await call('getDocumentsByAttachments', contextId);
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

  const createDocument = async (uploadableFile, downloadUrl) => {
    try {
      await call('createDocument', uploadableFile.name, downloadUrl, contextType, contextId);
      getDocuments();
      message.success(`${uploadableFile.name} ${t('documents.fileDropper')}`);
    } catch (error) {
      message.error(error.reason);
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = async (documentId) => {
    if (!isAdmin) {
      message.error(tc('message.access.deny'));
      return;
    }

    try {
      await call('removeManual', documentId);
      getDocuments();
      message.success(tc('documents.remove'));
    } catch (error) {
      message.error(error.reason);
    }
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
    <Box>
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
                <Code fontWeight="bold">
                  <CLink href={document.documentUrl} target="_blank" rel="noreferrer">
                    <ExternalLinkIcon mr="2px" fontSize="sm" />
                    {document.documentLabel}
                  </CLink>
                </Code>
                <Button variant="ghost">
                  <DeleteIcon onClick={() => removeDocument(document._id)} />
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert type="warning">{tc('documents.empty')}</Alert>
        )}
      </Box>
      {canCreateContent && (
        <ReactDropzone onDrop={handleFileDrop} multiple={false}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <Box bg="gray.200" cursor="grab" h="180px" p="4" w="100%" {...getRootProps()}>
              {isUploading ? (
                <div style={{ textAlign: 'center' }}>
                  <Loader />
                  {tc('documents.up')}
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>{tc('documents.drop')}</div>
              )}
              <input {...getInputProps()} />
            </Box>
          )}
        </ReactDropzone>
      )}
    </Box>
  );
}
