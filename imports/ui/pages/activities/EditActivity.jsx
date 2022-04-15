import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, IconButton, VStack } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import ActivityForm from '../../components/ActivityForm';
import Template from '../../components/Template';
import ConfirmModal from '../../components/ConfirmModal';
import FormSwitch from '../../components/FormSwitch';
import Loader from '../../components/Loader';
import {
  getAllBookingsWithSelectedResource,
  checkAndSetBookingsWithConflict,
  resizeImage,
  uploadImage,
  call,
} from '../../@/shared';
import { message, Alert } from '../../components/message';

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
      isPublicActivity: activity.isPublicActivity,
      isRegistrationDisabled: activity.isRegistrationDisabled,
    });
  };

  successEditMessage = (isDeleted) => {
    const { tc } = this.props;
    if (isDeleted) {
      message.success(
        tc('message.success.remove', {
          domain: `${tc('domains.your')} ${tc(
            'domains.activity'
          ).toLowerCase()}`,
        })
      );
    } else {
      message.success(
        tc('message.success.update', {
          domain: `${tc('domains.your')} ${tc(
            'domains.activity'
          ).toLowerCase()}`,
        })
      );
    }
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

  handleSubmit = (values) => {
    const { resources } = this.props;
    const { isPublicActivity, uploadableImage } = this.state;
    const formValues = { ...values };
    if (values.resourceId) {
      const selectedResource = resources.find(
        (r) => r._id === values.resourceId
      );
      formValues.resource = selectedResource.label;
      formValues.resourceId = selectedResource._id;
      formValues.resourceIndex = selectedResource.resourceIndex;
    }

    this.setState(
      {
        isCreating: true,
        formValues,
      },
      () => {
        if (isPublicActivity && uploadableImage) {
          this.uploadImage();
        } else {
          this.updateActivity();
        }
      }
    );
  };

  setUploadableImage = (files) => {
    const { tc } = this.props;
    if (files.length > 1) {
      message.error(tc('plugins.fileDropper.single'));
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

  handleSelectedResource = (value) => {
    const { resources } = this.props;
    const selectedResource = resources.find((r) => r._id === value);
    this.setState({
      selectedResource,
    });
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

  updateActivity = async () => {
    const { activity } = this.props;
    const {
      formValues,
      isPublicActivity,
      isRegistrationDisabled,
      uploadedImage,
      datesAndTimes,
    } = this.state;

    const imageUrl = uploadedImage || activity.imageUrl;
    const values = {
      ...formValues,
      datesAndTimes,
      imageUrl,
      isPublicActivity,
      isRegistrationDisabled,
    };

    try {
      await call('updateActivity', activity._id, values);
      this.setState({
        isLoading: false,
        isSuccess: true,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        isError: true,
      });
    }
  };

  hideDeleteModal = () => this.setState({ isDeleteModalOn: false });
  showDeleteModal = () => this.setState({ isDeleteModalOn: true });

  deleteActivity = async () => {
    const activityId = this.props.activity._id;

    try {
      await call('deleteActivity', activityId);
      this.setState({
        isLoading: false,
        isSuccess: true,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        isError: true,
      });
    }
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
    this.setState(
      {
        datesAndTimes,
      },
      () => {
        this.validateBookings();
      }
    );
  };

  handleSelectedResource = (value) => {
    const { resources } = this.props;
    const selectedResource = resources.find((r) => r._id === value);
    this.setState(
      {
        selectedResource,
      },
      () => {
        this.validateBookings();
      }
    );
  };

  validateBookings = () => {
    const { allBookings } = this.props;
    const { selectedResource, datesAndTimes } = this.state;

    if (!selectedResource || !datesAndTimes || datesAndTimes.length === 0) {
      return;
    }
    const allBookingsWithSelectedResource = getAllBookingsWithSelectedResource(
      selectedResource,
      allBookings
    );

    const selectedBookingsWithConflict = checkAndSetBookingsWithConflict(
      datesAndTimes,
      allBookingsWithSelectedResource
    );

    this.setState({
      datesAndTimes: selectedBookingsWithConflict,
    });
  };

  render() {
    const { activity, currentUser, resources, tc, t } = this.props;

    if (!currentUser || !activity) {
      return <Loader />;
    }

    if (activity.authorId !== currentUser._id) {
      return <Alert message={tc('message.access.deny')} />;
    }

    const {
      datesAndTimes,
      isDeleteModalOn,
      isPublicActivity,
      isRegistrationDisabled,
      isSuccess,
      uploadableImageLocal,
    } = this.state;

    if (isSuccess) {
      this.successEditMessage(isDeleteModalOn);
      if (isDeleteModalOn) {
        return <Redirect to="/calendar" />;
      }
      return <Redirect to={`/activity/${activity._id}`} />;
    }

    return (
      <Template
        heading={tc('labels.update', { domain: tc('domains.activity') })}
        leftContent={
          <Box pb="2">
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
                label={t('form.switch.public')}
                onChange={this.handlePublicActivitySwitch}
              />

              {isPublicActivity && (
                <FormSwitch
                  isChecked={isRegistrationDisabled}
                  label={t('form.switch.rsvp')}
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
            setSelectedResource={this.handleSelectedResource}
            setUploadableImage={this.setUploadableImage}
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
          title={tc('actions.submit')}
          visible={isDeleteModalOn}
          onConfirm={this.deleteActivity}
          onCancel={this.hideDeleteModal}
          confirmText={tc('modals.confirm.delete.yes')}
        >
          {tc('modals.confirm.delete.body', {
            domain: tc('domains.activity').toLowerCase(),
          })}
        </ConfirmModal>
      </Template>
    );
  }
}

export default EditActivity;
