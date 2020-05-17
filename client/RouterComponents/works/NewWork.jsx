import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Alert } from 'antd/lib';

import { UserContext } from '../../LayoutContainer';
import WorkForm from '../../UIComponents/WorkForm';
import Template from '../../UIComponents/Template';
import { parseTitle, call, resizeImage, uploadImage } from '../../functions';

const successCreation = () => {
  message.success('New work is successfully created', 6);
};

class NewWork extends React.Component {
  state = {
    formValues: {
      title: '',
      shortDescription: '',
      longDescription: ''
    },
    uploadableImages: [],
    uploadableImagesLocal: [],
    uploadedImages: [],
    isLocalising: false,
    isCreating: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newWorkId: null
  };

  handleFormChange = value => {
    const { formValues } = this.state;
    const newFormValues = {
      ...value,
      longDescription: formValues.longDescription
    };

    this.setState({
      formValues: newFormValues
    });
  };

  handleQuillChange = longDescription => {
    const { formValues } = this.state;
    const newFormValues = {
      ...formValues,
      longDescription
    };

    this.setState({
      formValues: newFormValues
    });
  };

  setUploadableImages = files => {
    this.setState({
      isLocalising: true
    });
    console.log(files);

    files.forEach((uploadableImage, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(uploadableImage);
      console.log(uploadableImage);
      reader.addEventListener(
        'load',
        () => {
          this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
            uploadableImages: [...uploadableImages, uploadableImage],
            uploadableImagesLocal: [...uploadableImagesLocal, reader.result]
          }));
        },
        false
      );
      if (files.length === index + 1) {
        this.setState({
          isLocalising: false
        });
      }
    });
  };

  createWork = async () => {
    this.setState({
      isCreating: true
    });
    const { formValues, images } = this.state;
    try {
      const respond = await call('createWork', formValues, images);
      this.setState({ newWorkId: respond });
      message.success('You work is successfully created');
      this.setState({ isCreating: false });
    } catch (error) {
      message.error('Could not create work due to ', error.error);
      this.setState({ isCreating: false });
    }
  };

  removeWork = workId => {
    console.log(workId);
  };

  render() {
    const { currentUser } = this.context;

    if (!currentUser) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to create an account to create work"
            type="error"
          />
        </div>
      );
    }

    const {
      formValues,
      isLoading,
      uploadableImagesLocal,
      isSuccess,
      newWorkId,
      isCreating
    } = this.state;

    if (isSuccess && newWorkId) {
      successCreation();
      return <Redirect to={`/work/${newWorkId}`} />;
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
      <Template heading="Create New Work">
        <WorkForm
          formValues={formValues}
          onFormChange={this.handleFormChange}
          onQuillChange={this.handleQuillChange}
          onSubmit={this.handleSubmit}
          setUploadableImages={this.setUploadableImages}
          uploadableImagesLocal={uploadableImagesLocal}
          buttonLabel={buttonLabel}
          isFormValid={isFormValid}
          isButtonDisabled={!isFormValid || isCreating}
        />
      </Template>
    );
  }
}

NewWork.contextType = UserContext;

export default NewWork;
