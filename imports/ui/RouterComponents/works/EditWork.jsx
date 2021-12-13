import React, { PureComponent } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import arrayMove from 'array-move';
import { Box, Button } from 'grommet';
import { StateContext } from '../../LayoutContainer';
import WorkForm from '../../UIComponents/WorkForm';
import Template from '../../UIComponents/Template';
import { message, Alert } from '../../UIComponents/message';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { call, resizeImage, uploadImage } from '../../functions';

class EditWork extends PureComponent {
  state = {
    formValues: {
      title: '',
      shortDescription: '',
      longDescription: '',
      additionalInfo: '',
      category: '',
    },
    categories: [],
    images: [],
    isLocalising: false,
    isCreating: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isDeleteModalOn: false,
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
      const catLabel =
        response.category &&
        response.category.label &&
        response.category.label.toUpperCase();
      this.setState({
        formValues: {
          ...response,
          category: catLabel,
        },
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
    this.setState({
      formValues: value,
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
          } else {
            const resizedImage = await resizeImage(
              uploadableImage.resizableData,
              1200
            );
            const uploadedImage = await uploadImage(
              resizedImage,
              'workImageUpload'
            );
            return uploadedImage;
          }
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
    const { formValues, categories } = this.state;
    const { currentUser } = this.context;

    if (formValues.authorId !== currentUser._id) {
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.label === formValues.category.toLowerCase()
    );

    const updatedWork = {
      ...formValues,
      category: {
        label: selectedCategory.label,
        color: selectedCategory.color,
        categoryId: selectedCategory._id,
      },
    };

    try {
      await call('updateWork', workId, updatedWork, imagesReadyToSave);
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

  handleDeleteWork = async () => {
    const { match, history } = this.props;
    const workId = match.params.workId;
    const { currentUser } = this.context;
    const { formValues } = this.state;

    if (formValues.authorId !== currentUser._id) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      await call('deleteWork', workId);
      this.setState({
        isLoading: false,
      });
      history.push('/my-works');
      message.success('Your work is successfully deleted');
    } catch (error) {
      message.error(error.reason);
      this.setState({ isLoading: false });
    }
  };

  closeDeleteModal = () => this.setState({ isDeleteModalOn: false });
  openDeleteModal = () => this.setState({ isDeleteModalOn: true });

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

    const {
      formValues,
      images,
      isSuccess,
      isCreating,
      categories,
      isDeleteModalOn,
    } = this.state;

    if (isSuccess) {
      return <Redirect to={`/${currentUser.username}/work/${workId}`} />;
    }

    const buttonLabel = isCreating ? 'Updating...' : 'Confirm and Update';
    const { title } = formValues;
    const isFormValid = formValues && title.length > 3;

    return (
      <Template>
        <WorkForm
          formValues={formValues}
          categories={categories}
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

        <Box direction="row" justify="center" pad="medium">
          <Button
            plain
            color="status-critical"
            onClick={this.openDeleteModal}
            label="Delete"
          />
        </Box>

        <ConfirmModal
          visible={isDeleteModalOn}
          onConfirm={this.handleDeleteWork}
          onCancel={this.closeDeleteModal}
          title="Confirm Delete"
        >
          Are you sure you want to delete this item?
        </ConfirmModal>
      </Template>
    );
  }
}

EditWork.contextType = StateContext;

export default EditWork;
