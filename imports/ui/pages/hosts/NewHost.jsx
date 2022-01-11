import React, { useContext, useState } from 'react';
import { Box } from '@chakra-ui/react';

import Template from '../../components/Template';
import NewHostForm from '../../components/NewHostForm';
import { message, Alert } from '../../components/message';
import { call } from '../../@/shared';
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

  const handleSubmit = async (values) => {
    if (!currentUser.isSuperAdmin) {
      message.error('This is not allowed');
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
        <Alert message="You are not allowed" type="error" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <Alert type="success">
        Your submission is successfully sent. Please wait until we respond to
        you. Thank you for your interest!
      </Alert>
    );
  }

  return (
    <Template heading="Create a New Host">
      <Box p="8" bg="white">
        <NewHostForm defaultValues={hostModel} onSubmit={handleSubmit} />
      </Box>
    </Template>
  );
}

export default NewHost;
