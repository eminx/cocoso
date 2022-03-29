import React, { useState } from 'react';
import ReactDropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Box, Center, Heading, Text } from '@chakra-ui/react';
import Loader from '../../../components/Loader';
import NiceList from '../../../components/NiceList';


export default function DocumentsField() {
  const [ t ] = useTranslation('processes');
  const [ tc ] = useTranslation('common');
  
  const [ process ] = useState({});
  const [ isUploading ] = useState(false);
  const [ isAdmin ] = useState(true);

  const documentsList =
    process &&
    process.documents &&
    process.documents.map((document) => ({
      ...document,
      actions: [
        {
          content: tc('labels.remove'),
          handleClick: () => this.removeProcessDocument(document.name),
        },
      ],
    }));

  return (
    <Box>
      <Heading mb="2" size="sm">
        {t('labels.document')}
      </Heading>
      {process && process.documents && process.documents.length > 0 ? (
        <NiceList
          actionsDisabled={!isAdmin}
          keySelector="downloadUrl"
          list={documentsList}
        >
          {(document) => (
            <div style={{ width: '100%' }}>
              <a href={document.downloadUrl} target="_blank">
                {document.name}
              </a>
            </div>
          )}
        </NiceList>
      ) : (
        <Text size="small" pad="2" margin={{ bottom: 'small' }}>
          <em>{t('document.empty')}</em>
        </Text>
      )}

      {isAdmin && (
        <Center p="2">
          <ReactDropzone onDrop={this.handleFileDrop} multiple={false}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <Box
                bg="white"
                cursor="grab"
                h="180px"
                p="4"
                w="240px"
                {...getRootProps()}
              >
                {isUploading ? (
                  <div style={{ textAlign: 'center' }}>
                    <Loader />
                    {t('document.up')}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <b>{t('document.drop')}</b>
                  </div>
                )}
                <input {...getInputProps()} />
              </Box>
            )}
          </ReactDropzone>
        </Center>
      )}
    </Box>
  );
};