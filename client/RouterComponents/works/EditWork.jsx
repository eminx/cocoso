import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';

import { UserContext } from '../../LayoutContainer';
import WorkForm from '../../UIComponents/WorkForm';
import Template from '../../UIComponents/Template';
import { message, Alert } from '../../UIComponents/message';
import { call, resizeImage, uploadImage } from '../../functions';

class EditWork extends PureComponent {
  state = {
    formValues: {
      title: '',
      shortDescription: '',
      longDescription: '',
      additionalInfo: ''
    },
    images: [],
    imagesReadyToSave: [],
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
        images: response.images.map(image => ({
          src: image,
          type: 'uploaded'
        }))
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
      reader.addEventListener(
        'load',
        () => {
          this.setState(({ images }) => ({
            images: [
              ...images,
              {
                resizableData: uploadableImage,
                type: 'not-uploaded',
                src: reader.result
              }
            ]
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
    const { images } = this.state;
    this.setState({
      isCreating: true
    });

    const uploadableImages = images.map(image => image.type === 'not-uploaded');

    if (uploadableImages.length === 0) {
      this.updateWork();
      return;
    }

    try {
      images.forEach(async (uploadableImage, index) => {
        if (uploadableImage.type === 'uploaded') {
          this.setImageAndContinue(uploadableImage.src, index);
        } else {
          const resizedImage = await resizeImage(
            uploadableImage.resizableData,
            500
          );
          const uploadedImage = await uploadImage(
            resizedImage,
            'workImageUpload'
          );

          this.setImageAndContinue(uploadedImage, index);
        }
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

  setImageAndContinue = (uploadedImage, imageIndex) => {
    const { images } = this.state;
    this.setState(({ imagesReadyToSave }) => ({
      imagesReadyToSave: [...imagesReadyToSave, uploadedImage]
    }));
    if (images.length === imageIndex + 1) {
      this.updateWork();
    }
  };

  updateWork = async () => {
    const { match } = this.props;
    const workId = match.params.workId;
    const { formValues, imagesReadyToSave } = this.state;

    try {
      await call('updateWork', workId, formValues, imagesReadyToSave);
      this.setState({
        isCreating: false,
        isSuccess: true
      });
      message.success('Your work is successfully updated');
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
    const workId = match.params.workId;

    if (!currentUser) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert message="Not allowed" type="error" />
        </div>
      );
    }

    const { formValues, images, isSuccess, isCreating } = this.state;

    if (isSuccess) {
      return <Redirect to={`/${currentUser.username}/work/${workId}`} />;
    }

    const buttonLabel = isCreating
      ? 'Updating your work...'
      : 'Confirm and Update Work';
    const { title } = formValues;
    const isFormValid = formValues && title.length > 3 && images.length > 0;

    return (
      <Template heading="Update Work">
        <WorkForm
          formValues={formValues}
          onFormChange={this.handleFormChange}
          onQuillChange={this.handleQuillChange}
          onSubmit={this.uploadImages}
          setUploadableImages={this.setUploadableImages}
          images={images.map(image => image.src)}
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
