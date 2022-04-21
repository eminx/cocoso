import React from 'react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ResourceForm from './components/ResourceForm';

function NewResourcePage({ history }) {
  const [tc] = useTranslation('common');

  const resourceModel = {
    label: '',
    description: '',
    isCombo: false,
    resourcesForCombo: [],
  };

  return (
    <Template heading={tc('labels.create', { domain: tc('domains.resource') })}>
      <Breadcrumb />
      <Box bg="white" p="6">
        <ResourceForm defaultValues={resourceModel} history={history} />
        </Box>
      </Template>
  );
}

export default NewResourcePage;
