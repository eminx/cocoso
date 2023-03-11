import React, { useState, useEffect, useContext } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

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

const specialCh = /[!@#$%^&*()/\s/_+\=\[\]{};':"\\|,.<>\/?]+/;

export default function Settings({ history }) {
  const [localSettings, setLocalSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState(null);

  const { currentUser, currentHost, role } = useContext(StateContext);

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
    getCategories();
    setLoading(false);
  }, []);

  const handleFormSubmit = async (values) => {
    if (!currentUser || role !== 'admin') {
      message.error(tc('message.access.deny'));
      return;
    }

    try {
      call('updateHostSettings', values);
      message.success(tc('message.success.update', { domain: tc('domains.settings') }));
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const latestCategories = await call('getCategories');
      setCategories(latestCategories);
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const addNewCategory = async (event) => {
    event.preventDefault();
    try {
      await call('addNewCategory', categoryInput.toLowerCase(), 'work');
      getCategories();
      setCategoryInput('');
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const removeCategory = async (categoryId) => {
    try {
      await call('removeCategory', categoryId);
      getCategories();
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const handleCategoryInputChange = (value) => {
    if (specialCh.test(value)) {
      message.error(t('categories.message.denySpecialChars'));
    } else {
      setCategoryInput(value.toUpperCase());
    }
  };

  const setUploadableImage = (files) => {
    setUploading(true);
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
    try {
      const resizedImage = await resizeImage(localImage.uploadableImage, 1000);
      const uploadedImage = await uploadImage(resizedImage, 'hostLogoUpload');
      await call('assignHostLogo', uploadedImage);
      message.success(t('logo.message.success'));
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      setUploading(false);
    }
  };

  const isImage =
    (localImage && localImage.uploadableImageLocal) || (currentHost && currentHost.logo);

  const tabs = [
    {
      title: t('settings.tabs.info'),
      path: '/admin/settings/organization',
      content: (
        <AlphaContainer>
          <Text mb="3" fontWeight="bold">
            {t('info.info')}
          </Text>
          <SettingsForm initialValues={localSettings} onSubmit={handleFormSubmit} />
        </AlphaContainer>
      ),
    },
    {
      title: t('settings.tabs.logo'),
      path: '/admin/settings/logo',
      content: (
        <AlphaContainer>
          <Text mb="3" fontWeight="bold">
            {t('logo.info')}
          </Text>
          <Box>
            <FileDropper
              uploadableImageLocal={localImage && localImage.uploadableImageLocal}
              imageUrl={currentHost && currentHost.logo}
              setUploadableImage={setUploadableImage}
              width={isImage && '120px'}
              height={isImage && '80px'}
            />
          </Box>
          {localImage && localImage.uploadableImageLocal && (
            <Center p="2">
              <Button onClick={() => uploadLogo()}>Confirm</Button>
            </Center>
          )}
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
      title: t('settings.tabs.cats'),
      path: '/admin/settings/categories',
      content: (
        <AlphaContainer>
          <Heading as="h3" size="md">
            {t('categories.label')}
          </Heading>
          <Text mb="3">{t('categories.info')}</Text>
          <Center>
            <Wrap p="1" spacing="2" mb="2">
              {categories.map((category) => (
                <WrapItem key={category.label}>
                  <Tag colorScheme="messenger">
                    <TagLabel fontWeight="bold">{category.label.toUpperCase()}</TagLabel>
                    <TagCloseButton onClick={() => removeCategory(category._id)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Center>
          <form onSubmit={addNewCategory}>
            <Center>
              <HStack>
                <Input
                  placeholder="PAJAMAS"
                  mt="2"
                  value={categoryInput}
                  onChange={(event) => handleCategoryInputChange(event.target.value)}
                />
                <Button type="submit">{tc('actions.add')}</Button>
              </HStack>
            </Center>
          </form>
        </AlphaContainer>
      ),
    },
  ];
  const pathname = history?.location?.pathname;
  const tabIndex = tabs && tabs.findIndex((tab) => tab.path === pathname);

  if (tabs && !tabs.find((tab) => tab.path === pathname)) {
    return <Redirect to={tabs[0].path} />;
  }

  return (
    <>
      <Breadcrumb />
      <Template
        heading={t('settings.label')}
        leftContent={
          <Box>
            <ListMenu pathname={pathname} list={adminMenu} />
          </Box>
        }
      >
        <Tabs index={tabIndex} tabs={tabs} />

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
  return (
    <Box px="4" maxWidth={400}>
      {children}
    </Box>
  );
}
