import { Meteor } from 'meteor/meteor';
import React from 'react';
import CreateBookingForm from '../UIComponents/CreateBookingForm';
import ModalArticle from '../UIComponents/ModalArticle';
import { Row, Col, message, Alert, Affix } from 'antd/lib';
import { Redirect } from 'react-router-dom'
import Evaporate from 'evaporate';
import AWS from 'aws-sdk';

const successCreation = () => {
  message.success('Your booking is successfully edited', 6);
};

const sideNote = "Please check if a corresponding time and space is not taken already. \n It is your responsibility to make sure that there's no overlapping bookings."

class EditBooking extends React.Component {
	state={
		modalConfirm: false,
		values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newBookingId: null,
    uploadedImage: null,
    uploadableImage: null
	}

	registerGatheringLocally = (values) => {
    values.authorName = this.props.currentUser.username || 'emo';
		this.setState({
      values: values, 
      modalConfirm: true
    });
	}

	updateBooking = () => {
    const { values } = this.state;
    const { gatheringData } = this.props;

    Meteor.call('updateBooking', values, gatheringData._id, (error, result) => {
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
  }

  hideModal = () => this.setState({modalConfirm: false})
  showModal = () => this.setState({modalConfirm: true})
 
  render() {

    if (!this.props.currentUser) {
      return (
        <div style={{maxWidth: 600, margin: '0 auto'}}>
          <Alert
            message="You have to signin to create a booking. Just do it!"
            type="error"
          />
        </div>
      )
    }

    const { modalConfirm, values, isLoading, isSuccess, newBookingId, uploadedImage, uploadableImage, uploadableImageLocal } = this.state;

    if (isSuccess) {
      successCreation();
      return <Redirect to={`/booking/${newBookingId}`} />
    }

    const { gatheringData } = this.props;

    return (
    	<div style={{padding: 24}}>
        <h1>Edit your booking</h1>
        <Row gutter={48}>
          <Col xs={24} sm={24} md={16}>
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
              <Alert
                message={sideNote}
                type="warning"
                showIcon
              />
            </Affix>
          </Col>
        </Row>
  	    { modalConfirm
          ?
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
          : null
        }

       </div>
    )
  }
}

export default EditBooking;