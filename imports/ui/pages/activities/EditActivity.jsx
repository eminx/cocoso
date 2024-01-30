import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Box, Button, Center, VStack } from '@chakra-ui/react';

import ActivityForm from '../../components/ActivityForm';
import Template from '../../components/Template';
import ConfirmModal from '../../components/ConfirmModal';
import FormSwitch from '../../components/FormSwitch';
import Loader from '../../components/Loader';
import {
  call,
  compareDatesWithStartDateForSort,
  checkAndSetBookingsWithConflict,
  getAllBookingsWithSelectedResource,
  resizeImage,
  uploadImage,
} from '../../utils/shared';
import { message, Alert } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import FormTitle from '../../components/FormTitle';

const formModel = {
  resourceId: '',
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
    isCreating: false,
    isError: false,
    isLoading: false,
    isSuccess: false,
    isExclusiveActivity: true,
    isPublicActivity: false,
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
    if (
      (!prevProps.activity && this.props.activity) ||
      (!prevProps.allBookings && this.props.allBookings) ||
      (!prevProps.resources && this.props.resources)
    ) {
      this.setInitialData();
    }
  }

  setInitialData = () => {
    const { activity } = this.props;
    if (!activity) {
      return;
    }
    const { datesAndTimes } = activity;

    this.setState(
      {
        datesAndTimes: [...datesAndTimes],
        isPublicActivity: activity.isPublicActivity,
        isExclusiveActivity: Boolean(activity.isExclusiveActivity),
        isRegistrationDisabled: activity.isRegistrationDisabled,
      },
      () => this.validateBookings()
    );
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
      const selectedResource = resources.find((r) => r._id === values.resourceId);
      formValues.resource = selectedResource?.label;
      formValues.resourceId = selectedResource?._id;
      formValues.resourceIndex = selectedResource?.resourceIndex;
    }

    this.setState(
      {
        isLoading: true,
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

  uploadImage = async () => {
    const { uploadableImage } = this.state;

    try {
      const resizedImage = await resizeImage(uploadableImage, 1200);
      const uploadedImage = await uploadImage(resizedImage, 'activityImageUpload');
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
    const { activity, tc } = this.props;
    const {
      formValues,
      isExclusiveActivity,
      isPublicActivity,
      isRegistrationDisabled,
      uploadedImage,
      datesAndTimes,
    } = this.state;

    const datesAndTimesSorted = datesAndTimes.sort(compareDatesWithStartDateForSort);

    const imageUrl = uploadedImage || activity.imageUrl;
    const values = {
      ...formValues,
      datesAndTimes: datesAndTimesSorted,
      imageUrl,
      isExclusiveActivity,
      isPublicActivity,
      isRegistrationDisabled,
    };

    try {
      await call('updateActivity', activity._id, values);
      this.setState({ isSuccess: true }, () => {
        message.success(tc('message.success.update'));
      });
    } catch (error) {
      console.log(error);
      message.error(error.error || error.reason);
      this.setState({
        isLoading: false,
        isError: true,
      });
    }
  };

  hideDeleteModal = () => this.setState({ isDeleteModalOn: false });
  showDeleteModal = () => this.setState({ isDeleteModalOn: true });

  deleteActivity = async () => {
    const { activity, history, tc } = this.props;

    try {
      await call('deleteActivity', activity._id);
      message.success(tc('message.success.remove'));
      if (activity.isPublicActivity) {
        history.push('/activities');
      } else {
        history.push('/calendar');
      }
    } catch (error) {
      console.log(error);
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
      isExclusiveActivity: true,
    });
  };

  handleExclusiveSwitch = (event) => {
    const value = event.target.checked;

    this.setState(
      {
        isExclusiveActivity: value,
      },
      () => this.validateBookings()
    );
  };

  handleRegistrationSwitch = () => {
    this.setState(({ isRegistrationDisabled }) => ({
      isRegistrationDisabled: !isRegistrationDisabled,
    }));
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
    this.setState(
      {
        selectedResource: this.findResourceFromId(value),
      },
      () => this.validateBookings()
    );
  };

  findResourceFromId = (resourceId) => {
    const { resources } = this.props;
    return resources.find((r) => r._id === resourceId);
  };

  validateBookings = () => {
    const { activity, allBookings } = this.props;
    const { selectedResource, datesAndTimes, isExclusiveActivity } = this.state;

    if (!selectedResource || !datesAndTimes || datesAndTimes.length === 0) {
      return;
    }
    const allBookingsWithSelectedResource = getAllBookingsWithSelectedResource(
      selectedResource,
      allBookings
    );

    const selectedBookingsWithConflict = checkAndSetBookingsWithConflict(
      datesAndTimes,
      allBookingsWithSelectedResource,
      activity._id
    );

    const selectedBookingsWithConflictButNotExclusive = selectedBookingsWithConflict.map((item) => {
      const booking = { ...item };
      if (item.conflict) {
        booking.isConflictOK = !item.conflict.isExclusiveActivity && !isExclusiveActivity;
      }
      return booking;
    });

    this.setState({
      datesAndTimes: selectedBookingsWithConflictButNotExclusive,
    });
  };

  isFormValid = () => {
    const { datesAndTimes } = this.state;

    const isConflictHard =
      datesAndTimes &&
      datesAndTimes.some((occurence) => Boolean(occurence.conflict) && !occurence.isConflictOK);

    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const isTimesInValid = datesAndTimes.some(
      (dateTime) => !regex.test(dateTime.startTime) || !regex.test(dateTime.endTime)
    );

    return !isTimesInValid && !isConflictHard;
  };

  render() {
    const { activity, currentUser, resources, tc, t } = this.props;
    const { role } = this.context;

    if (!currentUser || !activity) {
      return <Loader />;
    }

    if (activity.authorId !== currentUser._id && role !== 'admin') {
      return <Alert message={tc('message.access.deny')} />;
    }

    const {
      datesAndTimes,
      isDeleteModalOn,
      isExclusiveActivity,
      isPublicActivity,
      isRegistrationDisabled,
      isSuccess,
      isLoading,
      uploadableImageLocal,
    } = this.state;

    if (isSuccess) {
      return <Redirect to={`/activities/${activity._id}`} />;
    }

    const isFormValid = this.isFormValid();

    return (
      <Box>
        <FormTitle context="activities" />
        <Template>
          <Box>
            <VStack mb="8" spacing="2">
              <FormSwitch
                isChecked={isPublicActivity}
                label={t('form.switch.public')}
                onChange={this.handlePublicActivitySwitch}
              />

              <FormSwitch
                isChecked={isExclusiveActivity}
                label={t('form.switch.exclusive')}
                onChange={this.handleExclusiveSwitch}
              />

              {isPublicActivity && (
                <FormSwitch
                  isChecked={!isRegistrationDisabled}
                  label={t('form.switch.rsvp')}
                  onChange={this.handleRegistrationSwitch}
                />
              )}
            </VStack>

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
              isButtonDisabled={!isFormValid || isLoading}
              isCreating={isLoading}
              isFormValid={isFormValid}
            />
          </Box>

          <Center p="4">
            <Button colorScheme="red" size="sm" variant="ghost" onClick={this.showDeleteModal}>
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
      </Box>
    );
  }
}

EditActivity.contextType = StateContext;

export default EditActivity;
