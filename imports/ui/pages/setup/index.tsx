import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { Alert, Box, Button, Center } from '/imports/ui/core';
import NewHostForm from '/imports/ui/forms/NewHostForm';

import { Signup } from '../auth';
import NewPlatform, { PlatformFormValues } from './NewPlatform';
import Stepper from '../../generic/Stepper';
import { call } from '../../../api/_utils/shared';
import { message } from '../../generic/message';
import { loginWithPasswordAsync } from '../auth/functions';
import { HostFormValues } from './NewHost';

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
}

const steps = [
  {
    title: 'User',
    description: 'Super admin user',
  },
  {
    title: 'Platform',
    description: 'Main Platform',
  },
  {
    title: 'Community',
    description: 'First Web app',
  },
];

const hostModel = {
  host: window.location.host,
  name: '',
  email: '',
  address: '',
  city: '',
  country: '',
  about: '',
};

export default function SetupHome() {
  const [state, setState] = useState({
    currentStep: '0',
    user: null,
    platform: null,
    host: null,
  });

  const getData = async () => {
    if (!state.user) {
      const user = await Meteor.userAsync();
      setState((prevState) => ({
        ...prevState,
        user,
      }));
    }
    if (!state.platform) {
      const platform = await call('getPlatform');
      setState((prevState) => ({
        ...prevState,
        platform,
      }));
    }
    if (!state.host) {
      const host = await call('getCurrentHost');
      setState((prevState) => ({
        ...prevState,
        host,
      }));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
    let currentStep = '0';
    if (!state.user) {
      return;
    } else if (!state.platform) {
      currentStep = '1';
    } else if (!state.host) {
      currentStep = '2';
    } else {
      currentStep = '3';
    }
    setState((prevState) => ({
      ...prevState,
      currentStep,
    }));
  }, [state.user, state.platform, state.host]);

  const onCreateUser = async (data: SignupFormValues) => {
    try {
      const userId = await call('createAccount', data);
      if (!userId) {
        message.error('User creation failed');
        return;
      }
      await loginWithPasswordAsync(data.username, data.password);
      await call('setUserSuperAdmin', userId);
      const user = await Meteor.userAsync();
      setState((prevState) => ({
        ...prevState,
        user,
      }));
    } catch (error: any) {
      message.error(error.error?.reason || error.reason || 'Error creating user');
    }
  };

  const onCreatePlatform = async (data: PlatformFormValues) => {
    if (!data.name || !data.email || !data.portalHost) {
      message.error('All values required');
      return;
    }

    try {
      await call('createPlatform', data);
      const platform = await call('getPlatform');
      setState((prevState) => ({
        ...prevState,
        platform,
      }));
    } catch (error: any) {
      message.error(error.reason || 'Error creating platform');
    }
  };

  const onCreateHost = async (data: HostFormValues) => {
    const parsedValues = {
      ...data,
      aboutTitle: `About ${data.name}`,
    };

    try {
      await call('createNewHost', parsedValues);
      const host = await call('getCurrentHost');
      setState((prevState) => ({
        ...prevState,
        host,
      }));
    } catch (error: any) {
      message.error(error.reason || error.error || 'Error creating host');
    }
  };

  // if (!state.user || !state.user.isSuperAdmin) {
  //   return (
  //     <Center>
  //       <Alert type="error">
  //         <Trans i18nKey="common:message.access.deny" />
  //       </Alert>
  //     </Center>
  //   );
  // }

  const goHomeAndReload = () => {
    window.location.href = window.location.host;
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  const renderBody = () => {
    if (state.currentStep === '3') {
      // finished
      return (
        <>
          <Alert type="success">
            You have successfully finished the installation
          </Alert>
          <Center>
            <Button my="4" variant="ghost" onClick={() => goHomeAndReload()}>
              Go to the home page
            </Button>
          </Center>
        </>
      );
    }

    if (state.currentStep === '2') {
      return <NewHostForm defaultValues={hostModel} onSubmit={onCreateHost} />;
    }
    if (state.currentStep === '1') {
      return <NewPlatform onSubmit={onCreatePlatform} />;
    }
    if (state.currentStep === '0') {
      return <Signup hideTermsCheck onSubmit={onCreateUser} />;
    }
  };

  return (
    <Box bg="gray.100" pb="4" css={{ minHeight: '100vh' }}>
      <Center px="4" py="8">
        <Stepper steps={steps} activeStep={Number(state.currentStep)} />
      </Center>
      <Center>
        <Box bg="gray.50" px="8" py="4" w="100%" css={{ maxWidth: '420px' }}>
          {renderBody()}
        </Box>
      </Center>
    </Box>
  );
}
