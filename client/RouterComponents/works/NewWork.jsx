import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Alert } from 'antd/lib';

import { UserContext } from '../../LayoutContainer';
import WorkForm from '../../UIComponents/WorkForm';
import Template from '../../UIComponents/Template';
import { call, resizeImage, uploadImage } from '../../functions';

const successCreation = () => {
  message.success('New work is successfully created', 6);
};

class NewWork extends React.Component {
  state = {
    formValues: {
      title: '',
      shortDescription: '',
      longDescription: '',
      additionalInfo: ''
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

  uploadImages = () => {
    const { uploadableImages } = this.state;
    this.setState({
      isCreating: true
    });

    try {
      uploadableImages.forEach(async (uploadableImage, index) => {
        const resizedImage = await resizeImage(uploadableImage, 500);
        const uploadedImage = await uploadImage(
          resizedImage,
          'workImageUpload'
        );
        this.setState(
          ({ uploadedImages }) => ({
            uploadedImages: [...uploadedImages, uploadedImage]
          }),
          this.createWork
        );
      });
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
        isError: true
      });
    }
  };

  createWork = async () => {
    const { uploadedImages, uploadableImages, formValues } = this.state;
    if (uploadableImages.length !== uploadedImages.length) {
      return;
    }

    try {
      const respond = await call('createWork', formValues, uploadedImages);
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
      ? 'Creating your work...'
      : 'Confirm and Create Work';
    const { title } = formValues;
    const isFormValid = formValues && title.length > 3 && uploadableImagesLocal;

    return (
      <Template heading="Create New Work">
        <WorkForm
          formValues={formValues}
          onFormChange={this.handleFormChange}
          onQuillChange={this.handleQuillChange}
          onSubmit={this.uploadImages}
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
