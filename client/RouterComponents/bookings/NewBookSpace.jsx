import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Alert } from 'antd/lib';
import { CheckBox, Box, Text, Heading } from 'grommet';

import CreateBookingForm from '../../UIComponents/CreateBookingForm';

const successCreation = () => {
  message.success('Your booking is successfully created', 6);
};

const sideNote =
  "Please check if a corresponding time and space is not taken already. \n It is your responsibility to make sure that there's no overlapping bookings.";

const formModel = {
  title: '',
  subtitle: '',
  longDescription: '',
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
    datesAndTimes: [{ ...emptyDateAndTime }],
    isLoading: false,
    isSuccess: false,
    isError: false,
    newBookingId: null,
    uploadedImage: null,
    uploadableImage: null,
    isPublicActivity: false,
    isBookingsDisabled: false
  };

  handleFormValueChange = newValues => {
    const { formValues } = this.state;

    const newFormValues = {
      ...newValues,
      longDescription: formValues.longDescription
    };

    this.setState({
      formValues: newFormValues
    });
  };

  handleQuillChange = longDescription => {
    const { formValues } = this.state;
    const newFormValues = {
      ...formValues,
      longDescription
    };
    this.setState({
      formValues: newFormValues
    });
  };

  handleSubmit = () => {
    const { isPublicActivity } = this.state;

    if (isPublicActivity) {
      this.uploadImage();
    } else {
      this.createBooking();
    }
  };

  setUploadableImage = e => {
    const theImageFile = e.file.originFileObj;
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
      datesAndTimes,
      isPublicActivity,
      isBookingsDisabled,
      uploadedImage
    } = this.state;

    console.log('maybe');

    const values = {
      ...formValues,
      isPublicActivity: isPublicActivity,
      isBookingsDisabled: isBookingsDisabled,
      datesAndTimes: datesAndTimes
    };

    Meteor.call('createBooking', values, uploadedImage, (error, result) => {
      if (error) {
        console.log('error', error);
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          isLoading: false,
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
      modalConfirm,
      formValues,
      isLoading,
      isSuccess,
      newBookingId,
      uploadedImage,
      uploadableImage,
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

    return (
      <div style={{ padding: 24 }}>
        <Box>
          <Heading alignSelf="center" level={3}>
            Create a New Activity
          </Heading>
        </Box>

        <Box direction="row" flex={{ grow: 2 }} wrap justify="end">
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

        <CreateBookingForm
          setUploadableImage={this.setUploadableImage}
          uploadableImage={uploadableImage}
          places={places}
          isPublicActivity={isPublicActivity}
          formValues={formValues}
          onFormValueChange={this.handleFormValueChange}
          onQuillChange={this.handleQuillChange}
          onSubmit={this.handleSubmit}
          setDatesAndTimes={this.setDatesAndTimes}
          datesAndTimes={datesAndTimes}
        />
      </div>
    );
  }
}

export default NewBookSpace;
