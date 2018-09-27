import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, message, Alert, Affix } from 'antd/lib';

import CreateGroupForm from '../../UIComponents/CreateGroupForm';
import ModalArticle from '../../UIComponents/ModalArticle';

const successCreation = () => {
  message.success('Your study group is successfully created', 6);
};

const sideNote = 'This page is dedicated to create study groups at Skogen.';

class NewGroup extends React.Component {
  state = {
    modalConfirm: false,
    values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newGroupId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null
  };

  registerGroupLocally = values => {
    values.authorName = this.props.currentUser.username || 'emowtf';
    this.setState({
      values: values,
      modalConfirm: true
    });
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

    const upload = new Slingshot.Upload('groupImageUpload');
    const timeStamp = Math.floor(Date.now());

    upload.send(uploadableImage, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState(
          {
            uploadedImage: downloadUrl
          },
          () => this.createGroup(downloadUrl)
        );
      }
    });
  };

  createGroup = downloadUrl => {
    const { values } = this.state;

    Meteor.call('createGroup', values, downloadUrl, (error, result) => {
      if (error) {
        console.log('error', error);
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          isLoading: false,
          newGroupId: result,
          isSuccess: true
        });
      }
    });
  };

  hideModal = () => this.setState({ modalConfirm: false });
  showModal = () => this.setState({ modalConfirm: true });

  render() {
    const { currentUser } = this.props;

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
      values,
      isLoading,
      isSuccess,
      newGroupId,
      uploadedImage,
      uploadableImage,
      uploadableImageLocal
    } = this.state;

    isSuccess ? successCreation() : null;

    return (
      <div style={{ padding: 24 }}>
        <h1>Create a Study Group</h1>
        <Row gutter={48}>
          <Col xs={24} sm={24} md={16}>
            <CreateGroupForm
              values={values}
              registerGroupLocally={this.registerGroupLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={this.state.uploadableImage}
              places={this.props.places}
              currentUser={currentUser}
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Affix offsetTop={50}>
              <Alert message={sideNote} type="warning" showIcon />
            </Affix>
          </Col>
        </Row>
        {modalConfirm ? (
          <ModalArticle
            item={values}
            isLoading={isLoading}
            title="Overview The Information"
            imageSrc={uploadableImageLocal}
            visible={modalConfirm}
            onOk={this.uploadImage}
            onCancel={this.hideModal}
            okText="Confirm"
            cancelText="Go back and edit"
          />
        ) : null}

        {isSuccess ? <Redirect to={`/group/${newGroupId}`} /> : null}
      </div>
    );
  }
}

export default NewGroup;
