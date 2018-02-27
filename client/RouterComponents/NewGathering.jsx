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
		this.setState({
      values: values, 
      modalConfirm: true
    });
    // this.uploadImage();
	}

  setUploadableImage = (e) => {
    const theImageFile = e.file.originFileObj;
    const reader  = new FileReader();
    reader.readAsDataURL(theImageFile);
    reader.addEventListener("load", () => {
      this.setState({
        uploadableImage: theImageFile,
        uploadableImageLocal: reader.result
      })
    }, false);
  }

  uploadImage = () => {
    const { uploadableImage } = this.state;

    const upload = new Slingshot.Upload("gatheringImageUpload");
    const timeStamp = Math.floor(Date.now());
    
    upload.send(uploadableImage, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState({
          uploadedImage: downloadUrl
        });
        this.createGathering(downloadUrl);
        console.log("downloadUrl", downloadUrl);
        // Meteor.call('addGatheringImageInfo', newGatheringId, downloadUrl, timeStamp, currentUserId, (err, res) => {
        //   if (err) {
        //     alert(err);
        //   } else {
        //     this.setState({
        //       isLoading: false,
        //       uploadedImage: downloadUrl
        //     })
        //   }
        // });
      }
    });
  }

	createGathering = (uploadedImage) => {
    this.setState({isLoading: true});
    const { values } = this.state;

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
          isSuccess: true
        });
      }
    });
  }

  hideModal = () => this.setState({modalConfirm: false})
  showModal = () => this.setState({modalConfirm: true})
 
  render() {

    const { modalConfirm, values, isLoading, isSuccess, newGatheringId, uploadedImage, uploadableImage, uploadableImageLocal } = this.state;

    if (isSuccess) {
      return <Redirect to={`/gathering/${newGatheringId}`} />
    }

    return (
    	<div>
	      <CreateGatheringForm
	      	values={values}
	      	registerGatheringLocally={this.registerGatheringLocally}
          setUploadableImage={this.setUploadableImage}
          uploadableImage={this.state.uploadableImage}
	      />
  	    { modalConfirm
          ?
            <ModalArticle
              imageSrc={uploadableImageLocal}
              item={values}
              isLoading={isLoading}
              title="Overview The Information"
              visible={modalConfirm}
              onOk={this.uploadImage}
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