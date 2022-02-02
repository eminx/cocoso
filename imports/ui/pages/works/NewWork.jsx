import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import arrayMove from 'array-move';
import { Box } from '@chakra-ui/react';
import i18n from 'i18next';

import { StateContext } from '../../LayoutContainer';
import WorkForm from '../../components/WorkForm';
import Template from '../../components/Template';
import { message, Alert } from '../../components/message';
import { call, resizeImage, uploadImage } from '../../@/shared';

const formModel = {
  title: '',
  shortDescription: '',
  longDescription: '',
  additionalInfo: '',
  category: '',
};

class NewWork extends PureComponent {
  state = {
    categories: [],
    uploadableImages: [],
    uploadableImagesLocal: [],
    isLocalising: false,
    isCreating: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newWorkId: null,
    values: formModel,
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

  uploadImages = async (formValues) => {
    const { uploadableImages } = this.state;
    this.setState({
      values: formValues,
      isCreating: true,
    });

    try {
      const imagesReadyToSave = await Promise.all(
        uploadableImages.map(async (uploadableImage, index) => {
          const resizedImage = await resizeImage(uploadableImage, 1200);
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
    const { values, categories } = this.state;

    const selectedCategory = categories.find(
      (category) => category._id === values.category
    );

    const parsedValues = {
      ...values,
      category: {
        label: selectedCategory.label,
        color: selectedCategory.color,
        categoryId: selectedCategory._id,
      },
    };

    try {
      const respond = await call('createWork', parsedValues, imagesReadyToSave);
      this.setState({
        newWorkId: respond,
        isCreating: false,
        isSuccess: true,
      });
      message.success(i18n.t('common:message.success.create', { domain: 'Your work'}));
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
    const { currentUser, canCreateContent } = this.context;

    if (!currentUser || !canCreateContent) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message={i18n.t('members:message.access.contributor', { action: 'create worhk' })}
            type="error"
          />
        </div>
      );
    }

    const {
      uploadableImagesLocal,
      isSuccess,
      newWorkId,
      isCreating,
      categories,
    } = this.state;

    if (isSuccess && newWorkId) {
      return <Redirect to={`/${currentUser.username}/work/${newWorkId}`} />;
    }

    return (
      <Template>
        <Box bg="white" p="6">
          <WorkForm
            categories={categories}
            defaultValues={formModel}
            images={uploadableImagesLocal}
            onRemoveImage={this.handleRemoveImage}
            onSortImages={this.handleSortImages}
            onSubmit={this.uploadImages}
            setUploadableImages={this.setUploadableImages}
          />
        </Box>
      </Template>
    );
  }
}

NewWork.contextType = StateContext;

export default NewWork;
