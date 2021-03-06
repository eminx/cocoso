import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button } from 'grommet';

import PageForm from '../../UIComponents/PageForm';
import Template from '../../UIComponents/Template';
import { parseTitle } from '../../functions';
import Loader from '../../UIComponents/Loader';
import ConfirmModal from '../../UIComponents/ConfirmModal';
import { message, Alert } from '../../UIComponents/message';
import { StateContext } from '../../LayoutContainer';

const successCreation = () => {
  message.success('The page is successfully updated', 6);
};

class EditPage extends React.Component {
  state = {
    formValues: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isDeleteModalOn: false,
  };

  componentDidMount() {
    if (this.props.pageData) {
      this.setFormValues();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.pageData && this.props.pageData) {
      this.setFormValues();
    }
  }

  setFormValues = () => {
    const { pageData } = this.props;

    if (!pageData || !pageData.title || !pageData.longDescription) {
      return;
    }
    this.setState({
      formValues: {
        title: pageData.title,
        longDescription: pageData.longDescription,
      },
    });
  };

  handleFormChange = (value) => {
    const { formValues } = this.state;
    const newFormValues = {
      ...value,
      longDescription: formValues.longDescription,
    };

    this.setState({
      formValues: newFormValues,
    });
  };

  handleQuillChange = (longDescription) => {
    const { formValues } = this.state;
    const newFormValues = {
      ...formValues,
      longDescription,
    };

    this.setState({
      formValues: newFormValues,
    });
  };

  handleSubmit = () => {
    const { formValues } = this.state;
    const { currentUser, pageData } = this.props;
    const { role } = this.context;

    if (!currentUser || role !== 'admin') {
      message.error('You are not allowed');
      return false;
    }

    Meteor.call('updatePage', pageData._id, formValues, (error, respond) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true,
        });
      } else {
        this.setState({
          isLoading: false,
          newPageTitle: parseTitle(respond),
          isSuccess: true,
        });
      }
    });
  };

  handleDeletePage = () => {
    const { currentUser, pageData } = this.props;
    const { role } = this.context;

    if (!currentUser || role !== 'admin') {
      message.error('You are not allowed');
      return false;
    }

    this.setState({ isLoading: true });

    Meteor.call('deletePage', pageData._id, (error, respond) => {
      if (error) {
        this.setState({
          isLoading: false,
          isError: true,
        });
      } else {
        this.setState({
          isLoading: false,
          newPageTitle: 'deleted',
          isSuccess: true,
        });
      }
    });
  };

  closeDeleteModal = () => this.setState({ isDeleteModalOn: false });
  openDeleteModal = () => this.setState({ isDeleteModalOn: true });

  render() {
    const { pageData, pageTitles, currentUser } = this.props;
    const { currentHost, role } = this.context;

    if (!currentUser || role !== 'admin') {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert message="You are not allowed." type="error" />
        </div>
      );
    }

    const {
      formValues,
      isLoading,
      isSuccess,
      newPageTitle,
      isDeleteModalOn,
    } = this.state;

    if (!pageData || !formValues) {
      return <Loader />;
    }

    if (isSuccess) {
      successCreation();
      if (newPageTitle === 'deleted') {
        return <Redirect to={`/page/about-${parseTitle(currentHost.name)}`} />;
      } else {
        return <Redirect to={`/page/${parseTitle(newPageTitle)}`} />;
      }
    }

    return (
      <Template
        heading="Edit this Page"
        leftContent={
          <Link to={`/page/${pageData.title}`}>
            <Button
              plain
              size="small"
              // icon="arrow-left"
              label={`back to ${pageData.title}`}
            />
          </Link>
        }
      >
        <Box background="white" pad="medium">
          <PageForm
            formValues={formValues}
            onFormChange={this.handleFormChange}
            onQuillChange={this.handleQuillChange}
            onSubmit={this.handleSubmit}
          />

          <Box direction="row" justify="center" pad="medium">
            <Button
              plain
              color="status-critical"
              onClick={this.openDeleteModal}
              label="Delete this page"
            />
          </Box>

          <ConfirmModal
            visible={isDeleteModalOn}
            onConfirm={this.handleDeletePage}
            onCancel={this.closeDeleteModal}
            title="Confirm Delete"
          >
            Are you sure you want to delete this page?
          </ConfirmModal>
        </Box>
      </Template>
    );
  }
}

EditPage.contextType = StateContext;

export default EditPage;
