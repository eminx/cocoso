import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Alert } from 'antd/lib';
import { Box, CheckBox, Paragraph, Text, FormField } from 'grommet';

import GroupForm from '../../UIComponents/GroupForm';
import { call } from '../../functions';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import { resizeImage, uploadImage } from '../../functions';

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

  setUploadableImage = files => {
    if (files.length > 1) {
      message.error('Please drop only one file at a time.');
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        this.setState({
          uploadableImage,
          uploadableImageLocal: reader.result
        });
      },
      false
    );
  };

  uploadImage = async () => {
    const { uploadableImage } = this.state;
    try {
      const resizedImage = await resizeImage(uploadableImage, 500);
      const uploadedImage = await uploadImage(resizedImage, 'groupImageUpload');
      this.setState(
        {
          uploadedImage
        },
        () => this.createGroup()
      );
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false
      });
    }
  };

  createGroup = async () => {
    const { formValues, uploadedImage, isPrivate } = this.state;

    try {
      const response = await call(
        'createGroup',
        formValues,
        uploadedImage,
        isPrivate
      );
      this.setState({
        isCreating: false,
        newGroupId: response,
        isSuccess: true
      });
    } catch (error) {
      message.error(error.error);
      this.setState({
        isCreating: false,
        isError: true
      });
    }
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
      <Template heading="Create a New Group">
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

        <GroupForm
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
      </Template>
    );
  }
}

export default NewGroup;
