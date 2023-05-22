import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';

import Template from '../../components/Template';
import NewHostForm from '../../components/NewHostForm';
import { message, Alert } from '../../components/message';
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
  const [t] = useTranslation('admin');
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
      console.log(error);
      message.error(`Error: ${error.reason || error.error}`);
    }
  };

  if (!currentUser || !currentUser.isSuperAdmin) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Alert message={tc('message.access.deny')} type="error" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <Alert type="success">{tc('message.success.create', { domain: tc('domains.host') })}</Alert>
    );
  }

  return (
    <Template heading={tc('labels.create', { domain: tc('domains.host') })}>
      <Box py="4" bg="white">
        <NewHostForm defaultValues={hostModel} onSubmit={handleSubmit} />
      </Box>
    </Template>
  );
}

export default NewHost;
