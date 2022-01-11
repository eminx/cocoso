import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import PageForm from '../../components/PageForm';
import Template from '../../components/Template';
import { message, Alert } from '../../components/message';
import { parseTitle } from '../../functions';
import { StateContext } from '../../LayoutContainer';
import { call } from '../../functions';

class NewPage extends PureComponent {
  state = {
    formValues: {
      title: '',
      longDescription: '',
    },
    isSuccess: false,
    isError: false,
    newPageId: null,
  };

  handleSubmit = async (values) => {
    const { currentUser, pageTitles } = this.props;
    const { role } = this.context;

    if (!currentUser || role !== 'admin') {
      message.error('This is not allowed');
      return false;
    }

    if (
      pageTitles &&
      values &&
      pageTitles.some(
        (title) => title.toLowerCase() === values.title.toLowerCase()
      )
    ) {
      message.error('A page with this title already exists');
      return;
    }

    try {
      const result = await call('createPage', values);
      message.success('New page successfully created');
      this.setState({
        newPageId: parseTitle(result),
        isSuccess: true,
      });
    } catch (error) {
      console.log('error', error);
      this.setState({
        isError: true,
      });
    }
  };

  validateTitle = (rule, value, callback) => {
    const { form, pageData, pageTitles } = this.props;

    let pageExists = false;
    if (
      pageTitles &&
      value &&
      pageTitles.some((title) => title.toLowerCase() === value.toLowerCase()) &&
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
    const { currentUser } = this.props;
    const { role } = this.context;

    if (!currentUser || role !== 'admin') {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to be super admin to create a static page."
            type="error"
          />
        </div>
      );
    }

    const { formValues, isSuccess, newPageId } = this.state;

    if (isSuccess && newPageId) {
      return <Redirect to={`/page/${newPageId}`} />;
    }

    return (
      <Template heading="Create a New Page">
        <Box bg="white" p="6">
          <PageForm defaultValues={formValues} onSubmit={this.handleSubmit} />
        </Box>
      </Template>
    );
  }
}

NewPage.contextType = StateContext;

export default NewPage;
