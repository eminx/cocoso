import React from 'react';
import CreateGatheringForm from '../UIComponents/CreateGatheringForm';
import ModalArticle from '../UIComponents/ModalArticle';

class NewGathering extends React.Component {
	state={
		modalConfirm: false,
		values: null,
    isLoading: false,
    isSuccess: false,
    isError: false
	}

	registerGatheringLocally = (values) => {
		this.setState({values: values});
		this.showModal();
	}

	createGathering = () => {
    const formValues = this.state.values;
    console.log(formValues);
    this.setState({isLoading: true});
    Meteor.call('createGathering', Meteor.userId(), formValues, (error, result) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true
        });
        console.log(error);
      } else {
        this.setState({
          isLoading: false,
          isSuccess: true,
          values: null
        });
        console.log(result, 'success');
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