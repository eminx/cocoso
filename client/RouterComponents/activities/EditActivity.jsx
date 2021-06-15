import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Anchor, Box, Button, CheckBox, Text } from 'grommet';
import { FormPrevious } from 'grommet-icons';

import ActivityForm from '../../UIComponents/ActivityForm';
import Template from '../../UIComponents/Template';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { resizeImage, uploadImage } from '../../functions';
import { message, Alert } from '../../UIComponents/message';

const successEditMessage = (isDeleted) => {
  if (isDeleted) {
    message.success('The activity is successfully deleted', 4);
  } else {
    message.success('Your activity is successfully updated', 6);
  }
};

const sideNote =
  "Please check if a corresponding time and space is not taken already. \n It is your responsibility to make sure that there's no overlapping activities.";

const formModel = {
  resource: '',
  title: '',
  subTitle: '',
  place: '',
  address: '',
};

class EditActivity extends PureComponent {
  state = {
    isDeleteModalOn: false,
    formValues: formModel,
    longDescription: '',
    uploadableImage: null,
    uploadableImageLocal: null,
    uploadedImage: null,
    isPublicActivity: false,
    isActivitiesDisabled: false,
    datesAndTimes: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    isCreating: false,
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
    const {
      title,
      subTitle,
      longDescription,
      place,
      address,
      resource,
      practicalInfo,
      internalInfo,
      isPublicActivity,
      isActivitiesDisabled,
      datesAndTimes,
    } = activity;

    if (!isPublicActivity) {
      this.setState({
        formValues: {
          title,
          resource: {
            label: resource,
          },
        },
        longDescription,
        isPublicActivity,
        isActivitiesDisabled,
        datesAndTimes: [...datesAndTimes],
      });
    } else {
      this.setState({
        formValues: {
          title,
          subTitle,
          place,
          address,
          resource: {
            label: resource,
          },
          practicalInfo,
          internalInfo,
        },
        longDescription,
        isPublicActivity,
        isActivitiesDisabled,
        datesAndTimes: [...datesAndTimes],
      });
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
      const resizedImage = await resizeImage(uploadableImage, 500);
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
    const { activity } = this.props;
    const {
      formValues,
      isPublicActivity,
      isActivitiesDisabled,
      uploadedImage,
      datesAndTimes,
      longDescription,
    } = this.state;

    const values = {
      ...formValues,
      isPublicActivity,
      isActivitiesDisabled,
      datesAndTimes,
      longDescription,
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

  handleDisableActivitiesSwitch = (event) => {
    const value = event.target.checked;
    this.setState({
      isActivitiesDisabled: value,
    });
  };

  setDatesAndTimes = (datesAndTimes) => {
    this.setState({
      datesAndTimes,
    });
  };

  render() {
    const { activity, currentUser, resources } = this.props;

    if (!currentUser) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to signin to create a activity."
            type="error"
          />
        </div>
      );
    }

    if (!activity) {
      return null;
    }

    const {
      isDeleteModalOn,
      formValues,
      longDescription,
      isCreating,
      isSuccess,
      uploadableImageLocal,
      isPublicActivity,
      isActivitiesDisabled,
      datesAndTimes,
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
          <Link to={`/event/${activity._id}`}>
            <Box margin={{ bottom: 12 }} pad="small">
              <Anchor
                icon={<FormPrevious />}
                label={activity.title}
                size="medium"
              />
            </Box>
          </Link>
        }
      >
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
                checked={isActivitiesDisabled}
                label={<Text>RSVP disabled?</Text>}
                onChange={this.handleDisableActivitiesSwitch}
              />
            </Box>
          )}
        </Box>

        <Box>
          <ActivityForm
            imageUrl={activity && activity.imageUrl}
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
        </Box>

        <Box pad="medium" justify="end" pad="small">
          {activity.authorId === currentUser._id && (
            <Button onClick={this.showDeleteModal} label="Delete" />
          )}
        </Box>

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
