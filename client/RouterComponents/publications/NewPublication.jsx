import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, message, Alert } from 'antd/lib';

import PublicationForm from '../../UIComponents/PublicationForm';

const successCreation = () => {
  message.success('Your publication is successfully created', 6);
};

class NewPublication extends React.Component {
  state = {
    values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newPublicationId: null,
    uploadedImage: null,
    uploadableImage: null,
    uploadableImageLocal: null,
    uploadedDocument: null,
    uploadableDocument: null
  };

  registerPublicationLocally = values => {
    values.authorName = this.props.currentUser.username || 'emowtf';
    this.setState(
      {
        values
      },
      () => this.uploadDocument()
    );
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

    const { uploadableDocument, values, newPublicationId } = this.state;

    const upload = new Slingshot.Upload('publicationDocumentUpload');

    upload.send(uploadableDocument, (error, downloadUrl) => {
      if (error) {
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
    const { uploadableImage } = this.state;

    const upload = new Slingshot.Upload('publicationImageUpload');

    upload.send(uploadableImage, (error, imageUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState(
          {
            uploadedImageUrl: imageUrl
          },
          () => this.createPublication()
        );
      }
    });
  };

  createPublication = () => {
    const {
      values,
      uploadedDocumentUrl,
      uploadedDocumentId,
      uploadedImageUrl
    } = this.state;

    Meteor.call(
      'createPublication',
      values,
      uploadedImageUrl,
      uploadedDocumentUrl,
      uploadedDocumentId,
      (error, result) => {
        if (error) {
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

  render() {
    const { currentUser } = this.props;

    if (!currentUser || !currentUser.isRegisteredMember) {
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
      values,
      isLoading,
      isSuccess,
      newPublicationId,
      uploadableImage,
      uploadableImageLocal,
      uploadableDocument
    } = this.state;

    isSuccess ? successCreation() : null;

    return (
      <div style={{ padding: 24 }}>
        {isSuccess ? (
          <Redirect to={`/publication/${newPublicationId}`} />
        ) : null}

        <h1>Create a Publication</h1>
        <Row gutter={48}>
          <Col xs={24} sm={24} md={16}>
            <PublicationForm
              values={values}
              registerPublicationLocally={this.registerPublicationLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={uploadableImage}
              setUploadableDocument={this.setUploadableDocument}
              uploadableDocument={uploadableDocument}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewPublication;
