import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { Box, VStack } from '@chakra-ui/react';

import ActivityForm from '../../UIComponents/ActivityForm';
import Template from '../../UIComponents/Template';
import { message, Alert } from '../../UIComponents/message';
import FormSwitch from '../../UIComponents/FormSwitch';
import { resizeImage, uploadImage } from '../../functions';
import { StateContext } from '../../LayoutContainer';

const successCreation = () => {
  message.success('Your activity is successfully created', 6);
};

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
    formValues: { ...formModel },
    longDescription: '',
    datesAndTimes: [{ ...emptyDateAndTime }],
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
  };

  handleSubmit = (values) => {
    const { isPublicActivity } = this.state;

    const runCallback = isPublicActivity
      ? this.uploadImage
      : this.createActivity;

    this.setState(
      {
        isCreating: true,
        formValues: values,
      },
      runCallback
    );
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

  createActivity = () => {
    const {
      formValues,
      longDescription,
      datesAndTimes,
      isPublicActivity,
      isRegistrationDisabled,
      uploadedImage,
    } = this.state;

    const values = {
      ...formValues,
      resource: formValues.resource,
      isPublicActivity,
      isRegistrationDisabled,
      datesAndTimes,
      longDescription,
    };

    Meteor.call('createActivity', values, uploadedImage, (error, result) => {
      if (error) {
        console.log('error', error);
        message.error(error.reason);
        this.setState({
          isCreating: false,
          isError: true,
        });
      } else {
        this.setState({
          isCreating: false,
          newActivityId: result,
          isSuccess: true,
        });
      }
    });
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
    const { formValues } = this.state;
    this.setState({
      datesAndTimes: selectedOccurences,
    });

    this.validateBookings(selectedOccurences, formValues.resource);
  };

  validateBookings = (selectedOccurences, selectedResource) => {
    const { allOccurences } = this.props;
    const dateTimeFormat = 'YYYY-MM-DD HH:mm';

    const allOccurencesWithSelectedResource = allOccurences.filter(
      (occurence) => {
        if (selectedResource.isCombo) {
          return selectedResource.resourcesForCombo.some((resourceForCombo) => {
            console.log(resourceForCombo.label, occurence.resource);
            return resourceForCombo.label === occurence.resource;
          });
        }
        return occurence.resource === selectedResource.label;
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

  isFormValid = () => {
    const { formValues, datesAndTimes } = this.state;
    const { title } = formValues;
    const isValuesOK = formValues && formValues.resource && title.length > 3;
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
    const { currentUser, resources } = this.props;
    const { canCreateContent } = this.context;

    if (!currentUser || !canCreateContent) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to become a contributor to create an activity."
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
      isRegistrationDisabled,
      datesAndTimes,
    } = this.state;

    if (isSuccess) {
      successCreation();
      return <Redirect to={`/event/${newActivityId}`} />;
    }

    const buttonLabel = isCreating
      ? 'Creating your activity...'
      : 'Confirm and Create';

    const isFormValid = this.isFormValid();

    return (
      <Template heading="Create a New Activity">
        <Box bg="white" p="8">
          <Box mb="8">
            <VStack spacing="2">
              <FormSwitch
                isChecked={isPublicActivity}
                label="Public Event"
                onChange={this.handlePublicActivitySwitch}
              />

              <FormSwitch
                isChecked={isPublicActivity || isExclusiveActivity}
                isDisabled={isPublicActivity}
                label="Exclusive Activity (Others cannot book)"
                onChange={this.handleExclusiveSwitch}
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
            defaultValues={formValues}
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
      </Template>
    );
  }
}

NewActivity.contextType = StateContext;

export default NewActivity;
