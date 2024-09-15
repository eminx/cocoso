import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Center, Text } from '@chakra-ui/react';
import ReactQuill from '../../components/Quill';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { message, Alert } from '../../components/message';
import { call, resizeImage, uploadImage } from '../../utils/shared';
import { adminMenu } from '../../utils/constants/general';
import SettingsForm from './SettingsForm';
import FileDropper from '../../components/FileDropper';
import Menu from './MenuSettings';
import Tabs from '../../components/Tabs';
import Categories from './Categories';
import ColorPicker from './ColorPicker';

export default function Settings() {
  const [localSettings, setLocalSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState(null);
  const location = useLocation();
  const { currentUser, currentHost, role, getCurrentHost } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  useEffect(() => {
    currentHost && setLocalSettings(currentHost.settings);
    setLoading(false);
  }, []);

  if (!currentHost) {
    return null;
  }

  if (!currentUser || role !== 'admin') {
    return (
      <Center>
        <Alert>{tc('message.access.deny')}</Alert>
      </Center>
    );
  }

  if (loading) {
    return <Loader />;
  }

  const updateHostSettings = async (values) => {
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
      const resizedImage = await resizeImage(localImage.uploadableImage, 800);
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
      path: 'organization',
      content: (
        <AlphaContainer>
          <Box mb="8">
            <Text mb="3" fontWeight="bold">
              {t('logo.info')}
            </Text>
            <Box>
              <FileDropper
                imageUrl={currentHost && currentHost.logo}
                height={isImage && '120px'}
                width={isImage && '280px'}
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
          <SettingsForm initialValues={localSettings} onSubmit={updateHostSettings} />
        </AlphaContainer>
      ),
    },
    {
      title: t('settings.tabs.menu'),
      path: 'menu',
      content: (
        <AlphaContainer>
          <Menu />
        </AlphaContainer>
      ),
    },
    {
      title: t('settings.tabs.categories'),
      path: 'categories',
      content: (
        <AlphaContainer>
          <Categories />
        </AlphaContainer>
      ),
    },
    {
      title: t('settings.tabs.color'),
      path: 'color',
      content: (
        <AlphaContainer>
          <ColorPicker />
        </AlphaContainer>
      ),
    },
    {
      title: t('settings.tabs.footer'),
      path: 'footer',
      content: (
        <AlphaContainer>
          <Text mb="4">{t('info.platform.footer.description')}</Text>
          <ReactQuill
            className="ql-editor-text-align-center"
            placeholder={t('pages.form.description.holder')}
            value={localSettings.footer}
            onChange={(value) => setLocalSettings({ ...localSettings, footer: value })}
          />

          <Center p="4">
            <Button onClick={() => updateHostSettings(localSettings)}>
              {tc('actions.submit')}
            </Button>
          </Center>
        </AlphaContainer>
      ),
    },
  ];
  const pathname = location?.pathname;
  const pathnameLastPart = pathname.split('/').pop();
  const tabIndex = tabs && tabs.findIndex((tab) => tab.path === pathnameLastPart);

  if (tabs && !tabs.find((tab) => tab.path === pathnameLastPart)) {
    return <Navigate to={tabs[0].path} />;
  }

  return (
    <>
      <Template
        heading={t('settings.label')}
        leftContent={
          <Box>
            <ListMenu pathname={pathname} list={adminMenu} />
          </Box>
        }
      >
        <Tabs index={tabIndex} mb="4" tabs={tabs} />

        <Box mb="24">
          <Routes>
            {tabs.map((tab) => (
              <Route key={tab.title} path={tab.path} element={<Box pt="2">{tab.content}</Box>} />
            ))}
          </Routes>
        </Box>
      </Template>
    </>
  );
}

function AlphaContainer({ title, children }) {
  return <Box>{children}</Box>;
}
