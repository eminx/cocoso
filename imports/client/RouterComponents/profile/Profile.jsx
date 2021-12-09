import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react';

import Personal from './Personal';
import ListMenu from '../../UIComponents/ListMenu';
import Template from '../../UIComponents/Template';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { message } from '../../UIComponents/message';
import { userMenu } from '../../constants/general';
import { call, resizeImage, uploadImage } from '../../functions';
import FileDropper from '../../UIComponents/FileDropper';
// import Loader from '../../UIComponents/Loader';
import { StateContext } from '../../LayoutContainer';

const personalModel = {
  firstName: '',
  lastName: '',
};

class Profile extends React.Component {
  state = {
    isDeleteModalOn: false,
    personal: personalModel,
    bio: '',
    uploadableAvatarLocal: null,
    uploadableAvatar: null,
  };

  componentDidMount() {
    this.setInitialPersonalInfo();
  }

  setInitialPersonalInfo = () => {
    const { currentUser } = this.props;
    if (!currentUser) {
      return;
    }
    this.setState({
      personal: {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
      },
      bio: currentUser.bio || '',
      contactInfo: currentUser.contactInfo || '',
    });
  };

  handleFormChange = (formValues) => {
    this.setState({
      personal: formValues,
    });
  };

  handleSubmit = () => {
    const { personal, bio, contactInfo } = this.state;
    this.setState({
      isSaving: true,
    });

    const values = {
      ...personal,
      bio,
      contactInfo,
    };
    Meteor.call('saveUserInfo', values, (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
      } else {
        message.success('Your data is successfully saved');
        this.setState({
          isSaving: false,
        });
      }
    });
  };

  setUploadableAvatar = (files) => {
    this.setState({
      isLocalising: true,
    });

    const uploadableAvatar = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(uploadableAvatar);
    reader.addEventListener(
      'load',
      () => {
        this.setState({
          uploadableAvatar,
          uploadableAvatarLocal: reader.result,
          isLocalising: false,
        });
      },
      false
    );
  };

  uploadAvatar = async () => {
    const { uploadableAvatar } = this.state;
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
      message.success('Your avatar is successfully set');
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
        isUploading: false,
        isError: true,
      });
    }
  };

  deleteAccount = () => {
    Meteor.call('deleteAccount', (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
        return;
      }
    });
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  logout = () => {
    Meteor.logout();
  };

  setSelfAsParticipant = async () => {
    try {
      await call('setSelfAsParticipant');
      message.success('You are successfully set as participant');
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    }
  };

  render() {
    const { currentUser, history } = this.props;
    const { role } = this.context;

    if (!currentUser) {
      return <Redirect to="/login" />;
    }

    const {
      personal,
      bio,
      contactInfo,
      isDeleteModalOn,
      uploadableAvatarLocal,
      isUploading,
    } = this.state;

    const pathname = history && history.location.pathname;

    return (
      <Template
        heading={currentUser ? 'Personal Info' : 'Join'}
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
              You as <b>{currentUser.username}</b> are part of this organisation
              with the <b>{role}</b> role
            </Text>
          ) : (
            <Box>
              <Text>You are not part of this organisation. </Text>
              <Button onClick={() => this.setSelfAsParticipant()}>
                Join as participant
              </Button>
            </Box>
          )}
        </Center>

        <Center bg="white" p="4" mb="4">
          <Box mb="4">
            <Heading size="md" mb="2" textAlign="center">
              Avatar
            </Heading>
            <Center style={{ overflow: 'hidden' }}>
              <Box w="120px" h="120px">
                <FileDropper
                  imageUrl={
                    uploadableAvatarLocal ||
                    (currentUser.avatar && currentUser.avatar.src)
                  }
                  label="Click/Drag to upload"
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
                  Remove
                </Button>

                <Button
                  colorScheme="green"
                  isDisabled={isUploading}
                  isLoading={isUploading}
                  size="sm"
                  variant="solid"
                  onClick={() => this.uploadAvatar()}
                >
                  Confirm
                </Button>
              </HStack>
            )}
          </Box>
        </Center>

        <Box bg="white" p="4">
          <Box>
            <Heading mb="1" mt="2" size="md" textAlign="center">
              Personal Info
            </Heading>
            <Personal
              bio={bio}
              contactInfo={contactInfo}
              formValues={personal}
              onBioChange={(bio) => this.setState({ bio })}
              onContactInfoChange={(contactInfo) =>
                this.setState({ contactInfo })
              }
              onFormChange={this.handleFormChange}
              onSubmit={this.handleSubmit}
            />
          </Box>
        </Box>

        <Center>
          <VStack spacing="4" mt="4" p="4">
            <Button variant="outline" onClick={() => this.logout()}>
              Log out
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => this.setState({ isDeleteModalOn: true })}
            >
              Delete Account
            </Button>
          </VStack>
        </Center>

        <ConfirmModal
          visible={isDeleteModalOn}
          title="Are you sure?"
          confirmText="Confirm Deletion"
          onConfirm={this.deleteAccount}
          onCancel={() => this.setState({ isDeleteModalOn: false })}
        >
          <Text>
            You are about to permanently delete your entire account and all data
            associated with that. This is an irreversible action. Are you sure?
          </Text>
        </ConfirmModal>
      </Template>
    );
  }
}

Profile.contextType = StateContext;

export default Profile;
