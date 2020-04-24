import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, message, Alert } from 'antd/lib';
import { Heading } from 'grommet';

import CreatePageForm from '../../UIComponents/CreatePageForm';
import ModalArticle from '../../UIComponents/ModalArticle';
import PagesList from '../../UIComponents/PagesList';

import { parseTitle } from '../../functions';

const successCreation = () => {
  message.success('New page is successfully created', 6);
};

class NewPage extends React.Component {
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
    this.setState({ isLoading: true });
    const { uploadableImage } = this.state;

    const upload = new Slingshot.Upload('pageImageUpload');

    upload.send(uploadableImage, (error, imageUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState(
          {
            uploadedImageUrl: imageUrl,
            isLoading: false
          },
          () => this.createPage()
        );
      }
    });
  };

  createPage = () => {
    const { currentUser } = this.props;
    if (!currentUser || !currentUser.isSuperAdmin) {
      message.error('This is not allowed');
      return false;
    }
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
          newPageId: parseTitle(result),
          isSuccess: true
        });
      }
    });
  };

  hideModal = () => this.setState({ modalConfirm: false });
  showModal = () => this.setState({ modalConfirm: true });

  render() {
    const { currentUser, pageTitles } = this.props;

    if (!currentUser || !currentUser.isSuperAdmin) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to be super admin to create a static page."
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

    isSuccess && successCreation();

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col md={8}>
            <PagesList
              pageTitles={pageTitles}
              activePageTitle={''}
              onChange={this.handlePageClick}
            />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Heading level={3}>Create a New Page</Heading>
            <CreatePageForm
              pageTitles={pageTitles}
              values={values}
              registerPageLocally={this.registerPageLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={uploadableImage}
            />
          </Col>
        </Row>

        {modalConfirm && (
          <ModalArticle
            item={values}
            isLoading={isLoading}
            title="Overview The Information"
            imageSrc={uploadableImageLocal}
            visible={modalConfirm}
            onOk={this.createPage}
            onCancel={this.hideModal}
            okText="Confirm"
            cancelText="Go back and edit"
          />
        )}

        {isSuccess && <Redirect to={`/page/${newPageId}`} />}
      </div>
    );
  }
}

export default NewPage;
