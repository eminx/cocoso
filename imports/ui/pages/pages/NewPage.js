import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import PageForm from '../../components/PageForm';
import Template from '../../components/Template';
import { message, Alert } from '../../components/message';
import { parseTitle } from '../../@/shared';
import { StateContext } from '../../LayoutContainer';
import { call } from '../../@/shared';

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
    const { currentUser, pageTitles, t } = this.props;
    const { role } = this.context;

    if (!currentUser || role !== 'admin') {
      message.error(t('messages.deny'));
      return false;
    }

    if (
      pageTitles &&
      values &&
      pageTitles.some(
        (title) => title.toLowerCase() === values.title.toLowerCase()
      )
    ) {
      message.error(t('messages.exists'));
      return;
    }

    try {
      const result = await call('createPage', values);
      message.success(t('messages.success.create'));
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
    const { form, pageData, pageTitles, t } = this.props;

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
      callback(t('messages.exists'));
    } else if (value.length < 4) {
      callback(t('form.title.valid'));
    } else {
      callback();
    }
  };

  render() {
    const { currentUser, t } = this.props;
    const { role } = this.context;

    if (!currentUser || role !== 'admin') {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message={t('messages.admin')}
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
      <Template heading={t('labels.create')}>
        <Box bg="white" p="6">
          <PageForm defaultValues={formValues} onSubmit={this.handleSubmit} />
        </Box>
      </Template>
    );
  }
}

NewPage.contextType = StateContext;

export default NewPage;
