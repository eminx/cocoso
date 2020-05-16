import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import React from 'react';
import { message, Alert } from 'antd/lib';
import { Redirect } from 'react-router-dom';
import { Box, Button } from 'grommet';

import GroupForm from '../../UIComponents/GroupForm';
import Template from '../../UIComponents/Template';
import Loader from '../../UIComponents/Loader';
import ConfirmModal from '../../UIComponents/ConfirmModal';

const successUpdate = () =>
  message.success('Your group is successfully updated', 6);

const successDelete = () =>
  message.success('The group is successfully deleted', 4);

const sideNote = 'This page is dedicated to create groups';

class EditGroup extends React.Component {
  state = {
    formValues: {
      title: '',
      readingMaterial: '',
      description: '',
      capacity: 12
    },
    isDeleteModalOn: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newGroupId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null
  };

  componentDidMount() {
    if (this.props.group) {
      this.setFormValues();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.group && this.props.group) {
      this.setFormValues();
    }
  }

  setFormValues = () => {
    const { group } = this.props;

    if (!group || !group.title || !group.description) {
      return;
    }
    this.setState({
      formValues: {
        title: group.title,
        readingMaterial: group.readingMaterial,
        description: group.description,
        capacity: group.capacity
      }
    });
  };

  handleFormChange = value => {
    const { formValues } = this.state;
    let capacity = parseInt(value.capacity) || 2;
    if (capacity > 30) {
      capacity = 30;
    }

    const newFormValues = {
      ...value,
      capacity,
      description: formValues.description
    };

    this.setState({
      formValues: newFormValues
    });
  };

  handleQuillChange = description => {
    const { formValues } = this.state;
    const newFormValues = {
      ...formValues,
      description
    };

    this.setState({
      formValues: newFormValues
    });
  };

  handleSubmit = () => {
    const { uploadableImage } = this.state;

    this.setState({
      isUpdating: true
    });

    if (!uploadableImage) {
      console.log('no uploadable image');
      this.updateGroup();
      return;
    }

    this.uploadImage();
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
    const { uploadableImage } = this.state;

    const upload = new Slingshot.Upload('groupImageUpload');

    upload.send(uploadableImage, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState(
          {
            uploadedImage: downloadUrl
          },
          this.updateGroup
        );
      }
    });
  };

  updateGroup = () => {
    const { group } = this.props;
    const { formValues, uploadedImage } = this.state;
    const imageUrl = uploadedImage || group.imageUrl;

    Meteor.call(
      'updateGroup',
      group._id,
      formValues,
      imageUrl,
      (error, result) => {
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

  deleteGroup = () => {
    const groupId = this.props.group._id;
    Meteor.call('deleteGroup', groupId, (error, respond) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        successDelete();
        this.setState({
          isLoading: false,
          isSuccess: true
        });
      }
    });
  };

  render() {
    const { group, currentUser } = this.props;

    if (!group) {
      return <Loader />;
    }

    if (!currentUser) {
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
      isDeleteModalOn,
      formValues,
      isSuccess,
      uploadableImageLocal,
      isUpdating
    } = this.state;

    if (isSuccess) {
      successUpdate();
      return <Redirect to={`/group/${group._id}`} />;
    }

    const buttonLabel = isUpdating
      ? 'Updating your group...'
      : 'Confirm and Update Group';

    const { title, description } = formValues;
    const isFormValid =
      formValues &&
      title.length > 3 &&
      description.length > 20 &&
      (uploadableImageLocal || group.imageUrl);

    return (
      <Template
        heading="Edit your Group"
        leftContent={
          <Box pad="small">
            <Link to={`/group/${group._id}`}>
              <Button plain label={group.title} />
            </Link>
          </Box>
        }
        rightContent={
          group.adminId === currentUser._id && (
            <Box pad="small">
              <Button
                plain
                color="status-critical"
                label="Delete"
                onClick={this.showDeleteModal}
              />
            </Box>
          )
        }
      >
        <GroupForm
          formValues={formValues}
          onFormChange={this.handleFormChange}
          onQuillChange={this.handleQuillChange}
          onSubmit={this.handleSubmit}
          setUploadableImage={this.setUploadableImage}
          uploadableImageLocal={uploadableImageLocal}
          imageUrl={group && group.imageUrl}
          buttonLabel={buttonLabel}
          isFormValid={isFormValid}
          isButtonDisabled={!isFormValid || isUpdating}
        />

        <ConfirmModal
          title="Confirm Delete"
          visible={isDeleteModalOn}
          onConfirm={this.deleteGroup}
          onCancel={this.hideDeleteModal}
          okText="Yes, delete"
        >
          Are you sure you want to delete this group?
        </ConfirmModal>
      </Template>
    );
  }
}

export default EditGroup;
