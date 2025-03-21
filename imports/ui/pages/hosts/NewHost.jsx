import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Center } from '@chakra-ui/react';

import Template from '../../layout/Template';
import NewHostForm from '../../forms/NewHostForm';
import { message } from '../../generic/message';
import Alert from '../../generic/Alert';
import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';

const hostModel = {
  host: '',
  name: '',
  email: '',
  address: '',
  city: '',
  country: '',
  about: '',
};

function NewHost() {
  const { currentUser } = useContext(StateContext);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tc] = useTranslation('common');

  const handleSubmit = async (values) => {
    if (!currentUser.isSuperAdmin) {
      message.error(tc('message.access.deny'));
      return;
    }

    const parsedValues = {
      ...values,
      aboutTitle: `About ${values.name}`,
    };

    try {
      await call('createNewHost', parsedValues);
      window.scrollTo(0, 0);
      setIsSuccess(true);
    } catch (error) {
      message.error(`Error: ${error.reason || error.error}`);
    }
  };

  if (!currentUser || !currentUser.isSuperAdmin) {
    return (
      <Center>
        <Alert type="error">{tc('message.access.deny')}</Alert>
      </Center>
    );
  }

  if (isSuccess) {
    return (
      <Center py="6">
        <Alert type="success">{tc('message.success.create')}</Alert>
      </Center>
    );
  }

  return (
    <Box w="100%">
      <Template heading={tc('labels.create.host')}>
        <Box py="6">
          <NewHostForm defaultValues={hostModel} onSubmit={handleSubmit} />
        </Box>
      </Template>
    </Box>
  );
}

export default NewHost;
