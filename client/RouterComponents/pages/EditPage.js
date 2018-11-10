import { Meteor } from 'meteor/meteor';
import React from 'react';
import CreatePageForm from '../../UIComponents/CreateBookingForm';
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

  updatePage = () => {
    const { values } = this.state;
    const { gatheringData } = this.props;

    Meteor.call('updatePage', values, gatheringData._id, (error, result) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          isLoading: false,
          newBookingId: result,
          isSuccess: true
        });
      }
    });
  };

  hideModal = () => this.setState({ modalConfirm: false });
  showModal = () => this.setState({ modalConfirm: true });

  render() {
    if (!this.props.currentUser || !this.props.currentUser.isSuperAdmin) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to signin to create a booking. Just do it!"
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
            visible={modalConfirm}
            onOk={this.upload}
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
