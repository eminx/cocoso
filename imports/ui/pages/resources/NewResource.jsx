import React, { useContext } from 'react';
import { Box, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ResourceForm from './components/ResourceForm';
import { StateContext } from '../../LayoutContainer';
import { Alert } from '../../components/message';

function NewResourcePage({ history }) {
  const [tc] = useTranslation('common');
  const { currentUser, role } = useContext(StateContext);

  const resourceModel = {
    label: '',
    description: '',
    isBookable: true,
    isCombo: false,
    resourcesForCombo: [],
  };

  if (!currentUser || role !== 'admin') {
    return (
      <Center m="8">
        <Alert message={tc('message.access.deny')} type="error" />
      </Center>
    );
  }

  return (
    <Box>
      <Breadcrumb furtherItems={[{ label: tc('actions.create') }]} />
      <Template>
        <Box p="6">
          <ResourceForm defaultValues={resourceModel} history={history} />
        </Box>
      </Template>
    </Box>
  );
}

export default NewResourcePage;
