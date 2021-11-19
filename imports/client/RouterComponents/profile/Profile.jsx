import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { Anchor, Box, Button, Heading, Text } from 'grommet';

import Personal from './Personal';
import ListMenu from '../../UIComponents/ListMenu';
import Template from '../../UIComponents/Template';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { message } from '../../UIComponents/message';
import { userMenu } from '../../constants/general';
import { call, resizeImage, uploadImage } from '../../functions';
import FileDropper from '../../UIComponents/FileDropper';
import Loader from '../../UIComponents/Loader';
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
          <Fragment>
            <Box pad="medium">
              <ListMenu pathname={pathname} list={userMenu} />
            </Box>
          </Fragment>
        }
      >
        <Box alignSelf="center" margin={{ bottom: 'medium' }} pad="small">
          {['admin', 'contributor', 'participant'].includes(role) ? (
            <Text textAlign="center" size="small">
              You as <b>{currentUser.username}</b> are part of this organisation
              with the <b>{role}</b> role
            </Text>
          ) : (
            <Box alignSelf="center">
              <Text>You are not part of this organisation. </Text>
              <Button onClick={() => this.setSelfAsParticipant()}>
                Join as participant
              </Button>
            </Box>
          )}
        </Box>

        <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
          <Box margin={{ bottom: 'large' }}>
            <Heading level={3} margin={{ bottom: 'medium' }} textAlign="center">
              Avatar
            </Heading>
            <Box
              width="120px"
              height="120px"
              round
              style={{ overflow: 'hidden' }}
              alignSelf="center"
            >
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
            {uploadableAvatarLocal && (
              <Box align="center" gap="small">
                <Button
                  onClick={() =>
                    this.setState({
                      uploadableAvatar: null,
                      uploadableAvatarLocal: null,
                    })
                  }
                  color="status-critical"
                  margin={{ top: 'small' }}
                  size="small"
                  label="Remove"
                  plain
                />

                <Button
                  onClick={() => this.uploadAvatar()}
                  label="Confirm & Upload"
                  size="small"
                  disabled={isUploading}
                />
                {isUploading && <Loader />}
              </Box>
            )}
          </Box>
          <Box>
            <Heading
              level={3}
              margin={{ bottom: 'small', top: 'medium' }}
              textAlign="center"
            >
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

        <Box
          direction="row"
          justify="around"
          margin={{ top: 'large' }}
          background="light-4"
          pad="medium"
        >
          <Button onClick={() => this.logout()} size="small" label="Log out" />
          <Button
            onClick={() => this.setState({ isDeleteModalOn: true })}
            color="status-critical"
            plain
            size="small"
            label="Delete Account"
          />
        </Box>
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
