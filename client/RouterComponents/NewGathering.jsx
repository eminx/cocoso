import React from 'react';
import CreateGatheringForm from '../UIComponents/CreateGatheringForm';
import { Modal } from 'antd';

class NewGathering extends React.Component {
	state={
		modalConfirm: false,
		values: null
	}

	registerGatheringLocally = (values) => {
		this.setState({values: values});
		this.showModal();
	}

	createGathering = () => {
    const formValues = this.state.values;
    Meteor.call('createGathering', Meteor.userId(), formValues, (error, result) => {    
      if (error) {
        console.log(error);
      } else {
        console.log(result, 'success');
        this.hideModal();
      }
    });
  }

  hideModal = () => this.setState({modalConfirm: false})
  showModal = () => this.setState({modalConfirm: true})
 
  render() {
    return (
    	<div>
	      <CreateGatheringForm 
	      	values={this.state.values}
	      	registerGatheringLocally={this.registerGatheringLocally}
	      	createGathering={this.props.createGathering}
	      />
	      <Modal
          title="overview your data"
          visible={this.state.modalConfirm}
          onOk={this.createGathering}
          onCancel={this.hideModal}
          okText="Confirm and send as proposal"
          cancelText="Go back and edit"
        >
          Your gathering is almost there. Please overview it before sending in for confirmation.
        </Modal>
       </div>
    )
  }
}

export default NewGathering;