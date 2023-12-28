import { Meteor } from 'meteor/meteor';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Redirect, Route, Switch as RouteSwitch, useLocation, useParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import ProfileForm from './ProfileForm';
import Breadcrumb from '../../components/Breadcrumb';
import ConfirmModal from '../../components/ConfirmModal';
import { message } from '../../components/message';
import { call, resizeImage, uploadImage } from '../../utils/shared';
import FormSwitch from '../../components/FormSwitch';
import { StateContext } from '../../LayoutContainer';
import AvatarUploader from './AvatarUploader';
import Tabs from '../../components/Tabs';
import ChangeLanguage from '../../components/ChangeLanguageMenu';
import Template from '../../components/Template';

function EditProfile({ history }) {
  const [isDeleteModalOn, setIsDeleteModalOn] = useState(false);
  const [isLeaveModalOn, setIsLeaveModalOn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadableAvatarLocal, setUploadableAvatarLocal] = useState(null);
  const [uploadableAvatar, setUploadableAvatar] = useState(null);
  const [lang, setLang] = useState(null);
  const location = useLocation();
  const { currentHost, currentUser, hue, platform, role } = useContext(StateContext);
  const { username } = useParams();
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  useLayoutEffect(() => {
    setLang(currentUser?.lang);
  }, [currentUser]);

  if (!currentUser || currentUser.username !== username) {
    return <Redirect to="/login" />;
  }

  const handleSetUploadableAvatar = (files) => {
    if (!files) {
      setUploadableAvatar(null);
      setUploadableAvatarLocal(null);
      return;
    }

    const uploadableAvatar = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(uploadableAvatar);
    reader.addEventListener(
      'load',
      () => {
        setUploadableAvatar(uploadableAvatar);
        setUploadableAvatarLocal(reader.result);
      },
      false
    );
  };

  const uploadAvatar = async () => {
    setIsUploading(true);

    try {
      const resizedAvatar = await resizeImage(uploadableAvatar, 1200);
      const uploadedAvatar = await uploadImage(resizedAvatar, 'avatarImageUpload');
      await call('setAvatar', uploadedAvatar);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.your')} ${tc('domains.avatar')}`,
        })
      );
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitInfo = async (values) => {
    const formValues = {
      firstName: values.firstName || '',
      lastName: values.lastName || '',
      bio: values.bio || '',
      contactInfo: values.contactInfo || '',
    };
    try {
      await call('saveUserInfo', formValues);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.your')} ${tc('domains.data')}`,
        })
      );
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const handleSetLanguage = async () => {
    try {
      await call('setPreferredLanguage', lang);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.data')}`,
        })
      );
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const deleteAccount = () => {
    setIsDeleting(true);
    Meteor.call('deleteAccount', (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
        return;
      }
      message.success(tc('message.success.remove'));
      history.push('/');
    });
  };

  const leaveHost = async () => {
    setIsLeaving(true);
    try {
      await call('leaveHost');
      message.success(
        tc('message.success.leave', {
          host: currentHost?.settings?.name,
        })
      );
      Meteor.logout();
      history.push('/');
      setIsLeaveModalOn(false);
    } catch {
      console.log(error);
      message.error(error.reason);
    } finally {
      setIsLeaving(false);
    }
  };

  const setProfilePublic = async (isPublic) => {
    try {
      await call('setProfilePublic', isPublic);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.profile')}`,
        })
      );
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const setProfilePublicGlobally = async (isPublic) => {
    try {
      await call('setProfilePublicGlobally', isPublic);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.profile')}`,
        })
      );
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const removeAvatar = async () => {
    try {
      await call('setAvatar', null);
      message.success(
        tc('message.success.save', {
          domain: `${tc('domains.profile')}`,
        })
      );
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const furtherBreadcrumbLinks = [
    {
      label: currentUser.username,
      link: `/@${currentUser.username}`,
    },
    {
      label: tc('actions.update'),
      link: null,
    },
  ];

  const isMember = ['admin', 'contributor', 'participant'].includes(role);
  const currentMembership = currentUser.memberships.find((m) => m.host === currentHost.host);
  const isUserPublic = Boolean(currentMembership.isPublic);
  const isUserPublicGlobally = currentUser.isPublic;
  const communityName = currentHost?.settings?.name;

  if (!isMember) {
    return (
      <Center p="8">
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t('profile.message.deny')}</AlertTitle>
        </Alert>
      </Center>
    );
  }

  const tabs = [
    {
      title: tc('menu.member.general'),
      path: `/@${currentUser.username}/edit/general`,
      content: (
        <Box>
          <Heading mb="4" size="sm">
            {t('profile.image')}
          </Heading>
          <AvatarUploader
            imageUrl={uploadableAvatarLocal || (currentUser.avatar && currentUser.avatar.src)}
            isUploading={isUploading}
            uploadableAvatarLocal={uploadableAvatarLocal}
            removeAvatar={removeAvatar}
            uploadAvatar={uploadAvatar}
            setUploadableAvatar={handleSetUploadableAvatar}
            setUploadableAvatarLocal={setUploadableAvatarLocal}
          />
          <Box py="2">
            <Heading mb="2" size="sm">
              {t('profile.label')}
            </Heading>
            <Box>
              <ProfileForm defaultValues={currentUser} onSubmit={handleSubmitInfo} />
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      title: t('profile.menu.language'),
      path: `/@${currentUser.username}/edit/language`,
      content: (
        <Box>
          <Heading mb="4" size="sm">
            {tc('langs.form.label')}
          </Heading>
          <ChangeLanguage
            currentLang={currentUser?.lang}
            hideHelper
            select
            onChange={(lang) => setLang(lang)}
          />

          <Flex justify="flex-end" mt="4">
            <Button disabled={lang === currentUser.lang} onClick={handleSetLanguage}>
              {tc('actions.submit')}
            </Button>
          </Flex>
        </Box>
      ),
    },
    {
      title: t('profile.menu.privacy'),
      path: `/@${currentUser.username}/edit/privacy`,
      content: (
        <Box>
          <Box mb="4">
            <Heading size="md" pb="4">
              {platform?.name}{' '}
              <Text as="span" fontSize="md" fontWeight="light" textTransform="lowercase">
                {tc('domains.platform')}
              </Text>
            </Heading>
            <FormSwitch
              colorScheme="green"
              isChecked={isUserPublicGlobally}
              label={t('profile.makePublic.labelGlobal')}
              onChange={({ target: { checked } }) => setProfilePublicGlobally(checked)}
            />
            <Text fontSize="sm" my="2">
              {t('profile.makePublic.helperTextGlobal')}
            </Text>
          </Box>

          <Divider my="4" />

          <Box pl="4">
            <Heading size="md" pb="4">
              {communityName}{' '}
              <Text as="span" fontSize="md" fontWeight="light" textTransform="lowercase">
                {tc('domains.community')}
              </Text>
            </Heading>

            <Alert bg="white" status="info" p="0">
              <AlertIcon color="gray.800" />
              <Text fontSize="sm">
                <Trans
                  i18nKey="accounts:profile.message.role"
                  defaults="You as <bold>{{ username }}</bold> are part of {{ host }} with the <bold>{{ role }}</bold> role"
                  values={{
                    host: communityName,
                    role,
                    username: currentUser.username,
                  }}
                  components={{ bold: <strong /> }}
                />
              </Text>
            </Alert>

            <Box py="4">
              <FormSwitch
                colorScheme="green"
                isChecked={isUserPublic}
                isDisabled={!isUserPublicGlobally || currentHost.isPortalHost}
                label={t('profile.makePublic.label')}
                onChange={({ target: { checked } }) => setProfilePublic(checked)}
              />
              <Text fontSize="sm" my="2">
                {t('profile.makePublic.helperText')}
              </Text>
            </Box>

            <Box py="2">
              <Button colorScheme="red" size="sm" onClick={() => setIsLeaveModalOn(true)}>
                {t('actions.leave', { host: communityName })}
              </Button>
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      title: t('profile.menu.keywords.label'),
      path: `/@${currentUser.username}/edit/keywords`,
      content: (
        <Box>
          <KeywordsManager currentUser={currentUser} />
        </Box>
      ),
    },
  ];

  const pathname = location?.pathname;
  const tabIndex = tabs && tabs.findIndex((tab) => tab.path === pathname);

  if (tabs && !tabs.find((tab) => tab.path === pathname)) {
    return <Redirect to={tabs[0].path} />;
  }

  return (
    <>
      <Template>
        <Box>
          <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
        </Box>

        <Box mb="8">
          <Box pt="4" mb="8">
            <Heading color="gray.800" size="lg">
              <Text as="span" fontWeight="normal">
                {t('profile.settings')}
              </Text>
            </Heading>
          </Box>

          <Box>
            <Heading size="md">
              {platform?.name}{' '}
              <Text as="span" fontSize="md" fontWeight="light" textTransform="lowercase">
                {tc('domains.platform')}
              </Text>
            </Heading>

            <Alert bg="none" mb="4" status="info">
              <AlertIcon color="gray.800" />
              <Text fontSize="sm" mr="4">
                {t('profile.message.platform', { platform: platform?.name })}
              </Text>
            </Alert>

            <Tabs index={tabIndex} mb="4" tabs={tabs} />

            <Box>
              <RouteSwitch history={history}>
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
              </RouteSwitch>
            </Box>

            <Divider my="4" />
          </Box>

          <Box bg="red.100">
            <VStack spacing="4" p="4">
              <Button colorScheme="red" size="sm" onClick={() => setIsDeleteModalOn(true)}>
                {t('delete.action')}
              </Button>
            </VStack>
          </Box>

          <ConfirmModal
            visible={isLeaveModalOn}
            title={t('leave.title')}
            confirmText={t('leave.label')}
            confirmButtonProps={{
              colorScheme: 'red',
              isLoading: isLeaving,
            }}
            onConfirm={leaveHost}
            onCancel={() => setIsLeaveModalOn(false)}
          >
            <Text>{t('leave.body')}</Text>
          </ConfirmModal>

          <ConfirmModal
            visible={isDeleteModalOn}
            title={t('delete.title')}
            confirmText={t('delete.label')}
            confirmButtonProps={{
              colorScheme: 'red',
              isLoading: isDeleting,
              isDisabled: isDeleting,
            }}
            onConfirm={deleteAccount}
            onCancel={() => setIsDeleteModalOn(false)}
          >
            <Text>{t('delete.body')}</Text>
          </ConfirmModal>
        </Box>
      </Template>
    </>
  );
}

const animatedComponents = makeAnimated();

function KeywordsManager({ currentUser }) {
  const [allKeywords, setAllKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [creating, setCreating] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getKeywords();
  }, []);

  const getKeywords = async () => {
    try {
      const respond = await call('getKeywords');
      setAllKeywords(respond);
      const selfKeywords = respond.filter((k) =>
        currentUser?.keywords?.map((kw) => kw.keywordId).includes(k._id)
      );
      setSelectedKeywords(selfKeywords);
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const saveKeywords = async () => {
    try {
      await call('saveKeywords', selectedKeywords);
      setIsChanged(false);
      message.success('success');
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const createKeyword = async (keyword) => {
    setCreating(true);
    try {
      const respond = await call('createKeyword', keyword);
      message.success('success created');
      setSelectedKeywords([
        ...selectedKeywords,
        {
          label: keyword,
          _id: respond,
        },
      ]);
      setAllKeywords([
        ...allKeywords,
        {
          label: keyword,
          _id: respond,
        },
      ]);
      setCreating(false);
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const handleChange = (value) => {
    setSelectedKeywords(value);
    setIsChanged(true);
  };

  return (
    <Box>
      <Heading mb="2" size="sm">
        {t('profile.menu.keywords.label')}
      </Heading>
      <Text fontSize="sm" mb="4">
        {t('profile.menu.keywords.description')}
      </Text>
      <CreatableSelect
        components={animatedComponents}
        isClearable
        isLoading={creating}
        isMulti
        options={allKeywords}
        placeholder="Type something and press enter..."
        style={{ width: '100%', marginTop: '1rem' }}
        value={selectedKeywords}
        getOptionValue={(option) => option._id}
        onChange={(newValue) => handleChange(newValue)}
        onCreateOption={(newKeyword) => createKeyword(newKeyword)}
      />

      <Flex justify="flex-end" mt="4">
        <Button isDisabled={!isChanged} onClick={() => saveKeywords()}>
          {tc('actions.submit')}
        </Button>
      </Flex>
    </Box>
  );
}

export default EditProfile;
