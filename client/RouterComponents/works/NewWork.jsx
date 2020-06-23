import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import arrayMove from 'array-move';

import { UserContext } from '../../LayoutContainer';
import WorkForm from '../../UIComponents/WorkForm';
import Template from '../../UIComponents/Template';
import { message, Alert } from '../../UIComponents/message';
import { call, resizeImage, uploadImage } from '../../functions';

class NewWork extends PureComponent {
  state = {
    formValues: {
      title: '',
      shortDescription: '',
      longDescription: '',
      additionalInfo: '',
      category: '',
    },
    categories: [],
    uploadableImages: [],
    uploadableImagesLocal: [],
    isLocalising: false,
    isCreating: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newWorkId: null,
  };

  componentDidMount() {
    this.getCategories();
  }

  getCategories = async () => {
    const categories = await call('getCategories');
    this.setState({
      categories,
    });
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
          this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
            uploadableImages: [...uploadableImages, uploadableImage],
            uploadableImagesLocal: [...uploadableImagesLocal, reader.result],
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
    const { uploadableImages } = this.state;
    this.setState({
      isCreating: true,
    });

    try {
      const imagesReadyToSave = await Promise.all(
        uploadableImages.map(async (uploadableImage, index) => {
          const resizedImage = await resizeImage(uploadableImage, 500);
          const uploadedImage = await uploadImage(
            resizedImage,
            'workImageUpload'
          );
          return uploadedImage;
        })
      );
      this.createWork(imagesReadyToSave);
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
        isError: true,
      });
    }
  };

  createWork = async (imagesReadyToSave) => {
    const { formValues, categories } = this.state;

    const selectedCategory = categories.find(
      (category) => category.label === formValues.category.toLowerCase()
    );
    formValues.category = {
      label: selectedCategory.label,
      color: selectedCategory.color,
      categoryId: selectedCategory._id,
    };

    try {
      const respond = await call('createWork', formValues, imagesReadyToSave);
      this.setState({
        newWorkId: respond,
        isCreating: false,
        isSuccess: true,
      });
      message.success('Your work is successfully created');
    } catch (error) {
      message.error(error.reason);
      this.setState({ isCreating: false });
    }
  };

  handleRemoveImage = (imageIndex) => {
    this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
      uploadableImages: uploadableImages.filter(
        (image, index) => imageIndex !== index
      ),
      uploadableImagesLocal: uploadableImagesLocal.filter(
        (image, index) => imageIndex !== index
      ),
      // unSavedImageChange: true,
    }));
  };

  handleSortImages = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
      uploadableImages: arrayMove(uploadableImages, oldIndex, newIndex),
      uploadableImagesLocal: arrayMove(
        uploadableImagesLocal,
        oldIndex,
        newIndex
      ),
      // unSavedImageChange: true,
    }));
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
      isCreating,
      categories,
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
          categories={categories}
          onFormChange={this.handleFormChange}
          onQuillChange={this.handleQuillChange}
          onSubmit={this.uploadImages}
          setUploadableImages={this.setUploadableImages}
          images={uploadableImagesLocal}
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

NewWork.contextType = UserContext;

export default NewWork;
