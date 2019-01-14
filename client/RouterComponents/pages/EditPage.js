import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, message, Alert, Modal, Button } from 'antd/lib';
import { Redirect } from 'react-router-dom';

import CreatePageForm from '../../UIComponents/CreatePageForm';
import ModalArticle from '../../UIComponents/ModalArticle';
import { parseTitle } from '../../functions';

const successCreation = () => {
  message.success('The page is successfully updated', 6);
};

class EditPage extends React.Component {
  state = {
    modalConfirm: false,
    values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newPageTitle: null,
    uploadedImage: null,
    uploadableImage: null,
    isDeleteModalOn: false
  };

  registerPageLocally = values => {
    values.authorName = this.props.currentUser.username || 'emo';
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

    if (!uploadableImage) {
      console.log('no uploadable image');
      this.updatePage();
      return;
    }

    const upload = new Slingshot.Upload('pageImageUpload');

    upload.send(uploadableImage, (error, imageUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState(
          {
            uploadedImageUrl: imageUrl
          },
          () => this.updatePage()
        );
      }
    });
  };

  updatePage = () => {
    const { values, uploadedImageUrl } = this.state;
    const { currentUser, pageData } = this.props;
    // const imageUrl = uploadedImageUrl || pageData.imageUrl;

    if (!currentUser || !currentUser.isSuperAdmin) {
      message.error('You are not allowed');
      return false;
    }

    Meteor.call(
      'updatePage',
      pageData._id,
      values,
      // imageUrl,
      (error, respond) => {
        if (error) {
          this.setState({
            isLoading: false,
            isError: true
          });
        } else {
          this.setState({
            isLoading: false,
            newPageTitle: parseTitle(respond),
            isSuccess: true
          });
        }
      }
    );
  };

  handleDeletePage = () => {
    const { currentUser, pageData } = this.props;
    if (!currentUser || !currentUser.isSuperAdmin) {
      message.error('You are not allowed');
      return false;
    }

    this.setState({ isLoading: true });

    Meteor.call('deletePage', pageData._id, (error, respond) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          isLoading: false,
          newPageTitle: 'deleted',
          isSuccess: true
        });
      }
    });
  };

  hideModal = () => this.setState({ modalConfirm: false });
  showModal = () => this.setState({ modalConfirm: true });

  closeDeleteModal = () => this.setState({ isDeleteModalOn: false });
  openDeleteModal = () => this.setState({ isDeleteModalOn: true });

  render() {
    const { pageData, pageTitles, currentUser } = this.props;

    if (!currentUser || !currentUser.isSuperAdmin) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert message="You are not allowed." type="error" />
        </div>
      );
    }

    const {
      modalConfirm,
      values,
      isLoading,
      isSuccess,
      newPageTitle,
      uploadableImage,
      isDeleteModalOn
    } = this.state;

    if (isSuccess) {
      successCreation();
      if (newPageTitle === 'deleted') {
        return <Redirect to="/page/about-skogen" />;
      } else {
        return <Redirect to={`/page/${parseTitle(newPageTitle)}`} />;
      }
    }

    return (
      <div style={{ padding: 24 }}>
        {pageData && (
          <div style={{ marginBottom: 12 }}>
            <Link to={`/page/${pageData.title}`}>
              <Button icon="arrow-left">{pageData.title}</Button>
            </Link>
          </div>
        )}
        <h2>Edit your booking</h2>
        <Row gutter={48}>
          <Col md={20}>
            <CreatePageForm
              values={values}
              pageData={pageData}
              pageTitles={pageTitles}
              registerPageLocally={this.registerPageLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={
                (pageData && pageData.imageUrl) || uploadableImage
              }
            />
          </Col>

          <Col md={4}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={this.openDeleteModal}>Delete this page</Button>
            </div>
          </Col>
        </Row>
        {modalConfirm ? (
          <ModalArticle
            item={values}
            isLoading={isLoading}
            title="Overview The Information"
            visible={modalConfirm}
            onOk={this.updatePage}
            onCancel={this.hideModal}
            okText="Confirm"
            cancelText="Go back and edit"
          />
        ) : null}

        <Modal
          onOk={this.handleDeletePage}
          onCancel={this.closeDeleteModal}
          visible={isDeleteModalOn}
          title="Confirm Delete"
        >
          Are you sure you want to delete this page?
        </Modal>
      </div>
    );
  }
}

export default EditPage;
