import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import React from 'react';
import CreateBookingForm from '../../UIComponents/CreateBookingForm';
import ModalArticle from '../../UIComponents/ModalArticle';
import { Row, Col, message, Alert, Affix, Modal, Button } from 'antd/lib';
import { Redirect } from 'react-router-dom';

const successCreation = () =>
  message.success('Your booking is successfully edited', 6);

const successDelete = () =>
  message.success('The booking is successfully deleted', 4);

const sideNote =
  "Please check if a corresponding time and space is not taken already. \n It is your responsibility to make sure that there's no overlapping bookings.";

class EditBooking extends React.Component {
  state = {
    modalConfirm: false,
    isDeleteModalOn: false,
    values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newBookingId: null,
    uploadedImage: null,
    uploadableImage: null
  };

  registerGatheringLocally = values => {
    values.authorName = this.props.currentUser.username || 'emo';
    this.setState({
      values: values,
      modalConfirm: true
    });
  };

  updateBooking = () => {
    const { values } = this.state;
    const { gatheringData } = this.props;

    Meteor.call(
      'updateBooking',
      values,
      gatheringData._id,
      (error, respond) => {
        if (error) {
          this.setState({
            isLoading: false,
            isError: true
          });
        } else {
          this.setState({
            isLoading: false,
            newBookingId: respond,
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

  deleteBooking = () => {
    const bookingId = this.props.gatheringData._id;

    Meteor.call('deleteBooking', bookingId, (error, respond) => {
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
            message="You have to signin to create a booking."
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
      newBookingId
    } = this.state;

    if (isSuccess && newBookingId) {
      successCreation();
      return <Redirect to={`/booking/${newBookingId}`} />;
    } else if (isSuccess) {
      return <Redirect to="/" />;
    }

    const { gatheringData, currentUser } = this.props;

    return (
      <div style={{ padding: 24 }}>
        <h1>Edit your booking</h1>

        <Row gutter={48}>
          <Col xs={24} sm={24} md={16}>
            {gatheringData &&
              currentUser &&
              gatheringData.authorId === currentUser._id && (
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
            <CreateBookingForm
              values={values}
              bookingData={gatheringData}
              registerGatheringLocally={this.registerGatheringLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={this.state.uploadableImage}
              places={this.props.places}
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Affix offsetTop={50}>
              <Alert message={sideNote} type="warning" showIcon />
            </Affix>
          </Col>
        </Row>
        {modalConfirm && (
          <ModalArticle
            item={values}
            isLoading={isLoading}
            title="Overview The Information"
            visible={modalConfirm}
            onOk={this.updateBooking}
            onCancel={this.hideModal}
            okText="Confirm"
            cancelText="Go back and edit"
          />
        )}

        <Modal
          title="Confirm"
          visible={isDeleteModalOn}
          onOk={this.deleteBooking}
          onCancel={this.hideDeleteModal}
          okText="Yes, delete"
          cancelText="Cancel"
        >
          Are you sure you want to delete this booking?
        </Modal>
      </div>
    );
  }
}

export default EditBooking;
