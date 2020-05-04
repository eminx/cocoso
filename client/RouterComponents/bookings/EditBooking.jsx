import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, message, Alert, Modal } from 'antd/lib';
import { Box, Heading, Button, CheckBox, Text } from 'grommet';

import CreateBookingForm from '../../UIComponents/CreateBookingForm';

const successEditMessage = isDeleted => {
  if (isDeleted) {
    message.success('The booking is successfully deleted', 4);
  } else {
    message.success('Your booking is successfully updated', 6);
  }
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

class EditBooking extends PureComponent {
  state = {
    isDeleteModalOn: false,
    formValues: formModel,
    longDescription: '',
    uploadableImage: null,
    uploadableImageLocal: null,
    uploadedImage: null,
    isPublicActivity: false,
    isBookingsDisabled: false,
    datesAndTimes: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    isCreating: false
  };

  componentDidMount() {
    this.setInitialData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.gatheringData && this.props.gatheringData) {
      this.setInitialData();
    }
  }

  setInitialData = () => {
    const { gatheringData } = this.props;
    if (!gatheringData) {
      return;
    }
    const {
      title,
      subTitle,
      longDescription,
      place,
      address,
      room,
      practicalInfo,
      internalInfo,
      isPublicActivity,
      isBookingsDisabled,
      datesAndTimes
    } = gatheringData;

    if (!isPublicActivity) {
      this.setState({
        formValues: {
          title,
          room
        },
        longDescription,
        isPublicActivity,
        isBookingsDisabled,
        datesAndTimes: [...datesAndTimes]
      });
    } else {
      this.setState({
        formValues: {
          title,
          subTitle,
          place,
          address,
          room,
          practicalInfo,
          internalInfo
        },
        longDescription,
        isPublicActivity,
        isBookingsDisabled,
        datesAndTimes: [...datesAndTimes, { ...emptyDateAndTime }]
      });
    }
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
    const { isPublicActivity, uploadableImage } = this.state;
    this.setState({
      isCreating: true
    });

    if (isPublicActivity && uploadableImage) {
      this.uploadImage();
    } else {
      this.updateBooking();
    }
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
          () => this.updateBooking()
        );
      }
    });
  };

  updateBooking = () => {
    const { gatheringData } = this.props;
    const {
      formValues,
      isPublicActivity,
      isBookingsDisabled,
      uploadedImage,
      datesAndTimes,
      longDescription
    } = this.state;

    const values = {
      ...formValues,
      isPublicActivity,
      isBookingsDisabled,
      datesAndTimes,
      longDescription
    };

    const imageUrl = uploadedImage || gatheringData.imageUrl;

    Meteor.call(
      'updateBooking',
      values,
      gatheringData._id,
      imageUrl,
      (error, respond) => {
        if (error) {
          this.setState({
            isLoading: false,
            isError: true
          });
        } else {
          this.setState({
            isLoading: false,
            isSuccess: true
          });
        }
      }
    );
  };

  hideDeleteModal = () => this.setState({ isDeleteModalOn: false });
  showDeleteModal = () => this.setState({ isDeleteModalOn: true });

  deleteBooking = () => {
    const bookingId = this.props.gatheringData._id;

    Meteor.call('deleteBooking', bookingId, (error, respond) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          isLoading: false,
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
    const { gatheringData, currentUser, places } = this.props;

    if (!currentUser) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to signin to create a booking."
            type="error"
          />
        </div>
      );
    }

    if (!gatheringData) {
      return null;
    }

    const {
      isDeleteModalOn,
      formValues,
      isCreating,
      isSuccess,
      uploadableImageLocal,
      isPublicActivity,
      isBookingsDisabled,
      datesAndTimes
    } = this.state;

    if (isSuccess) {
      successEditMessage(isDeleteModalOn);
      if (isDeleteModalOn) {
        return <Redirect to="/calendar" />;
      }
      if (isPublicActivity) {
        return <Redirect to={`/event/${gatheringData._id}`} />;
      } else {
        return <Redirect to="/calendar" />;
      }
    }

    const buttonLabel = isCreating
      ? 'Creating your activity...'
      : 'Confirm and Create';
    const { title } = formValues;
    const isFormValid = formValues && title.length > 3;

    return (
      <Box pad="medium">
        <Box margin={{ bottom: 12 }}>
          <Link to={`/event/${gatheringData._id}`}>
            <Button label={gatheringData.title} plain />
          </Link>
        </Box>

        <Box>
          <Heading level={3} alignSelf="center">
            Edit Activity
          </Heading>
        </Box>

        <Box
          direction="row"
          flex={{ grow: 2 }}
          wrap
          justify="end"
          alignSelf="center"
          pad="medium"
        >
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

        <Box>
          <CreateBookingForm
            imageUrl={gatheringData && gatheringData.imageUrl}
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
        </Box>

        <Box pad="medium" justify="end" pad="small">
          {gatheringData.authorId === currentUser._id && (
            <Button onClick={this.showDeleteModal} label="Delete" />
          )}
        </Box>

        <Modal
          title="Confirm"
          visible={isDeleteModalOn}
          onOk={this.deleteBooking}
          onCancel={this.hideDeleteModal}
          okText="Yes, delete"
          cancelText="Cancel"
        >
          Are you sure you want to delete this booking?
        </Modal>
      </Box>
    );
  }
}

export default EditBooking;
