import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Alert } from 'antd/lib';
import { CheckBox, Box, Text, Heading } from 'grommet';

import BookingForm from '../../UIComponents/BookingForm';
import Template from '../../UIComponents/Template';

const successCreation = () => {
  message.success('Your booking is successfully created', 6);
};

const sideNote =
  "Please check if a corresponding time and space is not taken already. \n It is your responsibility to make sure that there's no overlapping bookings.";

const formModel = {
  title: '',
  subTitle: '',
  place: '',
  address: '',
  practicalInfo: '',
  internalInfo: '',
  room: ''
};

const defaultCapacity = 40;
const today = new Date().toISOString().substring(0, 10);
const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '',
  endTime: '',
  attendees: [],
  capacity: defaultCapacity
};

class NewBookSpace extends React.Component {
  state = {
    formValues: { ...formModel },
    longDescription: '',
    datesAndTimes: [{ ...emptyDateAndTime }],
    isLoading: false,
    isSuccess: false,
    isError: false,
    newBookingId: null,
    uploadedImage: null,
    uploadableImage: null,
    isPublicActivity: false,
    isBookingsDisabled: false,
    isCreating: false
  };

  handleFormValueChange = formValues => {
    this.setState({
      formValues
    });
  };

  handleQuillChange = longDescription => {
    this.setState({
      longDescription
    });
  };

  handleSubmit = () => {
    const { isPublicActivity } = this.state;

    if (isPublicActivity) {
      this.uploadImage();
    } else {
      this.createBooking();
    }

    this.setState({
      isCreating: true
    });
  };

  setUploadableImage = files => {
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
          uploadableImageLocal: reader.result
        });
      },
      false
    );
  };

  uploadImage = () => {
    this.setState({ isLoading: true });

    const { uploadableImage } = this.state;

    const upload = new Slingshot.Upload('activityImageUpload');

    upload.send(uploadableImage, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
        message.error(error.reason);
        this.setState({
          isCreating: false
        });
      } else {
        this.setState(
          {
            uploadedImage: downloadUrl
          },
          () => this.createBooking()
        );
      }
    });
  };

  createBooking = () => {
    const {
      formValues,
      longDescription,
      datesAndTimes,
      isPublicActivity,
      isBookingsDisabled,
      uploadedImage
    } = this.state;

    const values = {
      ...formValues,
      isPublicActivity,
      isBookingsDisabled,
      datesAndTimes,
      longDescription
    };

    Meteor.call('createBooking', values, uploadedImage, (error, result) => {
      if (error) {
        console.log('error', error);
        this.setState({
          isCreating: false,
          isError: true
        });
      } else {
        this.setState({
          isCreating: false,
          newBookingId: result,
          isSuccess: true
        });
      }
    });
  };

  handlePublicActivitySwitch = event => {
    const value = event.target.checked;
    this.setState({
      isPublicActivity: value
    });
  };

  handleDisableBookingsSwitch = event => {
    const value = event.target.checked;
    this.setState({
      isBookingsDisabled: value
    });
  };

  setDatesAndTimes = datesAndTimes => {
    this.setState({
      datesAndTimes
    });
  };

  render() {
    const { currentUser, places } = this.props;

    if (!currentUser || !currentUser.isRegisteredMember) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to become a registered member to create a group."
            type="error"
          />
        </div>
      );
    }

    const {
      formValues,
      isSuccess,
      isCreating,
      newBookingId,
      uploadableImageLocal,
      isPublicActivity,
      isBookingsDisabled,
      datesAndTimes
    } = this.state;

    if (isSuccess) {
      successCreation();
      if (isPublicActivity) {
        return <Redirect to={`/event/${newBookingId}`} />;
      } else {
        return <Redirect to={`/calendar`} />;
      }
    }

    const buttonLabel = isCreating
      ? 'Creating your activity...'
      : 'Confirm and Create';
    const { title } = formValues;
    const isFormValid = formValues && title.length > 3 && uploadableImageLocal;

    return (
      <Template heading="Create a New Activity">
        <Box margin={{ bottom: 'medium' }}>
          <Box flex={{ basis: 180 }} pad="small">
            <CheckBox
              checked={isPublicActivity}
              label={<Text>public event?</Text>}
              onChange={this.handlePublicActivitySwitch}
            />
          </Box>
          {isPublicActivity && (
            <Box flex={{ basis: 180 }} pad="small">
              <CheckBox
                checked={isBookingsDisabled}
                label={<Text>bookings disabled?</Text>}
                onChange={this.handleDisableBookingsSwitch}
              />
            </Box>
          )}
        </Box>

        <BookingForm
          setUploadableImage={this.setUploadableImage}
          uploadableImageLocal={uploadableImageLocal}
          places={places}
          isCreating={isCreating}
          isPublicActivity={isPublicActivity}
          formValues={formValues}
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

export default NewBookSpace;
