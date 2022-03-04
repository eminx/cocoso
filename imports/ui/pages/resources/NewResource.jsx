import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { call } from '../../@/shared';
import { message } from '../../components/message';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ResourceForm from './components/ResourceForm';

function NewResourcePage({ history }) {
  const [resourceLabels, setResourceLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ tc ] = useTranslation('common');

  useEffect(() => {
    getResourceLabels();
  }, []);

  const getResourceLabels = async () => {
    try {
      const response = await call('getResourceLabels');
      setResourceLabels(response);
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(false);
    }
  };
  
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
        {!isLoading 
          && <ResourceForm 
              resources={resourceLabels}
              defaultValues={resourceModel}
              isEditMode={false}
              comboResources={resourceModel.resourcesForCombo} 
              history={history}
            />
        }
      </Box>
    </Template>
  );
}

export default NewResourcePage;