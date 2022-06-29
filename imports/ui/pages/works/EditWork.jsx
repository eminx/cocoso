import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import arrayMove from 'array-move';
import { Box, Button, Center, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import i18n from 'i18next';

import { StateContext } from '../../LayoutContainer';
import WorkForm from '../../components/WorkForm';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import { message, Alert } from '../../components/message';
import ConfirmModal from '../../components/ConfirmModal';
import { call, resizeImage, uploadImage } from '../../utils/shared';
import Loader from '../../components/Loader';

class EditWork extends PureComponent {
  state = {
    categories: [],
    images: [],
    isLocalising: false,
    isCreating: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isDeleteModalOn: false,
    values: null,
  };

  componentDidMount() {
    this.getWork();
    this.getCategories();
  }

  getCategories = async () => {
    const categories = await call('getCategories');
    this.setState({
      categories,
    });
  };

  getWork = async () => {
    this.setState({ isLoading: true });
    const { match } = this.props;
    const workId = match.params.workId;
    const username = match.params.username;

    try {
      const response = await call('getWork', workId, username);
      const assignedCategory = response?.category;

      this.setState({
        values: {
          ...response,
          category: assignedCategory?.label?.toUpperCase(),
          categoryId: assignedCategory?.categoryId,
        },
        images: response.images.map((image) => ({
          src: image,
          type: 'uploaded',
        })),
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
      this.setState({
        isLoading: false,
      });
    }
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

  uploadImages = async (formValues) => {
    const { images } = this.state;
    this.setState({
      values: formValues,
      isCreating: true,
    });

    const isThereUploadable = images.some((image) => image.type === 'not-uploaded');
    if (!isThereUploadable) {
      const imagesReadyToSave = images.map((image) => image.src);
      this.updateWork(imagesReadyToSave);
      return;
    }

    try {
      const imagesReadyToSave = await Promise.all(
        images.map(async (uploadableImage, index) => {
          if (uploadableImage.type === 'uploaded') {
            return uploadableImage.src;
          }
          const resizedImage = await resizeImage(uploadableImage.resizableData, 1200);
          const uploadedImage = await uploadImage(resizedImage, 'workImageUpload');
          return uploadedImage;
        })
      );
      this.updateWork(imagesReadyToSave);
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
        isError: true,
      });
    }
  };

  updateWork = async (imagesReadyToSave) => {
    const { match } = this.props;
    const workId = match.params.workId;
    const { values, categories } = this.state;
    const { currentUser } = this.context;

    if (values.authorId !== currentUser._id) {
      return;
    }

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
      await call('updateWork', workId, parsedValues, imagesReadyToSave);
      this.setState({
        isCreating: false,
        isSuccess: true,
      });
      message.success(
        i18n.t('common:message.success.update', {
          domain: `${i18n.t('common:domains.your')} ${i18n.t('common:domains.work').toLowerCase()}`,
        })
      );
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

  handleDeleteWork = async () => {
    const { match, history } = this.props;
    const workId = match.params.workId;
    const { currentUser } = this.context;
    const { values } = this.state;

    if (values.authorId !== currentUser._id) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      await call('deleteWork', workId);
      this.setState({
        isLoading: false,
      });
      history.push(`/@${currentUser.username}/works`);
      message.success(
        i18n.t('common:message.success.remove', {
          domain: `${i18n.t('common:domains.your')} ${i18n.t('common:domains.work').toLowerCase()}`,
        })
      );
    } catch (error) {
      message.error(error.reason);
      this.setState({ isLoading: false });
    }
  };

  hideDeleteModal = () => this.setState({ isDeleteModalOn: false });
  showDeleteModal = () => this.setState({ isDeleteModalOn: true });

  render() {
    const { currentUser } = this.context;
    const { match } = this.props;
    const workId = match.params.workId;
    const { categories, images, isCreating, isLoading, isSuccess, isDeleteModalOn, values } =
      this.state;

    if (!currentUser) {
      return <Alert message={i18n.t('common:message.access.deny')} />;
    }

    if (isLoading || !values) {
      return <Loader />;
    }

    if (currentUser._id !== values.authorId) {
      return <Alert message={i18n.t('common:message.access.deny')} />;
    }

    const workRoute = `/@${currentUser.username}/works/${workId}`;
    if (isSuccess) {
      return <Redirect to={workRoute} />;
    }

    return (
      <Template
        leftContent={
          <Box pb="2">
            <Link to={workRoute}>
              <IconButton as="span" aria-label="Back" icon={<ArrowBackIcon />} />
            </Link>
          </Box>
        }
      >
        <Breadcrumb context={values} contextKey="title" />
        <Box bg="white" p="6">
          <WorkForm
            categories={categories}
            defaultValues={values}
            images={images.map((image) => image.src)}
            onRemoveImage={this.handleRemoveImage}
            onSortImages={this.handleSortImages}
            onSubmit={this.uploadImages}
            setUploadableImages={this.setUploadableImages}
          />
        </Box>

        <Center p="4">
          <Button colorScheme="red" size="sm" variant="ghost" onClick={this.showDeleteModal}>
            {i18n.t('common:actions.remove')}
          </Button>
        </Center>

        <ConfirmModal
          visible={isDeleteModalOn}
          onConfirm={this.handleDeleteWork}
          onCancel={this.hideDeleteModal}
          title={i18n.t('common:modals.confirm.delete.title')}
        >
          {i18n.t('common:modals.confirm.delete.body', {
            domain: i18n.t('common:domains.work').toLowerCase(),
          })}
        </ConfirmModal>
      </Template>
    );
  }
}

EditWork.contextType = StateContext;

export default EditWork;
