import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  Loader,
  Text,
} from '/imports/ui/core';

import ReactQuill from '../../forms/Quill';
import { StateContext } from '../../LayoutContainer';
import { message } from '../../generic/message';
import { call, resizeImage, uploadImage } from '../../utils/shared';
import SettingsForm from './SettingsForm';
import FileDropper from '../../forms/FileDropper';
import Tabs from '../../core/Tabs';
import Boxling from './Boxling';

export default function Settings() {
  const [localSettings, setLocalSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState(null);
  const location = useLocation();
  const { currentUser, currentHost, role, getCurrentHost } =
    useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  useEffect(() => {
    if (currentHost) {
      setLocalSettings(currentHost.settings);
    }
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
    (localImage && localImage.uploadableImageLocal) ||
    (currentHost && currentHost.logo);

  const tabs = [
    {
      title: t('settings.tabs.logo'),
      path: 'logo',
      content: (
        <>
          <Center>
            <Text fontWeight="bold" mb="4" textAlign="center">
              {t('logo.info')}
            </Text>
          </Center>

          <Boxling>
            <Center>
              <FileDropper
                imageUrl={currentHost && currentHost.logo}
                height={isImage && '120px'}
                width={isImage && '280px'}
                round={false}
                setUploadableImage={setUploadableImage}
                uploadableImageLocal={
                  localImage && localImage.uploadableImageLocal
                }
              />
            </Center>
            {localImage && localImage.uploadableImageLocal && (
              <Center p="4">
                <Button isLoading={uploading} onClick={() => uploadLogo()}>
                  {tc('actions.submit')}
                </Button>
              </Center>
            )}
          </Boxling>
        </>
      ),
    },
    {
      title: t('settings.tabs.info'),
      path: 'info',
      content: (
        <>
          <Center>
            <Text mb="4" fontWeight="bold">
              {t('info.info')}
            </Text>
          </Center>

          <Boxling>
            <SettingsForm
              initialValues={localSettings}
              onSubmit={updateHostSettings}
            />
          </Boxling>
        </>
      ),
    },
    {
      title: t('settings.tabs.footer'),
      path: 'footer',
      content: (
        <>
          <Center>
            <Text mb="4" fontWeight="bold">
              {t('settings.tabs.footer')}
            </Text>
          </Center>
          <Box mb="4">
            <Text>{t('info.platform.footer.description')}</Text>
          </Box>

          <Boxling>
            <ReactQuill
              className="ql-editor-text-align-center"
              placeholder={t('pages.form.description.holder')}
              value={localSettings?.footer}
              onChange={(value) =>
                setLocalSettings({ ...localSettings, footer: value })
              }
            />

            <Flex justify="flex-end" pt="4">
              <Button onClick={() => updateHostSettings(localSettings)}>
                {tc('actions.submit')}
              </Button>
            </Flex>
          </Boxling>
        </>
      ),
    },
  ];
  const pathname = location?.pathname;
  const pathnameLastPart = pathname.split('/').pop();
  const tabIndex =
    tabs && tabs.findIndex((tab) => tab.path === pathnameLastPart);

  if (tabs && !tabs.find((tab) => tab.path === pathnameLastPart)) {
    return <Navigate to={tabs[0].path} />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
      <Tabs index={tabIndex} mb="4" tabs={tabs} />

      <Box mb="24" py="4">
        <Routes>
          {tabs.map((tab) => (
            <Route
              key={tab.title}
              path={tab.path}
              element={<Box pt="2">{tab.content}</Box>}
            />
          ))}
        </Routes>
      </Box>
    </Box>
  );
}
