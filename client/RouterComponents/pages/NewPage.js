import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, message, Alert } from 'antd/lib';
import { Heading } from 'grommet';

import CreatePageForm from '../../UIComponents/CreatePageForm';
import PagesList from '../../UIComponents/PagesList';

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
      (pageTitles.some(title => title.toLowerCase() === value.toLowerCase()) &&
        pageData.title.toLowerCase() !== value.toLowerCase())
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
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col md={7}>
            <PagesList
              pageTitles={pageTitles}
              activePageTitle={''}
              onChange={this.handlePageClick}
            />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Heading level={3}>Create a New Page</Heading>
            <CreatePageForm
              formValues={formValues}
              onFormChange={this.handleFormChange}
              onQuillChange={this.handleQuillChange}
              onSubmit={this.handleSubmit}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewPage;
