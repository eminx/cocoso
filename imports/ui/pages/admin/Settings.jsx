import React, { useState, useEffect, useContext } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Center, Divider, Text } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { message, Alert } from '../../components/message';
import { call, resizeImage, uploadImage } from '../../utils/shared';
import { adminMenu } from '../../utils/constants/general';
import SettingsForm from './SettingsForm';
import FileDropper from '../../components/FileDropper';
import Menu from './Menu';
import Breadcrumb from '../../components/Breadcrumb';
import Tabs from '../../components/Tabs';
import Categories from './Categories';

export default function Settings({ history }) {
  const [localSettings, setLocalSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState(null);

  const { currentUser, currentHost, isDesktop, role, getCurrentHost } = useContext(StateContext);

  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  useEffect(() => {
    if (!currentHost) {
      return;
    }
    setLocalSettings(currentHost.settings);
    setLoading(false);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleFormSubmit = async (values) => {
    if (!currentUser || role !== 'admin') {
      message.error(tc('message.access.deny'));
      return;
    }

    try {
      await call('updateHostSettings', values);
      getCurrentHost();
      message.success(tc('message.success.update'));
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const setUploadableImage = (files) => {
    if (files.length > 1) {
      message.error(t('logo.message.fileDropper'));
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        setLocalImage({
          uploadableImage,
          uploadableImageLocal: reader.result,
        });
      },
      false
    );
  };

  const uploadLogo = async () => {
    setUploading(true);
    try {
      const resizedImage = await resizeImage(localImage.uploadableImage, 1000);
      const uploadedImage = await uploadImage(resizedImage, 'hostLogoUpload');
      await call('assignHostLogo', uploadedImage);
      getCurrentHost();
      message.success(t('logo.message.success'));
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    } finally {
      setUploading(false);
    }
  };

  const isImage =
    (localImage && localImage.uploadableImageLocal) || (currentHost && currentHost.logo);

  const tabs = [
    {
      title: t('settings.tabs.general'),
      path: '/admin/settings/organization',
      content: (
        <AlphaContainer>
          <Box mb="8">
            <Text mb="3" fontWeight="bold">
              {t('logo.info')}
            </Text>
            <Box>
              <FileDropper
                imageUrl={currentHost && currentHost.logo}
                height={isImage && '80px'}
                width={isImage && '120px'}
                round={false}
                setUploadableImage={setUploadableImage}
                uploadableImageLocal={localImage && localImage.uploadableImageLocal}
              />
            </Box>
            {localImage && localImage.uploadableImageLocal && (
              <Center p="2">
                <Button isLoading={uploading} onClick={() => uploadLogo()}>
                  {tc('actions.submit')}
                </Button>
              </Center>
            )}
          </Box>
          <Text mb="3" fontWeight="bold">
            {t('info.info')}
          </Text>
          <SettingsForm initialValues={localSettings} onSubmit={handleFormSubmit} />
        </AlphaContainer>
      ),
    },
    {
      title: t('settings.tabs.menu'),
      path: '/admin/settings/menu',
      content: (
        <AlphaContainer>
          <Menu />
        </AlphaContainer>
      ),
    },
    {
      title: t('settings.tabs.categories'),
      path: '/admin/settings/categories',
      content: (
        <AlphaContainer>
          <Categories />
        </AlphaContainer>
      ),
    },
  ];
  const pathname = history?.location?.pathname;
  const tabIndex = tabs && tabs.findIndex((tab) => tab.path === pathname);

  if (tabs && !tabs.find((tab) => tab.path === pathname)) {
    return <Redirect to={tabs[0].path} />;
  }

  const furtherBreadcrumbLinks = [
    {
      label: 'Admin',
      link: '/admin/settings',
    },
    {
      label: t('settings.label'),
      link: 'admin/settings',
    },
    {
      label: tabs.find((t) => t.path === pathname).title,
      link: null,
    },
  ];

  return (
    <>
      <Box px={isDesktop ? '6' : '4'} pt="4">
        <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
      </Box>
      <Template
        heading={t('settings.label')}
        leftContent={
          <Box>
            <ListMenu pathname={pathname} list={adminMenu} />
          </Box>
        }
      >
        <Tabs index={tabIndex} ml="-4" tabs={tabs} />

        <Box mb="24">
          <Switch history={history}>
            {tabs.map((tab) => (
              <Route
                key={tab.title}
                exact
                path={tab.path}
                render={(props) => (
                  <Box {...props} pt="2">
                    {tab.content}
                  </Box>
                )}
              />
            ))}
          </Switch>
        </Box>
      </Template>
    </>
  );
}

function AlphaContainer({ title, children }) {
  return <Box maxWidth={480}>{children}</Box>;
}
