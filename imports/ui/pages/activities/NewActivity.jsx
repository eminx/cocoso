import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import i18n from 'i18next';
import { Box, VStack } from '@chakra-ui/react';
import { parse } from 'query-string';

import ActivityForm from '../../components/ActivityForm';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import { message, Alert } from '../../components/message';
import FormSwitch from '../../components/FormSwitch';
import {
  call,
  compareDatesWithStartDateForSort,
  checkAndSetBookingsWithConflict,
  getAllBookingsWithSelectedResource,
  resizeImage,
  uploadImage,
} from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';

moment.locale(i18n.language);

const defaultCapacity = 40;
const today = new Date().toISOString().substring(0, 10);
const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '00:00',
  endTime: '23:59',
  attendees: [],
  capacity: defaultCapacity,
  isRange: false,
  conflict: null,
};

class NewActivity extends PureComponent {
  state = {
    formValues: null,
    datesAndTimes: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newActivityId: null,
    uploadedImage: null,
    uploadableImage: null,
    isPublicActivity: false,
    isExclusiveActivity: true,
    isRegistrationDisabled: false,
    isCreating: false,
    isReady: false,
  };

  componentDidMount() {
    this.setInitialValuesWithQueryParams();
  }

  componentDidUpdate(prevProps, prevState) {
    const { history, resources } = this.props;

    const { search } = history.location;
    const prevSearch = prevProps.history.location.search;
    if (search !== prevSearch || resources?.length !== prevProps.resources?.length) {
      this.setInitialValuesWithQueryParams();
    }
  }

  setInitialValuesWithQueryParams = () => {
    const { history, resources } = this.props;
    const { formValues } = this.state;

    const {
      location: { search },
    } = history;
    const params = parse(search);

    if (!params) {
      this.setState({
        isReady: true,
      });
      return;
    }

    const defaultBooking = {
      ...emptyDateAndTime,
      ...params,
      isRange: params?.startDate && params?.endDate && params.startDate !== params.endDate,
    };

    const initialValues = {
      ...formValues,
      resourceId: params.resource,
    };

    const selectedResource = resources?.find((r) => r._id === params.resource);

    this.setState(
      {
        formValues: initialValues,
        datesAndTimes: [defaultBooking],
        selectedResource,
        isReady: true,
      },
      () => {
        this.validateBookings();
      }
    );
  };

  handleSubmit = (values) => {
    const { tc } = this.props;
    const { isPublicActivity, uploadableImage, selectedResource } = this.state;
    const formValues = {
      ...values,
      resource: selectedResource.label,
      resourceIndex: selectedResource.resourceIndex,
    };

    if (isPublicActivity && !uploadableImage) {
      message.error(tc('message.error.imageRequired'));
      return;
    }

    this.setState(
      {
        isCreating: true,
        formValues,
      },
      () => {
        if (isPublicActivity) {
          this.uploadImage();
        } else {
          this.createActivity();
        }
      }
    );
  };

  successCreation = () => {
    const { tc } = this.props;
    message.success(
      tc('message.success.create', {
        domain: `${tc('domains.your')} ${tc('domains.activity').toLowerCase()}`,
      })
    );
  };

  setUploadableImage = (files) => {
    const { tc } = this.props;
    if (files.length > 1) {
      message.error(tc('plugins.fileDropper.single'));
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
    this.setState({ isLoading: true });

    const { uploadableImage } = this.state;

    try {
      const resizedImage = await resizeImage(uploadableImage, 1200);
      const uploadedImage = await uploadImage(resizedImage, 'activityImageUpload');
      this.setState(
        {
          uploadedImage,
        },
        () => this.createActivity()
      );
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      this.setState({
        isCreating: false,
      });
    }
  };

  createActivity = async () => {
    const {
      datesAndTimes,
      formValues,
      isExclusiveActivity,
      isPublicActivity,
      isRegistrationDisabled,
      uploadedImage,
    } = this.state;

    const datesAndTimesNoConflict = datesAndTimes.map((item) => ({
      startDate: item.startDate,
      endDate: item.endDate,
      startTime: item.startTime,
      endTime: item.endTime,
      isRange: item.isRange,
      capacity: item.capacity,
      attendees: [],
    }));

    const datesAndTimesNoConflictSorted = datesAndTimesNoConflict.sort(
      compareDatesWithStartDateForSort
    );

    const values = {
      ...formValues,
      datesAndTimes: datesAndTimesNoConflictSorted,
      isExclusiveActivity,
      isPublicActivity,
      isRegistrationDisabled,
      imageUrl: uploadedImage,
    };

    try {
      const newActivityId = await call('createActivity', values);
      this.setState(
        {
          isCreating: false,
          newActivityId,
          isSuccess: true,
        },
        () => this.successCreation()
      );
    } catch (error) {
      message.error(error.reason);
      this.setState({
        isCreating: false,
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
    const { isPublicActivity } = this.state;
    if (isPublicActivity) {
      this.setState({
        isExclusiveActivity: true,
      });
      return;
    }
    this.setState(
      {
        isExclusiveActivity: value,
      },
      () => this.validateBookings()
    );
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
      allBookingsWithSelectedResource
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

    const isConflictHard = datesAndTimes.some(
      (occurence) => Boolean(occurence.conflict) && !occurence.isConflictOK
    );

    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const isTimesInValid = datesAndTimes.some(
      (dateTime) => !regex.test(dateTime.startTime) || !regex.test(dateTime.endTime)
    );

    return !isTimesInValid && !isConflictHard;
  };

  render() {
    const { currentUser, resources, t, tc } = this.props;
    const { canCreateContent } = this.context;

    if (!currentUser || !canCreateContent) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message={tc('message.access.contributor', {
              doamin: 'an activity',
            })}
            type="error"
          />
        </div>
      );
    }

    const {
      formValues,
      isSuccess,
      isCreating,
      newActivityId,
      uploadableImageLocal,
      isPublicActivity,
      isExclusiveActivity,
      isReady,
      isRegistrationDisabled,
      datesAndTimes,
    } = this.state;

    if (isSuccess) {
      return <Redirect to={`/activities/${newActivityId}`} />;
    }

    if (!isReady) {
      return null;
    }

    const buttonLabel = isCreating ? t('form.waiting') : t('form.submit');
    const isFormValid = this.isFormValid();

    return (
      <Box>
        <Breadcrumb furtherItems={[{ label: tc('actions.create') }]} />
        <Template>
          <Box p="6">
            <Box mb="8">
              <VStack spacing="2">
                <FormSwitch
                  isChecked={isPublicActivity}
                  label={t('form.switch.public')}
                  onChange={this.handlePublicActivitySwitch}
                />

                <FormSwitch
                  isChecked={isPublicActivity || isExclusiveActivity}
                  isDisabled={isPublicActivity}
                  label={t('form.switch.exclusive')}
                  onChange={this.handleExclusiveSwitch}
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
              defaultValues={formValues}
              isPublicActivity={isPublicActivity}
              resources={resources}
              uploadableImageLocal={uploadableImageLocal}
              onSubmit={this.handleSubmit}
              setDatesAndTimes={this.setDatesAndTimes}
              setUploadableImage={this.setUploadableImage}
              setSelectedResource={this.handleSelectedResource}
              isButtonDisabled={!isFormValid || isCreating}
              isCreating={isCreating}
              isFormValid={isFormValid}
            />
          </Box>
        </Template>
      </Box>
    );
  }
}

NewActivity.contextType = StateContext;

export default NewActivity;
