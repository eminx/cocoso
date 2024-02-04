import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import arrayMove from 'array-move';
import { Box } from '@chakra-ui/react';
import i18n from 'i18next';

import { StateContext } from '../../LayoutContainer';
import WorkForm from '../../components/WorkForm';
import Template from '../../components/Template';
import { message, Alert } from '../../components/message';
import { call, resizeImage, uploadImage } from '../../utils/shared';
import FormTitle from '../../components/FormTitle';
import Loader from '../../components/Loader';

const formModel = {
  additionalInfo: '',
  categoryId: '',
  contactInfo: '',
  longDescription: '',
  shortDescription: '',
  showAvatar: true,
  title: '',
};

class NewWork extends PureComponent {
  state = {
    categories: [],
    uploadableImages: [],
    uploadableImagesLocal: [],
    isLocalising: false,
    isCreating: false,
    isLoading: true,
    isSuccess: false,
    isError: false,
    newWorkId: null,
    values: null,
  };

  componentDidMount() {
    const { currentUser } = this.context;
    const valuesWithContact = {
      ...formModel,
      contactInfo: currentUser.contactInfo,
    };
    this.setState({
      values: valuesWithContact,
    });
    this.getCategories();
  }

  getCategories = async () => {
    const categories = await call('getCategories');
    this.setState({
      categories,
      isLoading: false,
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
          const uploadedImage = await uploadImage(resizedImage, 'workImageUpload');
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

    const selectedCategory = categories.find((category) => category._id === values.categoryId);

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
      message.success(i18n.t('common:message.success.create'));
    } catch (error) {
      message.error(error.reason);
      console.log(error);
      this.setState({ isCreating: false });
    }
  };

  handleRemoveImage = (imageIndex) => {
    this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
      uploadableImages: uploadableImages.filter((image, index) => imageIndex !== index),
      uploadableImagesLocal: uploadableImagesLocal.filter((image, index) => imageIndex !== index),
      // unSavedImageChange: true,
    }));
  };

  handleSortImages = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    this.setState(({ uploadableImages, uploadableImagesLocal }) => ({
      uploadableImages: arrayMove(uploadableImages, oldIndex, newIndex),
      uploadableImagesLocal: arrayMove(uploadableImagesLocal, oldIndex, newIndex),
      // unSavedImageChange: true,
    }));
  };

  render() {
    const { currentUser, canCreateContent } = this.context;
    const { uploadableImagesLocal, isSuccess, newWorkId, isLoading, categories, values } =
      this.state;

    if (isLoading) {
      return <Loader />;
    }

    if (!currentUser || !canCreateContent) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message={i18n.t('members:message.access.contributor', {
              action: 'create work',
            })}
            type="error"
          />
        </div>
      );
    }

    if (isSuccess && newWorkId) {
      return <Redirect to={`/@${currentUser.username}/works/${newWorkId}`} />;
    }

    return (
      <Box>
        <FormTitle context="works" isNew />
        <Template>
          <Box>
            <WorkForm
              categories={categories}
              defaultValues={values}
              images={uploadableImagesLocal}
              isNew
              onRemoveImage={this.handleRemoveImage}
              onSortImages={this.handleSortImages}
              onSubmit={this.uploadImages}
              setUploadableImages={this.setUploadableImages}
            />
          </Box>
        </Template>
      </Box>
    );
  }
}

NewWork.contextType = StateContext;

export default NewWork;
