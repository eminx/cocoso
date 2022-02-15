import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Trans } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react';

import Personal from './Personal';
import ListMenu from '../../components/ListMenu';
import Template from '../../components/Template';
import ConfirmModal from '../../components/ConfirmModal';
import { message } from '../../components/message';
import { userMenu } from '../../@/constants/general';
import { call, resizeImage, uploadImage } from '../../@/shared';
import FileDropper from '../../components/FileDropper';
import { StateContext } from '../../LayoutContainer';

class Profile extends PureComponent {
  state = {
    isDeleteModalOn: false,
    isUploading: false,
    uploadableAvatarLocal: null,
    uploadableAvatar: null,
  };

  handleSubmit = async (values) => {
    const { tc } = this.props;
    try {
      await call('saveUserInfo', values);
      message.success(tc('message.success.save', { domain: `${tc('domains.your')} ${tc('domains.data')}`}));
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  setUploadableAvatar = (files) => {
    const uploadableAvatar = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(uploadableAvatar);
    reader.addEventListener(
      'load',
      () => {
        this.setState({
          uploadableAvatar,
          uploadableAvatarLocal: reader.result,
        });
      },
      false
    );
  };

  uploadAvatar = async () => {
    const { uploadableAvatar } = this.state;
    const { tc } = this.props;

    this.setState({
      isUploading: true,
    });

    try {
      const resizedAvatar = await resizeImage(uploadableAvatar, 1200);
      const uploadedAvatar = await uploadImage(
        resizedAvatar,
        'avatarImageUpload'
      );
      await call('setAvatar', uploadedAvatar);
      this.setState({
        isUploading: false,
      });
      message.success(tc('message.success.save', { domain: `${tc('domains.your')} ${tc('domains.avatar')}`}));
    } catch (error) {
      this.setState({
        isUploading: false,
      });
      console.error('Error uploading:', error);
      message.error(error.reason);
    }
  };

  deleteAccount = async () => {
    const { tc } = this.props;
    try {
      await call('deleteAccount');
      message.success(tc('message.success.remove', { domain: `${tc('domains.your')} ${tc('domains.account')}`}));
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  logout = () => {
    Meteor.logout();
  };

  setSelfAsParticipant = async () => {
    const { t } = this.props;
    try {
      await call('setSelfAsParticipant');
      message.success(t('profile.message.participant'));
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    }
  };

  render() {
    const { currentUser, history, t, tc } = this.props;
    const { role } = this.context;

    if (!currentUser) {
      return <Redirect to="/login" />;
    }

    const { isDeleteModalOn, uploadableAvatarLocal, isUploading } = this.state;

    const pathname = history && history.location.pathname;

    return (
      <Template
        heading={t('profile.label')}
        titleCentered
        leftContent={
          <Box p="2">
            <ListMenu pathname={pathname} list={userMenu} />
          </Box>
        }
      >
        <Center mb="2" pad="1">
          {['admin', 'contributor', 'participant'].includes(role) ? (
            <Text textAlign="center" fontSize="sm">
              <Trans 
                i18nKey="accounts:profile.message.role" 
                defaults="You as <bold>{{ username }}</bold> are part of this organisation with the <bold>{{ role }}</bold> role"
                values={{ username: currentUser.username , role }}
                components={{ bold: <strong /> }}
              />
            </Text>
          ) : (
            <Box>
              <Text>{t('profile.message.deny')}</Text>
              <Button onClick={() => this.setSelfAsParticipant()}>
                {t('profile.label')}
              </Button>
            </Box>
          )}
        </Center>

        <Center bg="white" p="4" mb="4">
          <Box mb="4">
            <Heading size="md" mb="2" textAlign="center">
              {t('profile.form.avatar.label')}
            </Heading>
            <Center style={{ overflow: 'hidden' }}>
              <Box w="120px" h="120px">
                <FileDropper
                  imageUrl={
                    uploadableAvatarLocal ||
                    (currentUser.avatar && currentUser.avatar.src)
                  }
                  label={t('profile.form.avatar.fileDropper')}
                  round
                  height="100%"
                  imageFit="cover"
                  setUploadableImage={this.setUploadableAvatar}
                />
              </Box>
            </Center>
            {uploadableAvatarLocal && (
              <HStack spacing="2" p="4">
                <Button
                  colorScheme="red"
                  margin={{ top: 'small' }}
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    this.setState({
                      uploadableAvatar: null,
                      uploadableAvatarLocal: null,
                    })
                  }
                >
                  {t('profile.form.avatar.remove')}
                </Button>

                <Button
                  colorScheme="green"
                  isDisabled={isUploading}
                  isLoading={isUploading}
                  size="sm"
                  variant="solid"
                  onClick={() => this.uploadAvatar()}
                >
                  {tc('actions.submit')}
                </Button>
              </HStack>
            )}
          </Box>
        </Center>

        <Box bg="white" p="4">
          <Box>
            <Heading mb="1" mt="2" size="md" textAlign="center">
              {t('profile.label')}
            </Heading>
            <Personal
              defaultValues={currentUser}
              onSubmit={this.handleSubmit}
            />
          </Box>
        </Box>

        <Center>
          <VStack spacing="4" mt="4" p="4">
            <Button variant="outline" onClick={() => this.logout()}>
              {t('actions.logout')}
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => this.setState({ isDeleteModalOn: true })}
            >
              {t('delete.action')}
            </Button>
          </VStack>
        </Center>

        <ConfirmModal
          visible={isDeleteModalOn}
          title={t('delete.title')}
          confirmText={t('delete.label')}
          onConfirm={this.deleteAccount}
          onCancel={() => this.setState({ isDeleteModalOn: false })}
        >
          <Text>{t('delete.body')}</Text>
        </ConfirmModal>
      </Template>
    );
  }
}

Profile.contextType = StateContext;

export default Profile;
