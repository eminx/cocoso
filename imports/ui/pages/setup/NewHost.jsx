import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Center } from '@chakra-ui/react';

import NewHostForm from '../../forms/NewHostForm';
import { message } from '../../generic/message';
import Alert from '../../generic/Alert';
import { call } from '../../utils/shared';

function NewHost({ setFinished }) {
  const [tc] = useTranslation('common');

  const currentUser = Meteor.user();

  const hostModel = {
    host: window.location.host,
    name: '',
    email: currentUser?.emails && currentUser?.emails[0]?.address,
    address: '',
    city: '',
    country: '',
    about: '',
  };

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
      setFinished();
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (!currentUser || !currentUser.isSuperAdmin) {
    return (
      <Center>
        <Alert type="error">{tc('message.access.deny')}</Alert>
      </Center>
    );
  }

  return (
    <Box>
      <NewHostForm defaultValues={hostModel} onSubmit={handleSubmit} />
    </Box>
  );
}

export default NewHost;
