import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { Anchor, Box, Button, Text, FormField } from 'grommet';
import { Row, Col } from 'react-grid-system';

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
  bio: '',
  city: '',
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
    });
  };

  handleFormChange = (formValues) => {
    this.setState({
      personal: formValues,
    });
  };

  handleQuillChange = (bio) => {
    this.setState({
      bio,
    });
  };

  handleSubmit = () => {
    const { personal, bio } = this.state;
    this.setState({
      isSaving: true,
    });

    const values = {
      ...personal,
      bio,
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
      const resizedAvatar = await resizeImage(uploadableAvatar, 100);
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
              <ListMenu list={userMenu}>
                {(datum) => (
                  <Anchor
                    onClick={() => history.push(datum.value)}
                    key={datum.value}
                    label={
                      <Text
                        weight={pathname === datum.value ? 'bold' : 'normal'}
                      >
                        {datum.label}
                      </Text>
                    }
                  />
                )}
              </ListMenu>
            </Box>
          </Fragment>
        }
      >
        <Box alignSelf="center" margin={{ bottom: 'medium' }} pad="small">
          {['admin', 'contributor', 'participant'].includes(role) ? (
            <Text textAlign="center">
              You are part of this organisation with the <b>{role}</b> role
            </Text>
          ) : (
            <Box>
              <Text>You are not part of this organisation. </Text>
              <Button secondary onClick={() => this.setAsParticipant()}>
                Join as participant
              </Button>
            </Box>
          )}
        </Box>

        <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
          <Row>
            <Col sm={9}>
              <Personal
                formValues={personal}
                bio={bio}
                onQuillChange={this.handleQuillChange}
                onFormChange={this.handleFormChange}
                onSubmit={this.handleSubmit}
              />
            </Col>
            <Col sm={3}>
              <Box margin={{ bottom: 'medium' }}>
                <FormField label="Avatar" />
                <Box
                  width="120px"
                  height="120px"
                  round
                  style={{ overflow: 'hidden' }}
                  alignSelf="center"
                >
                  <FileDropper
                    setUploadableImage={this.setUploadableAvatar}
                    imageUrl={
                      uploadableAvatarLocal ||
                      (currentUser.avatar && currentUser.avatar.src)
                    }
                    label="Click/Drag to upload"
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
            </Col>
          </Row>
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
            You are about to permanently delete your user information. This is
            an irreversible action.
          </Text>
        </ConfirmModal>
      </Template>
    );
  }
}

Profile.contextType = StateContext;

export default Profile;
