import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { call } from '../../functions';
import ProcessForm from '../../UIComponents/ProcessForm';
import Template from '../../UIComponents/Template';
import Loader from '../../UIComponents/Loader';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { resizeImage, uploadImage } from '../../functions';
import { message, Alert } from '../../UIComponents/message';

class EditProcess extends React.Component {
  state = {
    formValues: {
      title: '',
      readingMaterial: '',
      description: '',
      capacity: 12,
    },
    isDeleteModalOn: false,
    isSuccess: false,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null,
  };

  handleSubmit = (values) => {
    const { uploadableImage } = this.state;

    const parsedValues = {
      ...values,
      capacity: Number(values.capacity),
    };

    this.setState({
      isUpdating: true,
      formValues: parsedValues,
    });

    if (!uploadableImage) {
      this.updateProcess();
      return;
    }

    this.uploadImage();
  };

  setUploadableImage = (files) => {
    if (files.length > 1) {
      message.error('Please drop only one file at a time.');
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        this.setState({
          uploadableImage,
          uploadableImageLocal: reader.result,
        });
      },
      false
    );
  };

  uploadImage = async () => {
    const { uploadableImage } = this.state;

    try {
      const resizedImage = await resizeImage(uploadableImage, 1200);
      const uploadedImage = await uploadImage(
        resizedImage,
        'processImageUpload'
      );
      this.setState(
        {
          uploadedImage,
        },
        () => this.updateProcess()
      );
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
      });
    }
  };

  updateProcess = async () => {
    const { process } = this.props;
    const { formValues, uploadedImage } = this.state;
    const imageUrl = uploadedImage || process.imageUrl;

    try {
      await call('updateProcess', process._id, formValues, imageUrl);
      message.success('Process successfully updated');
      this.setState({
        isSuccess: true,
      });
    } catch (error) {
      console.log(error);
      message.error(error.error || error.reason);
    }
  };

  hideDeleteModal = () => this.setState({ isDeleteModalOn: false });
  showDeleteModal = () => this.setState({ isDeleteModalOn: true });

  deleteProcess = async () => {
    const processId = this.props.process._id;
    try {
      await call('deleteProcess', processId);
      message.success('Process successfully deleted');
    } catch (error) {
      console.log(error);
      message.error(error.error || error.reason);
    }
  };

  render() {
    const { process, currentUser } = this.props;

    if (!process) {
      return <Loader />;
    }

    if (!currentUser) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to become a registered member to create a process."
            type="error"
          />
        </div>
      );
    }

    const {
      isDeleteModalOn,
      formValues,
      isSuccess,
      uploadableImageLocal,
      isUpdating,
    } = this.state;

    if (isSuccess) {
      return <Redirect to={`/process/${process._id}`} />;
    }

    const buttonLabel = isUpdating ? 'Updating...' : 'Confirm and Update';

    const { title, description } = formValues;
    const isFormValid =
      formValues &&
      title.length > 3 &&
      description.length > 20 &&
      (uploadableImageLocal || process.imageUrl);

    return (
      <Template
        heading="Edit your Process"
        leftContent={
          <Box p="2">
            <Link to={`/process/${process._id}`}>
              <IconButton
                as="span"
                aria-label="Back"
                icon={<ArrowBackIcon />}
              />
            </Link>
          </Box>
        }
      >
        <Box bg="white" p="6">
          <ProcessForm
            defaultValues={process}
            imageUrl={process && process.imageUrl}
            onSubmit={this.handleSubmit}
            setUploadableImage={this.setUploadableImage}
            uploadableImageLocal={uploadableImageLocal}
          />
        </Box>

        {process.adminId === currentUser._id && (
          <Center>
            <Button colorScheme="red" size="sm" onClick={this.showDeleteModal}>
              Delete
            </Button>
          </Center>
        )}

        <ConfirmModal
          visible={isDeleteModalOn}
          title="Confirm Delete"
          onConfirm={this.deleteProcess}
          onCancel={this.hideDeleteModal}
          confirmText="Yes, delete"
        >
          Are you sure you want to delete this process?
        </ConfirmModal>
      </Template>
    );
  }
}

export default EditProcess;
