import { Meteor } from 'meteor/meteor';
import React from 'react';
import CreatePageForm from '../../UIComponents/CreatePageForm';
import ModalArticle from '../../UIComponents/ModalArticle';
import { Row, Col, message, Alert, Affix } from 'antd/lib';
import { Redirect } from 'react-router-dom';

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
    newPageId: null,
    uploadedImage: null,
    uploadableImage: null
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
    const { pageData } = this.props;
    const imageUrl = uploadedImageUrl || pageData.imageUrl;

    Meteor.call(
      'updatePage',
      pageData._id,
      values,
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
            newPageId: result,
            isSuccess: true
          });
        }
      }
    );
  };

  hideModal = () => this.setState({ modalConfirm: false });
  showModal = () => this.setState({ modalConfirm: true });

  render() {
    if (!this.props.currentUser || !this.props.currentUser.isSuperAdmin) {
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
      newPageId,
      uploadableImage
    } = this.state;

    if (isSuccess) {
      successCreation();
      return <Redirect to={`/page/${newPageId}`} />;
    }

    const { pageData } = this.props;

    return (
      <div style={{ padding: 24 }}>
        <h1>Edit your booking</h1>
        <Row gutter={48}>
          <Col xs={24} sm={24} md={16}>
            <CreatePageForm
              values={values}
              pageData={pageData}
              registerPageLocally={this.registerPageLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={
                (pageData && pageData.imageUrl) || uploadableImage
              }
            />
          </Col>
        </Row>
        {modalConfirm ? (
          <ModalArticle
            item={values}
            isLoading={isLoading}
            title="Overview The Information"
            visible={modalConfirm}
            onOk={this.uploadImage}
            onCancel={this.hideModal}
            okText="Confirm"
            cancelText="Go back and edit"
          />
        ) : null}
      </div>
    );
  }
}

export default EditPage;
