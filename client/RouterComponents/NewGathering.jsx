import React from 'react';
import CreateGatheringForm from '../UIComponents/CreateGatheringForm';
import ModalArticle from '../UIComponents/ModalArticle';
import { Redirect } from 'react-router-dom'
import Evaporate from 'evaporate';
import AWS from 'aws-sdk';

class NewGathering extends React.Component {
	state={
		modalConfirm: false,
		values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newGatheringId: null
	}

	registerGatheringLocally = (values) => {
		this.setState({values: values});
		this.showModal();
	}

  registerImage = (e) => {
    this.setState({
      uploadableImage: e.file.originFileObj
    })
  }

  uploadImage = () => {
    const { newGatheringId, uploadableImage } = this.state;

    const currentUserId = Meteor.userId();
    const upload = new Slingshot.Upload("gatheringImageUpload");
    const timeStamp = Math.floor(Date.now());
    
    upload.send(uploadableImage, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        Meteor.call('addGatheringImageInfo', newGatheringId, downloadUrl, timeStamp, currentUserId, (err, res) => {
          if (err) {
            alert(err);
          } else {
            this.setState({
              isLoading: false,
              isSuccess: true
            })
          }
        });
      }
    });
  }

	createGathering = () => {
    const formValues = this.state.values;
    this.setState({isLoading: true});
    Meteor.call('createGathering', Meteor.userId(), formValues, (error, result) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          // isLoading: false,
          newGatheringId: result
        });
        this.uploadImage();
      }
    });
  }

  hideModal = () => this.setState({modalConfirm: false})
  showModal = () => this.setState({modalConfirm: true})
 
  render() {

    const { modalConfirm, values, isLoading, isSuccess, newGatheringId } = this.state;

    if (isSuccess) {
      return <Redirect to={`/gathering/${newGatheringId}`} />
    }

    return (
    	<div>
	      <CreateGatheringForm 
	      	values={values}
	      	registerGatheringLocally={this.registerGatheringLocally}
          uploadImage={this.registerImage}
	      />
  	    { modalConfirm 
          ?
            <ModalArticle
              item={this.state.values}
              isLoading={isLoading}
              title="Overview The Information"
              visible={modalConfirm}
              onOk={this.createGathering}
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

export default NewGathering;