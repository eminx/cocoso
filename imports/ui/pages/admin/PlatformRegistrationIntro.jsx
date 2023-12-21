import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Center, Flex, Heading, IconButton, Text, VStack } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import { call } from '../../utils/shared';
import Breadcrumb from '../../components/Breadcrumb';
import ReactQuill from '../../components/Quill';
import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { superadminMenu } from '../../utils/constants/general';

export default function PlatformRegistrationIntro({ history }) {
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState(null);
  const [registrationIntro, setRegistrationIntro] = useState(['']);
  const [saving, setSaving] = useState(false);

  const { currentUser, getPlatform } = useContext(StateContext);

  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getPlatformNow();
  }, []);

  const getPlatformNow = async () => {
    try {
      const respond = await call('getPlatform');
      setPlatform(respond);
      if (respond && respond.registrationIntro) {
        setRegistrationIntro(respond.registrationIntro);
      }
      getPlatform();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddSlide = () => {
    setRegistrationIntro([...registrationIntro, '']);
  };

  const handleChangeRegistrationIntro = (value, index) => {
    const slides = registrationIntro.map((slide, i) => {
      if (i === index) {
        return value;
      } else {
        return slide;
      }
    });

    setRegistrationIntro(slides);
  };

  if (!currentUser || !currentUser.isSuperAdmin) {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  if (loading) {
    return <Loader />;
  }

  const updatePlatformRegistrationIntro = async () => {
    if (!currentUser || !currentUser.isSuperAdmin) {
      message.error(tc('message.access.deny'));
      return;
    }

    setSaving(true);

    try {
      await call('updatePlatformRegistrationIntro', registrationIntro);
      await getPlatformNow();
      message.success(tc('message.success.update', { domain: 'Platform settings' }));
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const pathname = history?.location?.pathname;

  const furtherBreadcrumbLinks = [
    {
      label: 'Platform',
      link: null,
    },
    {
      label: tc('menu.superadmin.intro'),
      link: null,
    },
  ];

  return (
    <Box>
      <Box p="4">
        <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
      </Box>

      <Template
        heading={tc('menu.superadmin.intro')}
        leftContent={
          <Box>
            <ListMenu pathname={pathname} list={superadminMenu} />
          </Box>
        }
      >
        <Text mb="2">
          These blocks of information composed below will be shown as an onboarding orientation to
          the users who register themselves to be part of Samarbetet, at any of the communities...
        </Text>

        <Text mb="4">
          You may preview{' '}
          <a href={`https://${platform.portalHost}/intro`} target="_blank">
            here
          </a>
          .
        </Text>
        <VStack spacing="4">
          {registrationIntro.map((slide, index) => (
            <Box key={index} py="2" w="100%">
              <Heading mb="2" size="sm">
                Slide {index + 1}
              </Heading>
              <ReactQuill
                value={slide}
                onChange={(value) => handleChangeRegistrationIntro(value, index)}
              />
              {registrationIntro.length > 1 && (
                <Center p="1">
                  <Button
                    variant="link"
                    colorScheme="red"
                    size="sm"
                    onClick={() =>
                      setRegistrationIntro(registrationIntro.filter((s, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
                </Center>
              )}
            </Box>
          ))}

          <Center bg="white" p="4" mb="8" w="100%">
            <IconButton icon={<PlusSquareIcon fontSize="xl" />} onClick={() => handleAddSlide()} />
          </Center>
        </VStack>

        <Center mb="8">
          <Button isLoading={saving} onClick={() => updatePlatformRegistrationIntro()}>
            Confirm
          </Button>
        </Center>
      </Template>
    </Box>
  );
}
