import { Meteor } from 'meteor/meteor';
import React from 'react';
import CreateGroupForm from '../../UIComponents/CreateGroupForm';
import ModalArticle from '../../UIComponents/ModalArticle';
import { Row, Col, message, Alert, Affix } from 'antd/lib';
import { Redirect } from 'react-router-dom';

const successCreation = () => {
  message.success('Your group is successfully edited', 6);
};

const sideNote = 'This page is dedicated to create study groups at Skogen.';

class EditGroup extends React.Component {
  state = {
    modalConfirm: false,
    values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newGroupId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null,
    uploadableDocument: null
  };

  registerGroupLocally = values => {
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

    const upload = new Slingshot.Upload('groupDocumentUpload');

    upload.send(uploadableDocument, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        Meteor.call(
          'createDocument',
          values.readingMaterial,
          downloadUrl,
          'group',
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
      this.updateGroup();
      return;
    }

    const upload = new Slingshot.Upload('groupImageUpload');
    const timeStamp = Math.floor(Date.now());

    upload.send(uploadableImage, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState({
          uploadedImage: downloadUrl
        });
        this.updateGroup(downloadUrl);
      }
    });
  };

  updateGroup = () => {
    const {
      values,
      uploadedImage,
      uploadedDocumentUrl,
      uploadedDocumentId
    } = this.state;
    const { groupData } = this.props;
    const imageUrl = uploadedImage || groupData.imageUrl;
    const documentUrl = uploadedDocumentUrl || groupData.documentUrl;
    const documentId = uploadedDocumentId || groupData.documentId;

    Meteor.call(
      'updateGroup',
      groupData._id,
      values,
      imageUrl,
      documentUrl,
      documentId,
      (error, result) => {
        if (error) {
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
      }
    );
  };

  hideModal = () => this.setState({ modalConfirm: false });
  showModal = () => this.setState({ modalConfirm: true });

  render() {
    if (!this.props.currentUser) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to become a registered member to create a study group. Just do it!"
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
      uploadableImageLocal,
      uploadableDocument
    } = this.state;

    if (isSuccess) {
      successCreation();
      return <Redirect to={`/group/${newGroupId}`} />;
    }

    const { groupData } = this.props;

    return (
      <div style={{ padding: 24 }}>
        <h1>Edit your Study Group</h1>
        <Row gutter={48}>
          <Col xs={24} sm={24} md={16}>
            <CreateGroupForm
              values={values}
              groupData={groupData}
              registerGroupLocally={this.registerGroupLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={
                (groupData && groupData.imageUrl) || uploadableImage
              }
              setUploadableDocument={this.setUploadableDocument}
              uploadableDocument={
                (groupData && groupData.documentUrl) || uploadableDocument
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
            onOk={this.uploadDocument}
            onCancel={this.hideModal}
            okText="Confirm"
            cancelText="Go back and edit"
          />
        ) : null}
      </div>
    );
  }
}

export default EditGroup;
