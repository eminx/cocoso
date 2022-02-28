
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Template from '../../components/Template';
import ResourceForm from '../../components/ResourceForm';

function NewResource() {
  const [ tc ] = useTranslation('common');
  return (
    <Template heading={tc('labels.create', { domain: tc('domains.resource') })}>
      <Center>
        <Link to={`/resources`}>Back to resources</Link>
      </Center>
      <Box bg="white" p="6">
        <ResourceForm />
      </Box>
    </Template>
  );
}

export default NewResource;
