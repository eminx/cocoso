import React from 'react';
import CreateGatheringForm from '../UIComponents/CreateGatheringForm';
import ModalArticle from '../UIComponents/ModalArticle';
import { Redirect } from 'react-router-dom'
import Evaporate from 'evaporate';
import crypto from 'crypto-js';

// const AWS_KEY = Meteor.settings.private.s3.AWSAccessKeyId;
// const bucket = Meteor.settings.private.s3.AWSAccessKeyId;

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

  uploadImage = (e) => {
    const config = {
      signerUrl: '',
      aws_key: '',
      bucket: '',
      cloudfront: true,
      computeContentMd5: true,
      cryptoMd5Method: (data) => (
        crypto.createHash('md5').update(data).digest('base64')
      )
    };

    console.log(e);
    // first you create, then 'add'/upload
    Evaporate.create(config)
    .then(evaporate =>
      evaporate.add({
        name: this.state.values.title,
        file: e,
        progress: (progress) => {
          console.log(progress);
        }
      })
    )
    .then(s3Key => console.log('file location: ', s3Key))
    .catch(err => console.log('error', err));
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
          isLoading: false,
          isSuccess: true,
          newGatheringId: result
        });
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
	      	createGathering={this.props.createGathering}
          uploadImage={this.uploadImage}
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