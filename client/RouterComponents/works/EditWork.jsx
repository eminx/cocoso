import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { message, Alert } from 'antd/lib';

import { UserContext } from '../../LayoutContainer';
import WorkForm from '../../UIComponents/WorkForm';
import Template from '../../UIComponents/Template';
import { call, resizeImage, uploadImage } from '../../functions';

const successCreation = () => {
  message.success('New work is successfully created', 6);
};

class EditWork extends PureComponent {
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
    isError: false
  };

  componentDidMount() {
    this.getWork();
  }

  getWork = async () => {
    this.setState({ isLoading: true });
    const { match } = this.props;
    const workId = match.params.workId;
    const username = match.params.username;

    try {
      const response = await call('getWork', workId, username);
      this.setState({
        formValues: response,
        uploadableImagesLocal: response.images
      });
    } catch (error) {
      message.error(error.reason);
      this.setState({
        isLoading: false
      });
    }
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

  updateWork = async () => {
    const { uploadedImages, uploadableImages, formValues } = this.state;
    if (uploadableImages.length !== uploadedImages.length) {
      return;
    }

    try {
      const respond = await call('updateWork', formValues, uploadedImages);
      this.setState({
        newWorkId: respond,
        isCreating: false,
        isSuccess: true
      });
      message.success('Your work is successfully created');
    } catch (error) {
      message.error(error.reason);
      this.setState({ isCreating: false });
    }
  };

  removeWork = workId => {
    console.log(workId);
  };

  render() {
    const { currentUser } = this.context;
    const { match } = this.props;

    const workId = match.id;

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
      uploadableImagesLocal,
      isSuccess,
      newWorkId,
      isCreating
    } = this.state;

    if (isSuccess && newWorkId) {
      return <Redirect to={`/${currentUser.username}/work/${newWorkId}`} />;
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

EditWork.contextType = UserContext;

export default EditWork;
