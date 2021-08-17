import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { CheckBox, Box, Text } from 'grommet';
import moment from 'moment';

import ActivityForm from '../../UIComponents/ActivityForm';
import Template from '../../UIComponents/Template';
import { message, Alert } from '../../UIComponents/message';
import { resizeImage, uploadImage } from '../../functions';
import { StateContext } from '../../LayoutContainer';
import { parseActsWithResources } from '../../functions';

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
};

class NewActivity extends PureComponent {
  state = {
    formValues: { ...formModel },
    longDescription: '',
    datesAndTimes: [{ ...emptyDateAndTime }],
    conflict: null,
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
    const { isPublicActivity } = this.state;

    if (isPublicActivity) {
      this.uploadImage();
    } else {
      this.createActivity();
    }

    this.setState({
      isCreating: true,
    });
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
      const resizedImage = await resizeImage(uploadableImage, 500);
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
    this.setState({
      datesAndTimes: selectedOccurences,
    });

    const { allOccurences } = this.props;
    const { formValues } = this.state;
    const selectedResource = formValues.resource;
    const dateTimeFormat = 'YYYY-MM-DD HH:mm';

    const allOccurencesWithSelectedResource = allOccurences.filter(
      (occurence) => {
        return occurence.resource === selectedResource.label;
      }
    );

    allOccurencesWithSelectedResource.some((occurence) => {
      const conflictingSelectedOccurence = selectedOccurences.find(
        (selectedOccurence) => {
          const start = `${selectedOccurence.startDate} ${selectedOccurence.startTime}`;
          const end = `${selectedOccurence.endDate} ${selectedOccurence.endTime}`;
          return (
            moment(
              `${occurence.startDate} ${occurence.startTime}`,
              dateTimeFormat
            ).isBetween(start, end, undefined, '[]') ||
            moment(
              `${occurence.startDate} ${occurence.startTime}`,
              dateTimeFormat
            ).isBetween(start, end, undefined, '[]')
          );
        }
      );
      console.log(conflictingSelectedOccurence);
      if (conflictingSelectedOccurence) {
        this.setState({
          conflict: {
            selectedOccurence: conflictingSelectedOccurence,
            existingOccurence: occurence,
            resource: selectedResource,
          },
        });
        return true;
      }
    });
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
    const { title } = formValues;
    const isFormValid = formValues && formValues.resource && title.length > 3;

    return (
      <Template heading="Create a New Activity">
        <Box margin={{ bottom: 'medium' }}>
          <Box flex={{ basis: 180 }} pad="small">
            <CheckBox
              checked={isPublicActivity}
              label={<Text>Public Event?</Text>}
              onChange={this.handlePublicActivitySwitch}
            />
          </Box>
          <Box flex={{ basis: 180 }} pad="small">
            <CheckBox
              checked={isPublicActivity || isExclusiveActivity}
              disabled={isPublicActivity}
              label={<Text>Exclusive Activity (Others cannot book)</Text>}
              onChange={this.handleExclusiveSwitch}
            />
          </Box>
          {isPublicActivity && (
            <Box flex={{ basis: 180 }} pad="small">
              <CheckBox
                checked={isRegistrationDisabled}
                label={<Text>RSVP disabled?</Text>}
                onChange={this.handleRegistrationSwitch}
              />
            </Box>
          )}
        </Box>

        <ActivityForm
          setUploadableImage={this.setUploadableImage}
          uploadableImageLocal={uploadableImageLocal}
          resources={resources}
          isCreating={isCreating}
          isPublicActivity={isPublicActivity}
          formValues={formValues}
          longDescription={longDescription}
          onFormValueChange={this.handleFormValueChange}
          onQuillChange={this.handleQuillChange}
          onSubmit={this.handleSubmit}
          setDatesAndTimes={this.setDatesAndTimes}
          datesAndTimes={datesAndTimes}
          buttonLabel={buttonLabel}
          isFormValid={isFormValid}
          isButtonDisabled={!isFormValid || isCreating}
        />
      </Template>
    );
  }
}

NewActivity.contextType = StateContext;

export default NewActivity;
