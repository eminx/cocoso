import React from 'react';
import { Redirect } from 'react-router-dom';

import PageForm from '../../UIComponents/PageForm';
import Template from '../../UIComponents/Template';
import { message, Alert } from '../../UIComponents/message';
import { parseTitle } from '../../functions';

const successCreation = () => {
  message.success('New page is successfully created', 6);
};

class NewPage extends React.Component {
  state = {
    formValues: {
      title: '',
      longDescription: ''
    },
    isLoading: false,
    isSuccess: false,
    isError: false,
    newPageId: null
  };

  handleFormChange = value => {
    const { formValues } = this.state;
    const newFormValues = {
      ...value,
      longDescription: formValues.longDescription
    };

    this.setState({
      formValues: newFormValues
    });
  };

  handleQuillChange = longDescription => {
    const { formValues } = this.state;
    const newFormValues = {
      ...formValues,
      longDescription
    };

    this.setState({
      formValues: newFormValues
    });
  };

  handleSubmit = () => {
    const { currentUser } = this.props;
    if (!currentUser || !currentUser.isSuperAdmin) {
      message.error('This is not allowed');
      return false;
    }
    const { formValues } = this.state;

    console.log(formValues);

    Meteor.call('createPage', formValues, (error, result) => {
      if (error) {
        console.log('error', error);
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          isLoading: false,
          newPageId: parseTitle(result),
          isSuccess: true
        });
      }
    });
  };

  validateTitle = (rule, value, callback) => {
    const { form, pageData, pageTitles } = this.props;

    let pageExists = false;
    if (
      pageTitles &&
      value &&
      pageTitles.some(title => title.toLowerCase() === value.toLowerCase()) &&
        pageData.title.toLowerCase() !== value.toLowerCase()
    ) {
      pageExists = true;
    }

    if (pageExists) {
      callback('A page with this title already exists');
    } else if (value.length < 4) {
      callback('Title has to be at least 4 characters');
    } else {
      callback();
    }
  };

  render() {
    const { currentUser, pageTitles } = this.props;

    if (!currentUser || !currentUser.isSuperAdmin) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to be super admin to create a static page."
            type="error"
          />
        </div>
      );
    }

    const { formValues, isLoading, isSuccess, newPageId } = this.state;

    if (isSuccess && newPageId) {
      successCreation();
      return <Redirect to={`/page/${newPageId}`} />;
    }

    return (
      <Template heading="Create a New Page">
        <PageForm
          formValues={formValues}
          onFormChange={this.handleFormChange}
          onQuillChange={this.handleQuillChange}
          onSubmit={this.handleSubmit}
        />
      </Template>
    );
  }
}

export default NewPage;
