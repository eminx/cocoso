import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, IconButton, VStack } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import ActivityForm from '../../UIComponents/ActivityForm';
import Template from '../../UIComponents/Template';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import FormSwitch from '../../UIComponents/FormSwitch';
import Loader from '../../UIComponents/Loader';
import { resizeImage, uploadImage } from '../../functions';
import { message, Alert } from '../../UIComponents/message';

const successEditMessage = (isDeleted) => {
  if (isDeleted) {
    message.success('The activity is successfully deleted', 4);
  } else {
    message.success('Your activity is successfully updated', 6);
  }
};

const formModel = {
  resource: '',
  title: '',
  subTitle: '',
  place: '',
  address: '',
};

class EditActivity extends PureComponent {
  state = {
    datesAndTimes: [],
    formValues: formModel,
    isDeleteModalOn: false,
    isPublicActivity: false,
    isCreating: false,
    isError: false,
    isLoading: false,
    isSuccess: false,
    isRegistrationDisabled: false,
    longDescription: '',
    uploadableImage: null,
    uploadableImageLocal: null,
    uploadedImage: null,
  };

  componentDidMount() {
    this.setInitialData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.activity && this.props.activity) {
      this.setInitialData();
    }
  }

  setInitialData = () => {
    const { activity } = this.props;
    if (!activity) {
      return;
    }
    const { datesAndTimes } = activity;

    this.setState({
      datesAndTimes: [...datesAndTimes],
    });
  };

  handleFormValueChange = (formValues) => {
    this.setState({
      formValues,
    });
  };

  handleQuillChange = (longDescription) => {
    this.setState({
      longDescription,
    });
  };

  handleSubmit = () => {
    const { isPublicActivity, uploadableImage } = this.state;
    this.setState({
      isCreating: true,
    });

    if (isPublicActivity && uploadableImage) {
      this.uploadImage();
    } else {
      this.updateActivity();
    }
  };

  setUploadableImage = (files) => {
    if (files.length > 1) {
      message.error('Please drop only one file at a time.');
      return;
    }
    const theImageFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theImageFile);
    reader.addEventListener(
      'load',
      () => {
        this.setState({
          uploadableImage: theImageFile,
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
        'activityImageUpload'
      );
      this.setState(
        {
          uploadedImage,
        },
        () => this.updateActivity()
      );
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
      });
    }
  };

  updateActivity = () => {
    const { activity, resources } = this.props;
    const {
      formValues,
      isPublicActivity,
      isRegistrationDisabled,
      uploadedImage,
      datesAndTimes,
    } = this.state;

    const resource = resources.find(
      (resource) => resource._id === formValues.resource
    );

    const values = {
      ...formValues,
      datesAndTimes,
      isPublicActivity,
      isRegistrationDisabled,
      resource,
    };

    const imageUrl = uploadedImage || activity.imageUrl;

    Meteor.call(
      'updateActivity',
      values,
      activity._id,
      imageUrl,
      (error, respond) => {
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

  deleteActivity = () => {
    const activityId = this.props.activity._id;

    Meteor.call('deleteActivity', activityId, (error, respond) => {
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
    });
  };

  handlePublicActivitySwitch = (event) => {
    const value = event.target.checked;
    this.setState({
      isPublicActivity: value,
    });
  };

  handleRegistrationSwitch = (event) => {
    const value = event.target.checked;
    this.setState({
      isRegistrationDisabled: value,
    });
  };

  setDatesAndTimes = (datesAndTimes) => {
    this.setState({
      datesAndTimes,
    });
  };

  render() {
    const { activity, currentUser, resources } = this.props;

    if (!currentUser || !activity) {
      return <Loader />;
    }

    if (activity.authorId !== currentUser._id) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert message="You are not allowed" type="error" />
        </div>
      );
    }

    const {
      datesAndTimes,
      formValues,
      isDeleteModalOn,
      isPublicActivity,
      isRegistrationDisabled,
      uploadableImageLocal,
      isCreating,
      isSuccess,
    } = this.state;

    if (isSuccess) {
      successEditMessage(isDeleteModalOn);
      if (isDeleteModalOn) {
        return <Redirect to="/calendar" />;
      }
      if (isPublicActivity) {
        return <Redirect to={`/event/${activity._id}`} />;
      } else {
        return <Redirect to="/calendar" />;
      }
    }

    const buttonLabel = isCreating
      ? 'Updating your activity...'
      : 'Confirm and Update';
    const { title } = formValues;
    const isFormValid = formValues && title.length > 3;

    return (
      <Template
        heading="Edit Activity"
        leftContent={
          <Box p="2">
            <Link to={`/event/${activity._id}`}>
              <IconButton
                as="span"
                aria-label="Back"
                icon={<ArrowBackIcon />}
              />
            </Link>
          </Box>
        }
      >
        <Box bg="white" p="8">
          <Box mb="8">
            <VStack spacing="2">
              <FormSwitch
                isChecked={isPublicActivity}
                label="Public Event"
                onChange={this.handlePublicActivitySwitch}
              />

              {isPublicActivity && (
                <FormSwitch
                  isChecked={isRegistrationDisabled}
                  label="RSVP disabled"
                  onChange={this.handleRegistrationSwitch}
                />
              )}
            </VStack>
          </Box>

          <ActivityForm
            datesAndTimes={datesAndTimes}
            defaultValues={activity}
            imageUrl={activity && activity.imageUrl}
            isPublicActivity={isPublicActivity}
            resources={resources}
            uploadableImageLocal={uploadableImageLocal}
            onSubmit={this.handleSubmit}
            setDatesAndTimes={this.setDatesAndTimes}
            setUploadableImage={this.setUploadableImage}
            isButtonDisabled={!isFormValid || isCreating}
            isCreating={isCreating}
            isFormValid={isFormValid}
          />
        </Box>

        <Center>
          <Button colorScheme="red" size="sm" onClick={this.showDeleteModal}>
            Delete
          </Button>
        </Center>

        <ConfirmModal
          title="Confirm"
          visible={isDeleteModalOn}
          onConfirm={this.deleteActivity}
          onCancel={this.hideDeleteModal}
          confirmText="Yes, delete"
        >
          Are you sure you want to delete this activity?
        </ConfirmModal>
      </Template>
    );
  }
}

export default EditActivity;
