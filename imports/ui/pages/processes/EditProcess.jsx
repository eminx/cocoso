import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { call, resizeImage, uploadImage } from '../../utils/shared';
import ProcessForm from '../../components/ProcessForm';
import Template from '../../components/Template';
import Loader from '../../components/Loader';
import Breadcrumb from '../../components/Breadcrumb';
import ConfirmModal from '../../components/ConfirmModal';
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
    isUpdating: false,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null,
  };

  handleSubmit = (values) => {
    this.setState({
      isUpdating: true,
    });
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
      const uploadedImage = await uploadImage(resizedImage, 'processImageUpload');
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
    const { process, tc } = this.props;
    const { formValues, uploadedImage } = this.state;
    const imageUrl = uploadedImage || process.imageUrl;

    try {
      await call('updateProcess', process._id, formValues, imageUrl);
      message.success(tc('message.success.update'));
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
    const { process, tc } = this.props;
    const processId = process._id;

    try {
      await call('deleteProcess', processId);
      message.success(tc('message.success.remove'));
      this.setState({ isSuccess: true });
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
        <Alert
          message={tc('message.access.register', {
            domain: `${tc('domains.a')} ${tc('domains.process').toLowerCase()}`,
          })}
        />
      );
    }

    if (!process.members.some((member) => member.memberId === currentUser._id && member.isAdmin)) {
      return <Alert message="You are not allowed!" />;
    }

    const { isDeleteModalOn, formValues, isSuccess, uploadableImageLocal, isUpdating } = this.state;

    if (isSuccess) {
      if (isDeleteModalOn) {
        return <Redirect to="/processes" />;
      }
      return <Redirect to={`/processes/${process._id}`} />;
    }

    const furtherBreadcrumbLinks = [
      {
        label: process.title,
        link: `/processes/${process._id}`,
      },
      {
        label: tc('actions.update'),
        link: null,
      },
    ];

    return (
      <Box>
        <Template>
          <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
          <Box py="6">
            <ProcessForm
              defaultValues={process}
              imageUrl={process && process.imageUrl}
              isButtonLoading={isUpdating}
              onSubmit={this.handleSubmit}
              setUploadableImage={this.setUploadableImage}
              uploadableImageLocal={uploadableImageLocal}
            />
          </Box>

          <Center p="4">
            <Button colorScheme="red" size="sm" variant="ghost" onClick={this.showDeleteModal}>
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
            {tc('modals.confirm.delete.body', {
              domain: tc('domains.process').toLowerCase(),
            })}
          </ConfirmModal>
        </Template>
      </Box>
    );
  }
}

export default EditProcess;
