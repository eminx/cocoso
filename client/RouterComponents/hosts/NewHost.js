import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Box } from 'grommet';

import Template from '../../UIComponents/Template';
import NewHostForm from '../../UIComponents/NewHostForm';
import { message, Alert } from '../../UIComponents/message';
import Loader from '../../UIComponents/Loader';
import { call, parseTitle } from '../../functions';
import { hostFields } from '../../../lib/constants';
import { StateContext } from '../../LayoutContainer';

const successCreation = () => {
  message.success(
    'Your submission is successfully sent. Please wait until we respond to you. Thank you for your interest!',
    6
  );
};

class NewHost extends PureComponent {
  state = {
    formValues: {
      host: '',
      name: '',
      email: '',
      address: '',
      city: '',
      country: '',
      about: '',
    },
    isLoading: false,
  };

  handleFormChange = (value) => {
    this.setState({
      formValues: value,
    });
  };

  handleSubmit = async () => {
    const { currentUser } = this.context;
    const { formValues } = this.state;

    if (!currentUser.isSuperAdmin) {
      message.error('This is not allowed');
      return;
    }

    this.setState({
      isLoading: true,
    });

    const values = {
      host: formValues.host,
      settings: {
        name: formValues.name,
        email: formValues.email,
        address: formValues.address,
        city: formValues.city,
        country: formValues.country,
      },
    };

    try {
      await call('createNewHost', values, formValues.about);
      successCreation();
    } catch (error) {
      console.log(error);
      message.error(`Error: ${error.reason || error.error}`);
    }
    this.setState({
      isLoading: false,
    });
  };

  render() {
    const { currentUser } = this.context;

    if (!currentUser || !currentUser.isSuperAdmin) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert message="You are not allowed" type="error" />
        </div>
      );
    }

    const { formValues, isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <Template heading="Create a New Page">
        <Box pad="medium" background="white">
          <NewHostForm
            formValues={formValues}
            onFormChange={this.handleFormChange}
            onSubmit={this.handleSubmit}
          />
        </Box>
      </Template>
    );
  }
}

NewHost.contextType = StateContext;

export default NewHost;
