import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import i18n from 'i18next';
import { Box, VStack } from '@chakra-ui/react';
import { parse } from 'query-string';

import ActivityForm from '../../components/ActivityForm';
import Template from '../../components/Template';
import { message, Alert } from '../../components/message';
import FormSwitch from '../../components/FormSwitch';
import { resizeImage, uploadImage, call } from '../../@/shared';
import { StateContext } from '../../LayoutContainer';

moment.locale(i18n.language);

const formModel = {
  title: '',
  subTitle: '',
  place: '',
  address: '',
  practicalInfo: '',
  internalInfo: '',
  resource: '',
};

const defaultCapacity = 40;
const today = new Date().toISOString().substring(0, 10);
const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '',
  endTime: '',
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
    resources: [],
  };

  componentDidMount() {
    this.getResources();
  }

  getResources = async () => {
    try {
      const resources = await call('getResources');
      this.setState({ resources }, () => {
        this.setInitialValuesWithQP();
      });
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  setInitialValuesWithQP = () => {
    const { history } = this.props;
    const { formValues } = this.state;

    const {
      location: { search },
    } = history;
    const params = parse(search);

    const defaultOccurence = {
      ...emptyDateAndTime,
      ...params,
      isRange:
        params?.startDate &&
        params?.endDate &&
        params.startDate !== params.endDate,
    };

    const initialValues = {
      ...formValues,
      resourceId: params.resource || '',
      datesAndTimes: [defaultOccurence],
    };

    this.setState({
      formValues: initialValues,
      datesAndTimes: [defaultOccurence],
      isReady: true,
    });
  };

  handleSubmit = (values) => {
    const { isPublicActivity, resources } = this.state;

    const formValues = { ...values };
    const selectedResource = resources.find((r) => r._id === values.resourceId);
    formValues.resource = selectedResource.label;
    formValues.resourceId = selectedResource._id;
    formValues.resourceIndex = selectedResource.resourceIndex;

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
    const { t } = this.props;
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
      const uploadedImage = await uploadImage(
        resizedImage,
        'activityImageUpload'
      );
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
      formValues,
      datesAndTimes,
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

    const values = {
      ...formValues,
      datesAndTimes: datesAndTimesNoConflict,
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
    this.setState({
      isExclusiveActivity: value,
    });
  };

  handleRegistrationSwitch = (event) => {
    const value = event.target.checked;
    this.setState({
      isRegistrationDisabled: value,
    });
  };

  setDatesAndTimes = (selectedOccurences) => {
    const { formValues, resources } = this.state;
    this.setState({
      datesAndTimes: selectedOccurences,
    });

    const selectedResource = resources.find(
      (r) => r._id === formValues.resourceId
    );
    this.validateBookings(selectedOccurences, selectedResource);
  };

  validateBookings = (selectedOccurences, selectedResource) => {
    const { allOccurences } = this.props;
    const dateTimeFormat = 'YYYY-MM-DD HH:mm';

    const allOccurencesWithSelectedResource = allOccurences.filter(
      (occurence) => {
        if (selectedResource.isCombo) {
          return selectedResource.resourcesForCombo.some((resourceForCombo) => {
            return resourceForCombo._id === occurence.resourceId;
          });
        }
        return occurence.resourceId === selectedResource._id;
      }
    );

    const newSelectedOccurences = [];
    selectedOccurences.forEach((selectedOccurence) => {
      const occurenceWithConflict = allOccurencesWithSelectedResource.find(
        (occurence) => {
          const selectedStart = `${selectedOccurence.startDate} ${selectedOccurence.startTime}`;
          const selectedEnd = `${selectedOccurence.endDate} ${selectedOccurence.endTime}`;
          const existingStart = `${occurence.startDate} ${occurence.startTime}`;
          const existingEnd = `${occurence.endDate} ${occurence.endTime}`;
          return (
            moment(selectedStart, dateTimeFormat).isBetween(
              existingStart,
              existingEnd
            ) ||
            moment(selectedEnd, dateTimeFormat).isBetween(
              existingStart,
              existingEnd
            )
          );
        }
      );
      if (occurenceWithConflict) {
        newSelectedOccurences.push({
          ...selectedOccurence,
          conflict: {
            ...occurenceWithConflict,
          },
        });
      } else {
        newSelectedOccurences.push({
          ...selectedOccurence,
          conflict: null,
        });
      }
    });
    this.setState({
      datesAndTimes: newSelectedOccurences,
    });
  };

  handleSelectedResource = (value) => {
    const { resources } = this.state;
    const selectedResource = resources.find((r) => r._id === value);
    this.setState({
      selectedResource,
    });
  };

  isFormValid = () => {
    const { formValues, datesAndTimes } = this.state;
    const { title } = formValues;
    const isValuesOK = formValues && formValues.resource && title?.length > 3;
    const isConflict = datesAndTimes.some((occurence) =>
      Boolean(occurence.conflict)
    );

    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const isTimesInValid = datesAndTimes.some((dateTime) => {
      return !regex.test(dateTime.startTime) || !regex.test(dateTime.endTime);
    });

    return isValuesOK && !isTimesInValid && !isConflict;
  };

  render() {
    const { currentUser, t, tc } = this.props;
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
      longDescription,
      isSuccess,
      isCreating,
      newActivityId,
      uploadableImageLocal,
      isPublicActivity,
      isExclusiveActivity,
      isReady,
      isRegistrationDisabled,
      datesAndTimes,
      resources,
    } = this.state;

    if (isSuccess) {
      return <Redirect to={`/event/${newActivityId}`} />;
    }

    if (!isReady) {
      return null;
    }

    const buttonLabel = isCreating ? t('form.waiting') : t('form.submit');

    const isFormValid = this.isFormValid();

    return (
      <Template
        heading={tc('labels.create', { domain: tc('domains.activity') })}
      >
        <Box bg="white" p="8">
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
    );
  }
}

NewActivity.contextType = StateContext;

export default NewActivity;
