import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import arrayMove from 'array-move';

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
      additionalInfo: '',
    },
    images: [],
    imagesReadyToSave: [],
    isLocalising: false,
    isCreating: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    lastImage: false,
  };

  componentDidMount() {
    this.getWork();
  }

  componentDidUpdate(prevProps, prevState) {
    const { lastImage } = this.state;
    if (!prevState.lastImage && lastImage) {
      console.log('right');
      debugger;
      this.updateWork();
    }
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
        images: response.images.map((image) => ({
          src: image,
          type: 'uploaded',
        })),
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
      this.setState({
        isLoading: false,
      });
    }
  };

  handleFormChange = (value) => {
    const { formValues } = this.state;
    const newFormValues = {
      ...value,
      longDescription: formValues.longDescription,
    };

    this.setState({
      formValues: newFormValues,
    });
  };

  handleQuillChange = (longDescription) => {
    const { formValues } = this.state;
    const newFormValues = {
      ...formValues,
      longDescription,
    };

    this.setState({
      formValues: newFormValues,
    });
  };

  setUploadableImages = (files) => {
    this.setState({
      isLocalising: true,
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
                src: reader.result,
              },
            ],
          }));
        },
        false
      );
      if (files.length === index + 1) {
        this.setState({
          isLocalising: false,
        });
      }
    });
  };

  uploadImages = async () => {
    const { images } = this.state;
    this.setState({
      isCreating: true,
    });

    const isThereUploadable = images.some(
      (image) => image.type === 'not-uploaded'
    );
    console.log('isThereUploadable', isThereUploadable);
    if (!isThereUploadable) {
      const imageSet = images.map((image) => image.src);
      console.log(imageSet);
      this.setState(
        {
          imagesReadyToSave: imageSet,
        },
        this.updateWork
      );
      return;
    }

    try {
      await Promise.all(
        images.map(async (uploadableImage, index) => {
          console.log('started');
          const lastImage = images.length === index + 1;
          console.log('lastImage', lastImage);
          if (uploadableImage.type === 'uploaded') {
            console.log('uploaded');
            this.setImageAndContinue(uploadableImage.src, lastImage);
          } else {
            console.log('not-uploaded');
            console.log('process started');
            const resizedImage = await resizeImage(
              uploadableImage.resizableData,
              500
            );
            const uploadedImage = await uploadImage(
              resizedImage,
              'workImageUpload'
            );
            console.log('process finished');

            this.setImageAndContinue(uploadedImage, lastImage);
          }
        })
      );
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
        isError: true,
      });
    }
  };

  setImageAndContinue = (image, lastImage) => {
    this.setState(({ imagesReadyToSave }) => ({
      imagesReadyToSave: [...imagesReadyToSave, image],
      lastImage,
    }));
  };

  updateWork = async () => {
    const { match } = this.props;
    const workId = match.params.workId;
    const { formValues, imagesReadyToSave } = this.state;
    console.log(imagesReadyToSave);
    try {
      await call('updateWork', workId, formValues, imagesReadyToSave);
      this.setState({
        isCreating: false,
        isSuccess: true,
      });
      message.success('Your work is successfully updated');
    } catch (error) {
      message.error(error.reason);
      this.setState({ isCreating: false });
    }
  };

  handleRemoveImage = (imageIndex) => {
    this.setState(({ images }) => ({
      images: images.filter((image, index) => imageIndex !== index),
      // unSavedImageChange: true,
    }));
  };

  handleSortImages = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({ images }) => ({
      images: arrayMove(images, oldIndex, newIndex),
      // unSavedImageChange: true,
    }));
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
          images={images.map((image) => image.src)}
          buttonLabel={buttonLabel}
          isFormValid={isFormValid}
          isButtonDisabled={!isFormValid || isCreating}
          onSortImages={this.handleSortImages}
          onRemoveImage={this.handleRemoveImage}
        />
      </Template>
    );
  }
}

EditWork.contextType = UserContext;

export default EditWork;
