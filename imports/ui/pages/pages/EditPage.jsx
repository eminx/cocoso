import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Box, Button, Flex } from '@chakra-ui/react';

import PageForm from '../../components/PageForm';
import { parseTitle, call } from '../../utils/shared';
import Loader from '../../components/Loader';
import ConfirmModal from '../../components/ConfirmModal';
import Breadcrumb from '../../components/Breadcrumb';
import { message, Alert } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import Template from '../../components/Template';

class EditPage extends PureComponent {
  state = {
    isSuccess: false,
    isError: false,
    isDeleteModalOn: false,
  };

  handleSubmit = async (values) => {
    const { currentUser, pageData, pageTitles, tc } = this.props;
    const { role } = this.context;

    if (!currentUser || role !== 'admin') {
      message.error(tc('message.access.deny'));
      return false;
    }

    if (
      pageTitles &&
      values &&
      pageTitles
        .filter((title) => title !== pageData.title)
        .some((title) => title.toLowerCase() === values.title.toLowerCase())
    ) {
      message.error(
        tc('message.exists', {
          domain: tc('domains.page').toLowerCase(),
          property: tc('domains.props.title'),
        })
      );
      return;
    }

    try {
      const result = await call('updatePage', pageData._id, values);
      message.success(
        tc('message.success.update', {
          domain: `${tc('domains.your')} ${tc('domains.page').toLowerCase()}`,
        })
      );
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
    const { currentUser, pageData, tc } = this.props;
    const { role } = this.context;

    if (!currentUser || role !== 'admin') {
      message.error(tc('message.access.deny'));
      return false;
    }

    try {
      await call('deletePage', pageData._id);
      message.success(
        tc('message.success.remove', {
          domain: `${tc('domains.your')} ${tc('domains.page').toLowerCase()}`,
        })
      );
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
    const { currentUser, isLoading, pageData, pageTitles, t, tc } = this.props;
    const { currentHost, role } = this.context;

    if (!currentUser || role !== 'admin') {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert message={tc('message.access.deny')} type="error" />
        </div>
      );
    }

    const { isSuccess, newPageTitle, isDeleteModalOn } = this.state;

    if (!pageData || isLoading) {
      return <Loader />;
    }

    if (isSuccess) {
      if (newPageTitle === 'deleted') {
        const pageUrl = parseTitle(pageTitles[0]);
        return <Redirect to={`/pages/${pageUrl}`} />;
      }
      return <Redirect to={`/pages/${parseTitle(newPageTitle)}`} />;
    }

    const { menu } = currentHost?.settings;
    const navItem = menu.find((item) => item.name === 'info');

    const furtherItems = [
      { label: navItem.label, link: '/pages' },
      { label: pageData.title, link: `/pages/${parseTitle(pageData.title)}` },
      { label: tc('actions.update') },
    ];

    return (
      <Box>
        <Breadcrumb furtherItems={furtherItems} />
        <Template>
          <Box p="6">
            <PageForm defaultValues={pageData} onSubmit={this.handleSubmit} />

            <Flex justify="center" py="4">
              <Button colorScheme="red" size="sm" variant="ghost" onClick={this.openDeleteModal}>
                {t('pages.actions.delete')}
              </Button>
            </Flex>
          </Box>

          <ConfirmModal
            visible={isDeleteModalOn}
            onConfirm={this.handleDeletePage}
            onCancel={this.closeDeleteModal}
            title={tc('modal.confirm.delete.title')}
          >
            {tc('modals.confirm.delete.body', {
              domain: tc('domains.page').toLowerCase(),
            })}
          </ConfirmModal>
        </Template>
      </Box>
    );
  }
}

EditPage.contextType = StateContext;

export default EditPage;
