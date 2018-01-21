import React from 'react';
import CreateGatheringForm from '../UIComponents/CreateGatheringForm';
import ModalArticle from '../UIComponents/ModalArticle';

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
    console.log(formValues);
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

    const { modalConfirm, values } = this.state;

    return (
    	<div>
	      <CreateGatheringForm 
	      	values={values}
	      	registerGatheringLocally={this.registerGatheringLocally}
	      	createGathering={this.props.createGathering}
	      />
  	    { modalConfirm 
          ?
            <ModalArticle
              item={this.state.values}
              loading
              title="overview your data"
              visible={modalConfirm}
              onOk={this.createGathering}
              onCancel={this.hideModal}
              okText="Confirm and send as proposal"
              cancelText="Go back and edit"
            />
          : null 
        }
       </div>
    )
  }
}

export default NewGathering;