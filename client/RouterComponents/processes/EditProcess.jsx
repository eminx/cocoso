import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button } from 'grommet';

import ProcessForm from '../../UIComponents/ProcessForm';
import Template from '../../UIComponents/Template';
import Loader from '../../UIComponents/Loader';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { resizeImage, uploadImage } from '../../functions';
import { message, Alert } from '../../UIComponents/message';

const successUpdate = () =>
  message.success('Your process is successfully updated', 6);

const successDelete = () =>
  message.success('The process is successfully deleted', 4);

const sideNote = 'This page is dedicated to create processes';

class EditProcess extends React.Component {
  state = {
    formValues: {
      title: '',
      readingMaterial: '',
      description: '',
      capacity: 12,
    },
    isDeleteModalOn: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newProcessId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null,
  };

  componentDidMount() {
    if (this.props.process) {
      this.setFormValues();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.process && this.props.process) {
      this.setFormValues();
    }
  }

  setFormValues = () => {
    const { process } = this.props;

    if (!process || !process.title || !process.description) {
      return;
    }
    this.setState({
      formValues: {
        title: process.title,
        readingMaterial: process.readingMaterial,
        description: process.description,
        capacity: process.capacity,
      },
    });
  };

  handleFormChange = (value) => {
    const { formValues } = this.state;
    let capacity = parseInt(value.capacity) || 2;
    if (capacity > 30) {
      capacity = 30;
    }

    const newFormValues = {
      ...value,
      capacity,
      description: formValues.description,
    };

    this.setState({
      formValues: newFormValues,
    });
  };

  handleQuillChange = (description) => {
    const { formValues } = this.state;
    const newFormValues = {
      ...formValues,
      description,
    };

    this.setState({
      formValues: newFormValues,
    });
  };

  handleSubmit = () => {
    const { uploadableImage } = this.state;

    this.setState({
      isUpdating: true,
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
      const resizedImage = await resizeImage(uploadableImage, 500);
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

  updateProcess = () => {
    const { process } = this.props;
    const { formValues, uploadedImage } = this.state;
    const imageUrl = uploadedImage || process.imageUrl;

    Meteor.call(
      'updateProcess',
      process._id,
      formValues,
      imageUrl,
      (error, result) => {
        if (error) {
          this.setState({
            isLoading: false,
            isError: true,
          });
        } else {
          this.setState({
            isLoading: false,
            isSuccess: true,
          });
        }
      }
    );
  };

  hideDeleteModal = () => this.setState({ isDeleteModalOn: false });
  showDeleteModal = () => this.setState({ isDeleteModalOn: true });

  deleteProcess = () => {
    const processId = this.props.process._id;
    Meteor.call('deleteProcess', processId, (error, respond) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true,
        });
      } else {
        successDelete();
        this.setState({
          isLoading: false,
          isSuccess: true,
        });
      }
    });
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
      successUpdate();
      return <Redirect to={`/process/${process._id}`} />;
    }

    const buttonLabel = isUpdating
      ? 'Updating your process...'
      : 'Confirm and Update Process';

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
          <Box pad="small">
            <Link to={`/process/${process._id}`}>
              <Button plain label={process.title} />
            </Link>
          </Box>
        }
        rightContent={
          process.adminId === currentUser._id && (
            <Box pad="small">
              <Button
                plain
                color="status-critical"
                label="Delete"
                onClick={this.showDeleteModal}
              />
            </Box>
          )
        }
      >
        <ProcessForm
          formValues={formValues}
          onFormChange={this.handleFormChange}
          onQuillChange={this.handleQuillChange}
          onSubmit={this.handleSubmit}
          setUploadableImage={this.setUploadableImage}
          uploadableImageLocal={uploadableImageLocal}
          imageUrl={process && process.imageUrl}
          buttonLabel={buttonLabel}
          isFormValid={isFormValid}
          isButtonDisabled={!isFormValid || isUpdating}
        />

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
