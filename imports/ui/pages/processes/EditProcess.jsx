import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { call } from '../../@/shared';
import ProcessForm from '../../components/ProcessForm';
import Template from '../../components/Template';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';
import { resizeImage, uploadImage } from '../../@/shared';
import { message, Alert } from '../../components/message';

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
    const { tc } = this.props;
    if (files.length > 1) {
      message.error(tc('plugins.fileDroppper.single'));
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
      message.success(tc('message.success.update', { domain: tc('domains.process') }));
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
      message.success(tc('message.success.delete', { domain: tc('domains.process') }));
    } catch (error) {
      console.log(error);
      message.error(error.error || error.reason);
    }
  };

  render() {
    const { process, currentUser, tc } = this.props;

    if (!process) {
      return <Loader />;
    }

    if (!currentUser) {
      return (
        <Alert message={tc('message.access.register', { domain: `${tc('domains.a')} ${tc('domains.process').toLowerCase()}` })} />
      );
    }
    
    if (process.adminId !== currentUser._id) {
      return <Alert message="You are not allowed!" />;
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

    const { title, description } = formValues;
    // const isFormValid =
    //   formValues &&
    //   title.length > 3 &&
    //   description.length > 20 &&
    //   (uploadableImageLocal || process.imageUrl);

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

        <Center p="4">
          <Button
            colorScheme="red"
            size="sm"
            variant="ghost"
            onClick={this.showDeleteModal}
          >
            {tc('actions.remove')}
          </Button>
        </Center>

        <ConfirmModal
          visible={isDeleteModalOn}
          title={tc('modals.confirm.delete.title')}
          onConfirm={this.deleteProcess}
          onCancel={this.hideDeleteModal}
          confirmText={tc('modals.confirm.delete.yes')}
        >
          {tc('modals.confirm.delete.body', { domain: tc('domains.process').toLowerCase() })}
        </ConfirmModal>
      </Template>
    );
  }
}

export default EditProcess;
