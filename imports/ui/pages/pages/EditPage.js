import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Flex } from '@chakra-ui/react';

import PageForm from '../../components/PageForm';
import Template from '../../components/Template';
import { parseTitle } from '../../@/shared';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';
import { message, Alert } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import { call } from '../../@/shared'

class EditPage extends PureComponent {
  state = {
    isSuccess: false,
    isError: false,
    isDeleteModalOn: false,
  };

  handleSubmit = async (values) => {
    const { currentUser, pageData, pageTitles, t } = this.props;
    const { role } = this.context;

    if (!currentUser || role !== 'admin') {
      message.error(t('messages.deny'));
      return false;
    }

    if (
      pageTitles &&
      values &&
      pageTitles
        .filter((title) => title !== pageData.title)
        .some((title) => title.toLowerCase() === values.title.toLowerCase())
    ) {
      message.error(t('messages.exists'));
      return;
    }

    try {
      const result = await call('updatePage', pageData._id, values);
      message.success(t('messages.success.update'));
      this.setState({
        newPageTitle: parseTitle(result),
        isSuccess: true,
      });
    } catch (error) {
      console.log('error', error);
      this.setState({
        isError: true,
      });
    }
  };

  handleDeletePage = async () => {
    const { currentUser, pageData, t } = this.props;
    const { role } = this.context;

    if (!currentUser || role !== 'admin') {
      message.error(t('messages.deny'));
      return false;
    }

    try {
      await call('deletePage', pageData._id);
      message.success(t('messages.success.remove'));
      this.setState({
        newPageTitle: 'deleted',
        isSuccess: true,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        isError: true,
      });
    }
  };

  closeDeleteModal = () => this.setState({ isDeleteModalOn: false });
  openDeleteModal = () => this.setState({ isDeleteModalOn: true });

  render() {
    const { currentUser, isLoading, pageData, t } = this.props;
    const { currentHost, role } = this.context;

    if (!currentUser || role !== 'admin') {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert message={t('messages.deny')} type="error" />
        </div>
      );
    }

    const { isSuccess, newPageTitle, isDeleteModalOn } = this.state;

    if (!pageData || isLoading) {
      return <Loader />;
    }

    if (isSuccess) {
      if (newPageTitle === 'deleted') {
        return <Redirect to={`/page/about-${parseTitle(currentHost.name)}`} />;
      } else {
        return <Redirect to={`/page/${parseTitle(newPageTitle)}`} />;
      }
    }

    return (
      <Template
        heading={t('labels.update')}
        leftContent={
          <Link to={`/page/${pageData.title}`}>
            <Button
              variant="link"
              size="sm"
            >{t('actions.backTo')}{` ${pageData.title}`}</Button>
          </Link>
        }
      >
        <Box bg="white" p="6">
          <PageForm defaultValues={pageData} onSubmit={this.handleSubmit} />

          <Flex justify="center" py="4">
            <Button
              colorScheme="red"
              size="sm"
              variant="ghost"
              onClick={this.openDeleteModal}
            >
              {t('actions.delete')}
            </Button>
          </Flex>
        </Box>

        <ConfirmModal
          visible={isDeleteModalOn}
          onConfirm={this.handleDeletePage}
          onCancel={this.closeDeleteModal}
          title={t('modal.title')}
        >
          {t('modal.body')}
        </ConfirmModal>
      </Template>
    );
  }
}

EditPage.contextType = StateContext;

export default EditPage