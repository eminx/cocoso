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
    newGatheringId: null,
    uploadedImage: null,
    uploadableImage: null
	}

	registerGatheringLocally = (values) => {
		this.setState({values: values});
		this.showModal();
	}

  registerImage = (e) => {
    this.setState({
      uploadableImage: e.file.originFileObj
    });
  }

  uploadImage = (e) => {
    const { newGatheringId, uploadableImage } = this.state;

    const currentUserId = Meteor.userId();
    const upload = new Slingshot.Upload("gatheringImageUpload");
    const timeStamp = Math.floor(Date.now());
    
    upload.send(e.file.originFileObj, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        console.log("downloadUrl", downloadUrl);
        Meteor.call('addGatheringImageInfo', newGatheringId, downloadUrl, timeStamp, currentUserId, (err, res) => {
          if (err) {
            alert(err);
          } else {
            this.setState({
              isLoading: false,
              isSuccess: true,
              uploadedImage: downloadUrl
            })
          }
        });
      }
    });
  }

	createGathering = () => {
    const { values, uploadedImage } = this.state;
    this.setState({isLoading: true});
    Meteor.call('createGathering', values, uploadedImage, (error, result) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          isLoading: false,
          newGatheringId: result,
        });
      }
    });
  }

  hideModal = () => this.setState({modalConfirm: false})
  showModal = () => this.setState({modalConfirm: true})
 
  render() {

    const { modalConfirm, values, isLoading, isSuccess, newGatheringId, uploadedImage } = this.state;

    if (newGatheringId) {
      return <Redirect to={`/gathering/${newGatheringId}`} />
    }

    return (
    	<div>
	      <CreateGatheringForm
	      	values={values}
	      	registerGatheringLocally={this.registerGatheringLocally}
          uploadImage={this.uploadImage}
          isImageUploaded={this.state.uploadedImage}
	      />
  	    { modalConfirm
          ?
            <ModalArticle
              imageSrc={uploadedImage}
              item={values}
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