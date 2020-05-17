import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Alert } from 'antd/lib';

import { UserContext } from '../../LayoutContainer';
import WorkForm from '../../UIComponents/WorkForm';
import Template from '../../UIComponents/Template';
import { parseTitle, call, resizeImage, uploadImage } from '../../functions';

const successCreation = () => {
  message.success('New work is successfully created', 6);
};

class NewWork extends React.Component {
  state = {
    formValues: {
      title: '',
      shortDescription: '',
      longDescription: ''
    },
    uploadedImages: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    newWorkId: null
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

  handleFileDrop = files => {
    this.setState({ isUploading: true });
    files.forEach((file, index) => {
      const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
      resizeImage(file, 600, uri => {
        const uploadableImage = dataURLtoFile(uri, parsedName);
        uploadImage(uploadableImage, 'workImageUpload', (error, respond) => {
          if (error) {
            console.log('error!', error);
            errorDialog(error.reason);
            return;
          }
          this.setState(({ uploadedImages }) => ({
            uploadedImages: [
              ...uploadedImages,
              {
                url: respond,
                name: parsedName
              }
            ]
          }));
        });
      });
      if (files.length === index + 1) {
        this.createWork();
      }
    });
  };

  createWork = async () => {
    const { formValues, images } = this.state;
    try {
      const respond = await call('createWork', formValues, images);
      this.setState({ newWorkId: respond });
      message.success('You work is successfully created');
      this.setState({ isUploading: false });
    } catch (error) {
      message.error('Could not create work due to ', error.error);
      this.setState({ isUploading: false });
    }
  };

  removeWork = workId => {
    console.log(workId);
  };

  handleSubmit = () => {
    const { currentUser } = this.context;
    if (!currentUser || !currentUser.isSuperAdmin) {
      message.error('This is not allowed');
      return false;
    }
    const { formValues } = this.state;

    console.log(formValues);

    Meteor.call('createWork', formValues, (error, result) => {
      if (error) {
        console.log('error', error);
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          isLoading: false,
          newWorkId: parseTitle(result),
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
    const { currentUser } = this.context;

    if (!currentUser) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to create an account to create work"
            type="error"
          />
        </div>
      );
    }

    const { formValues, isLoading, isSuccess, newWorkId } = this.state;

    if (isSuccess && newWorkId) {
      successCreation();
      return <Redirect to={`/work/${newWorkId}`} />;
    }

    return (
      <Template heading="Create New Work">
        <WorkForm
          formValues={formValues}
          onFormChange={this.handleFormChange}
          onQuillChange={this.handleQuillChange}
          onSubmit={this.handleSubmit}
        />
      </Template>
    );
  }
}

NewWork.contextType = UserContext;

export default NewWork;
