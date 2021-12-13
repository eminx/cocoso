import React from 'react';
import { Redirect } from 'react-router-dom';
import { Box, CheckBox, Paragraph, Text, FormField } from 'grommet';

import ProcessForm from '../../UIComponents/ProcessForm';
import { call } from '../../functions';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import { message, Alert } from '../../UIComponents/message';
import { resizeImage, uploadImage } from '../../functions';
import { StateContext } from '../../LayoutContainer';

const successCreation = () => {
  message.success('Your process is successfully created', 6);
};

const privateParagraph1 =
    "Private processes are only visible by their members, and participation is possible only via invites by their admins. You can not change it to public after you've created it.",
  privateParagraph2 =
    "You will be able to manage the invites after you'll have created the process.";

class NewProcess extends React.Component {
  state = {
    formValues: {
      title: '',
      readingMaterial: '',
      description: '',
      capacity: 12,
    },
    isLoading: false,
    isSuccess: false,
    isError: false,
    isPrivate: false,
    newProcessId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null,
    isCreating: false,
  };

  handleFormChange = (value) => {
    const { formValues } = this.state;
    let capacity = parseInt(value.capacity) || 2;
    if (capacity > 30) {
      capacity = 30;
    }

    const newFormValues = {
      ...value,
      capacity,
      description: formValues.description,
    };

    this.setState({
      formValues: newFormValues,
    });
  };

  handleQuillChange = (description) => {
    const { formValues } = this.state;
    const newFormValues = {
      ...formValues,
      description,
    };

    this.setState({
      formValues: newFormValues,
    });
  };

  handleSubmit = () => {
    this.setState({
      isCreating: true,
    });
    this.uploadImage();
  };

  setUploadableImage = (files) => {
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
          uploadableImageLocal: reader.result,
        });
      },
      false
    );
  };

  uploadImage = async () => {
    const { uploadableImage } = this.state;
    try {
      const resizedImage = await resizeImage(uploadableImage, 1200);
      const uploadedImage = await uploadImage(
        resizedImage,
        'processImageUpload'
      );
      this.setState(
        {
          uploadedImage,
        },
        () => this.createProcess()
      );
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
      });
    }
  };

  createProcess = async () => {
    const { formValues, uploadedImage, isPrivate } = this.state;

    try {
      const response = await call(
        'createProcess',
        formValues,
        uploadedImage,
        isPrivate
      );
      this.setState({
        isCreating: false,
        newProcessId: response,
        isSuccess: true,
      });
    } catch (error) {
      message.error(error.error);
      this.setState({
        isCreating: false,
        isError: true,
      });
    }
  };

  handlePrivateProcessSwitch = () => {
    const { isPrivate } = this.state;
    this.setState({
      isPrivate: !isPrivate,
    });
  };

  render() {
    const { currentUser } = this.props;
    const { canCreateContent } = this.context;

    if (!currentUser || !canCreateContent) {
      return (
        <div style={{ maxWidth: 600, margin: '24px auto' }}>
          <Alert
            message="You have to become a contributor to create a process."
            type="error"
          />
        </div>
      );
    }

    const {
      formValues,
      isLoading,
      isSuccess,
      newProcessId,
      uploadableImageLocal,
      isPrivate,
      isCreating,
    } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    if (isSuccess) {
      successCreation();
      return <Redirect to={`/process/${newProcessId}`} />;
    }

    const buttonLabel = isCreating
      ? 'Creating your process...'
      : 'Confirm and Create Process';
    const { title, description } = formValues;
    const isFormValid =
      formValues &&
      title.length > 3 &&
      description.length > 20 &&
      uploadableImageLocal;

    return (
      <Template heading="Create a New Process">
        <FormField>
          <CheckBox
            checked={isPrivate}
            label={<Text>Private process? (invite-only)</Text>}
            onChange={this.handlePrivateProcessSwitch}
          />
          {isPrivate && (
            <Box margin={{ top: 'small' }}>
              <Paragraph size="small">{privateParagraph1}</Paragraph>
              <Paragraph size="small">{privateParagraph2}</Paragraph>
            </Box>
          )}
        </FormField>

        <ProcessForm
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

NewProcess.contextType = StateContext;

export default NewProcess;
