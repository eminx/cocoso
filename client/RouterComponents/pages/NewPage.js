import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, message, Alert, Affix } from 'antd/lib';

import CreatePageForm from '../../UIComponents/CreatePageForm';
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
    newPageId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null
  };

  registerPageLocally = values => {
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
    const { uploadableImage } = this.state;

    const upload = new Slingshot.Upload('pageImageUpload');

    upload.send(uploadableImage, (error, imageUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState(
          {
            uploadedImageUrl: imageUrl
          },
          () => this.createGroup()
        );
      }
    });
  };

  createPage = () => {
    const { values, uploadedImageUrl } = this.state;

    Meteor.call('createPage', values, uploadedImageUrl, (error, result) => {
      if (error) {
        console.log('error', error);
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          isLoading: false,
          newPageId: result,
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
      newPageId,
      uploadableImage,
      uploadableImageLocal
    } = this.state;

    isSuccess ? successCreation() : null;

    return (
      <div style={{ padding: 24 }}>
        <h1>Create a Study Group</h1>
        <Row gutter={48}>
          <Col xs={24} sm={24} md={16}>
            <CreatePageForm
              values={values}
              registerPageLocally={this.registerPageLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={uploadableImage}
            />
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

        {isSuccess ? <Redirect to={`/group/${newPageId}`} /> : null}
      </div>
    );
  }
}

export default NewPage;
