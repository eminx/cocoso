import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import ReactDropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Box,  Heading, Text, Button } from '@chakra-ui/react';

import { call } from '../../../@/shared';
import Loader from '../../../components/Loader';
import NiceList from '../../../components/NiceList';
import { message } from '../../../components/message';

export default function DocumentsField({ domainType, domainId }) {
  const [ t ] = useTranslation('processes');
  const [ tc ] = useTranslation('common');
  
  const [ documents, setDocuments] = useState([]);
  const [ isUploading, setIsUploading ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isAdmin ] = useState(true);

  useEffect(() => {
    getDocuments();
    // !isLoading ? console.log("documents: ", documents) : console.log('isLoading')
  }, []);

  const documentListActions = [{
    content: tc('labels.remove'),
    handleClick: () => removeDocument(document._id),
  }];

  const getDocuments = async () => {
    try {
      const response = await call('getDocumentsByAttachments', domainId);
      setDocuments(
        response.map(document =>  ({ ...document, actions: documentListActions })));
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(false);
    }
  };
    
  const createDocument = (uploadableFile, downloadUrl) => {

    Meteor.call(
      'createDocument',
      uploadableFile.name,
      downloadUrl,
      domainType,
      domainId,
      (error, respond) => {
        if (error) {
          message.error(error);
          console.log(error);
          setIsUploading(false);
        } else {
          message.success(
            `${uploadableFile.name} ${t('meeting.success.fileDropper')}`
          );
          setIsUploading(false);
          setDocuments([ ...documents, { ...respond, actions: documentListActions } ]);
        }
      }
    );
    
  }

  const removeDocument = (documentId) => {
    if (!isAdmin) {
      return;
    }

    Meteor.call(
      'removeManual',
      documentId,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.error(error.error);
        } else {
          message.success(t('document.remove'));
          const documentDeleted = documents.map(document => document._id).indexOf(documentId);
          setDocuments(documents.splice(documentDeleted, 1));
        }
      }
    );
  }
    
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
  }

  return (
    <Box mt="1.75rem">
      <Heading mb="2" size="sm">
        {t('labels.document')}
      </Heading>

      {isAdmin && (
        <ReactDropzone onDrop={handleFileDrop} multiple={false}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <Box
              bg="white"
              cursor="grab"
              p="4"
              {...getRootProps()}
            >
              {isUploading ? (
                <div style={{ textAlign: 'center' }}>
                  <Loader />
                  {t('document.up')}
                </div>
              ) : (
                <Button width="100%" textAlign="left" textColor="gray.400" justifyContent="start">
                  {t('document.drop')}
                </Button>
              )}
              <input {...getInputProps()} />
            </Box>
          )}
        </ReactDropzone>
      )}

      {!isLoading && 
        <Box
          bg="white"
          borderTop="1px"
          borderColor="gray.200"
        >
          {documents && documents.length > 0 ? (
            <NiceList
              actionsDisabled={!isAdmin}
              keySelector="downloadUrl"
              list={documents}
              p="4"
            >
              {(document) => (
                <div style={{ width: '100%' }}>
                  <a href={document.documentUrl} target="_blank">
                    {document.documentLabel}
                  </a>
                </div>
              )}
            </NiceList>
          ) : (
            <Text size="small" pad="2" p="4" margin={{ bottom: 'small' }}>
              <em>{t('document.empty')}</em>
            </Text>
          )}
        </Box>
      }
      
    </Box>
  );
};