import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, message, Alert } from 'antd/lib';

import { Box, CheckBox, Heading, Paragraph, Text, FormField } from 'grommet';

import CreateGroupForm from '../../UIComponents/CreateGroupForm';
import { emailIsValid } from '../../functions';
import Loader from '../../UIComponents/Loader';

const successCreation = () => {
  message.success('Your group is successfully created', 6);
};

const privateParagraph1 =
    "Private groups are only visible by their members, and participation is possible only via invites by their admins. You can not change it to public after you've created it.",
  privateParagraph2 =
    "You will be able to manage the invites after you'll have created the group.";

class NewGroup extends React.Component {
  state = {
    formValues: {
      title: '',
      readingMaterial: '',
      description: '',
      capacity: 12
    },
    isLoading: false,
    isSuccess: false,
    isError: false,
    isPrivate: false,
    newGroupId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null,
    isCreating: false
  };

  handleFormChange = value => {
    const { formValues } = this.state;
    let capacity = parseInt(value.capacity) || 2;
    if (capacity > 30) {
      capacity = 30;
    }

    const newFormValues = {
      ...value,
      capacity,
      description: formValues.description
    };

    this.setState({
      formValues: newFormValues
    });
  };

  handleQuillChange = description => {
    const { formValues } = this.state;
    const newFormValues = {
      ...formValues,
      description
    };

    this.setState({
      formValues: newFormValues
    });
  };

  handleSubmit = () => {
    this.setState({
      isCreating: true
    });
    this.uploadImage();
  };

  setUploadableImage = e => {
    const theImageFile = e.file.originFileObj;
    const reader = new FileReader();
    reader.readAsDataURL(theImageFile);
    reader.addEventListener(
      'load',
      () => {
        this.setState({
          uploadableImage: theImageFile,
          uploadableImageLocal: reader.result
        });
      },
      false
    );
  };

  uploadImage = () => {
    const { uploadableImage } = this.state;
    const upload = new Slingshot.Upload('groupImageUpload');

    upload.send(uploadableImage, (error, imageUrl) => {
      if (error) {
        console.error('Error uploading:', error);
        message.error(error.reason);
        this.setState({
          isCreating: false
        });
      } else {
        this.setState(
          {
            uploadedImageUrl: imageUrl
          },
          () => this.createGroup()
        );
      }
    });
  };

  createGroup = () => {
    const { formValues, uploadedImageUrl, isPrivate } = this.state;

    Meteor.call(
      'createGroup',
      formValues,
      uploadedImageUrl,
      isPrivate,
      (error, respond) => {
        if (error) {
          console.log('error', error);
          message.error(error.reason);
          this.setState({
            isCreating: false,
            isError: true
          });
        } else {
          this.setState({
            isCreating: false,
            newGroupId: respond,
            isSuccess: true
          });
        }
      }
    );
  };

  handlePrivateGroupSwitch = () => {
    const { isPrivate } = this.state;
    this.setState({
      isPrivate: !isPrivate
    });
  };

  render() {
    const { currentUser } = this.props;

    if (!currentUser || !currentUser.isRegisteredMember) {
      return (
        <div style={{ maxWidth: 600, margin: '24px auto' }}>
          <Alert
            message="You have to become a registered member to create a group."
            type="error"
          />
        </div>
      );
    }

    const {
      formValues,
      isLoading,
      isSuccess,
      newGroupId,
      uploadableImageLocal,
      isPrivate,
      isCreating
    } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    // if (isCreating) {

    // }

    if (isSuccess) {
      successCreation();
      return <Redirect to={`/group/${newGroupId}`} />;
    }

    const buttonLabel = isCreating
      ? 'Creating your group...'
      : 'Confirm and Create Group';
    const { title, description } = formValues;
    const isFormValid =
      formValues &&
      title.length > 3 &&
      description.length > 20 &&
      uploadableImageLocal;

    return (
      <div style={{ padding: 24 }}>
        {currentUser.isRegisteredMember && (
          <div>
            <Row gutter={48}>
              <Col xs={24} sm={24} md={6} />

              <Col xs={24} sm={24} md={12}>
                <Heading level={3}>Create a New Group</Heading>
                <FormField>
                  <CheckBox
                    checked={isPrivate}
                    label={<Text>Private group? (invite-only)</Text>}
                    onChange={this.handlePrivateGroupSwitch}
                  />
                  {isPrivate && (
                    <Box margin={{ top: 'small' }}>
                      <Paragraph size="small">{privateParagraph1}</Paragraph>
                      <Paragraph size="small">{privateParagraph2}</Paragraph>
                    </Box>
                  )}
                </FormField>

                <CreateGroupForm
                  formValues={formValues}
                  onFormChange={this.handleFormChange}
                  onQuillChange={this.handleQuillChange}
                  onSubmit={this.handleSubmit}
                  setUploadableImage={this.setUploadableImage}
                  uploadableImageLocal={uploadableImageLocal}
                  buttonLabel={buttonLabel}
                  isFormValid={isFormValid}
                  isButtonDisabled={!isFormValid || isCreating}
                />
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }
}

export default NewGroup;
