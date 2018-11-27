import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import React from 'react';
import CreatePublicationForm from '../../UIComponents/CreatePublicationForm';
import ModalArticle from '../../UIComponents/ModalArticle';
import { Row, Col, message, Alert, Modal, Button, Affix } from 'antd/lib';
import { Redirect } from 'react-router-dom';

const successCreation = () =>
  message.success('Your publication is successfully edited', 6);

const successDelete = () =>
  message.success('The publication is successfully deleted', 4);

const sideNote = 'This page is dedicated to create publications at Skogen.';

class EditPublication extends React.Component {
  state = {
    modalConfirm: false,
    isDeleteModalOn: false,
    values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newPublicationId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null,
    uploadableDocument: null
  };

  registerPublicationLocally = values => {
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

  setUploadableDocument = e => {
    const theDocumentFile = e.file.originFileObj;
    const reader = new FileReader();
    reader.readAsDataURL(theDocumentFile);
    reader.addEventListener(
      'load',
      () => {
        this.setState({
          uploadableDocument: theDocumentFile
        });
      },
      false
    );
  };

  uploadDocument = () => {
    this.setState({ isLoading: true });

    const { uploadableDocument, values } = this.state;
    if (!uploadableDocument) {
      this.uploadImage();
      return;
    }

    const upload = new Slingshot.Upload('publicationDocumentUpload');

    upload.send(uploadableDocument, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        Meteor.call(
          'createDocument',
          values.title,
          downloadUrl,
          'publication',
          (error, respond) => {
            if (error) {
              console.log(error);
            } else {
              console.log(respond);
              this.setState(
                {
                  uploadedDocumentUrl: downloadUrl,
                  uploadedDocumentId: respond
                },
                () => this.uploadImage()
              );
            }
          }
        );
      }
    });
  };

  uploadImage = () => {
    this.setState({ isLoading: true });
    const { uploadableImage } = this.state;

    if (uploadableImage === null) {
      console.log('no uploadable image');
      this.updatePublication();
      return;
    }

    const upload = new Slingshot.Upload('publicationImageUpload');
    const timeStamp = Math.floor(Date.now());

    upload.send(uploadableImage, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState({
          uploadedImage: downloadUrl
        });
        this.updatePublication(downloadUrl);
      }
    });
  };

  updatePublication = () => {
    const {
      values,
      uploadedImage,
      uploadedDocumentUrl,
      uploadedDocumentId
    } = this.state;
    const { publicationData } = this.props;
    const imageUrl = uploadedImage || publicationData.imageUrl;
    const linkToDigitalCopy =
      uploadedDocumentUrl || publicationData.linkToDigitalCopy;
    const documentId = uploadedDocumentId || publicationData.documentId;

    Meteor.call(
      'updatePublication',
      publicationData._id,
      values,
      imageUrl,
      linkToDigitalCopy,
      documentId,
      (error, result) => {
        if (error) {
          console.log(error);
          this.setState({
            isLoading: false,
            isError: true
          });
        } else {
          this.setState({
            isLoading: false,
            newPublicationId: result,
            isSuccess: true
          });
        }
      }
    );
  };

  hideModal = () => this.setState({ modalConfirm: false });
  showModal = () => this.setState({ modalConfirm: true });

  hideDeleteModal = () => this.setState({ isDeleteModalOn: false });
  showDeleteModal = () => this.setState({ isDeleteModalOn: true });

  deletePublication = () => {
    const publicationId = this.props.publicationData._id;
    Meteor.call('deletePublication', publicationId, (error, respond) => {
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
    if (!this.props.currentUser) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to become a registered member to create a publication."
            type="error"
          />
        </div>
      );
    }

    const {
      modalConfirm,
      isDeleteModalOn,
      values,
      isLoading,
      isSuccess,
      newPublicationId,
      uploadedImage,
      uploadableImage,
      uploadableImageLocal,
      uploadableDocument
    } = this.state;

    if (isSuccess && newPublicationId) {
      successCreation();
      return <Redirect to={`/publication/${newPublicationId}`} />;
    } else if (isSuccess) {
      return <Redirect to="/publications" />;
    }

    const { publicationData, currentUser } = this.props;

    return (
      <div style={{ padding: 24 }}>
        {publicationData && (
          <div style={{ marginBottom: 12 }}>
            <Link to={`/publication/${publicationData._id}`}>
              <Button icon="arrow-left">{publicationData.title}</Button>
            </Link>
          </div>
        )}

        <h1>Edit your Publication</h1>
        <Row gutter={48}>
          <Col xs={24} sm={24} md={16}>
            {publicationData &&
              currentUser &&
              publicationData.adminId === currentUser._id && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: 12
                  }}
                >
                  <Button onClick={this.showDeleteModal}>Delete</Button>
                </div>
              )}

            <CreatePublicationForm
              values={values}
              publicationData={publicationData}
              registerPublicationLocally={this.registerPublicationLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={
                (publicationData && publicationData.imageUrl) || uploadableImage
              }
              setUploadableDocument={this.setUploadableDocument}
              uploadableDocument={
                (publicationData && publicationData.linkToDigitalCopy) ||
                uploadableDocument
              }
            />
          </Col>
        </Row>
        {modalConfirm && (
          <ModalArticle
            item={values}
            isLoading={isLoading}
            title="Overview The Information"
            visible={modalConfirm}
            onOk={this.uploadDocument}
            onCancel={this.hideModal}
            okText="Confirm"
            cancelText="Go back and edit"
          />
        )}

        <Modal
          title="Confirm"
          visible={isDeleteModalOn}
          onOk={this.deletePublication}
          onCancel={this.hideDeleteModal}
          okText="Yes, delete"
          cancelText="Cancel"
        >
          Are you sure you want to delete this publication?
        </Modal>
      </div>
    );
  }
}

export default EditPublication;
