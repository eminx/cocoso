import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';
import ReactDropzone from 'react-dropzone';
import ReactQuill from 'react-quill';
import { Input, Button, message, Divider, Modal } from 'antd/lib';
const TextArea = Input.TextArea;

import { Text, Box } from 'grommet';

import Personal from './Personal';
import { editorFormats, editorModules } from '../../constants/quillConfig';
import ListMenu from '../../UIComponents/ListMenu';
import NiceList from '../../UIComponents/NiceList';
import Loader from '../../UIComponents/Loader';
import Terms from '../../UIComponents/Terms';
import Template from '../../UIComponents/Template';

const personalModel = {
  firstName: '',
  lastName: '',
  bio: '',
  city: ''
  // country: ''
};

const menuRoutes = [
  { label: 'Profile', value: '/my-profile' },
  { label: 'Works', value: 'my-works' }
];

class Profile extends React.Component {
  state = {
    isDeleteModalOn: false,
    isAddWorkModalOn: false,
    workTitle: '',
    workShortDescription: '',
    workDescription: '',
    isUploading: false,
    imageUrl: null,
    myWorks: [],
    personal: personalModel,
    bio: ''
  };

  componentDidMount() {
    // this.getMyWorks();
    this.setInitialPersonalInfo();
  }

  setInitialPersonalInfo = () => {
    const { currentUser } = this.props;
    if (!currentUser) {
      return;
    }
    this.setState({
      personal: {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || ''
      },
      bio: currentUser.bio || ''
    });
  };

  getMyWorks = () => {
    Meteor.call('getMyWorks', (error, respond) => {
      if (error) {
        console.log(error);
        // message.error(error.reason);
        return;
      }
      this.setState({
        myWorks: respond
      });
    });
  };

  handleFormChange = formValues => {
    this.setState({
      personal: formValues
    });
  };

  handleQuillChange = bio => {
    this.setState({
      bio
    });
  };

  handleSubmit = () => {
    const { personal, bio } = this.state;
    this.setState({
      isSaving: true
    });

    const values = {
      ...personal,
      bio
    };
    console.log(values);
    Meteor.call('saveUserInfo', values, (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
      } else {
        message.success('Your data is successfully saved');
        this.setState({
          isSaving: false
        });
      }
    });
  };

  deleteAccount = () => {
    Meteor.call('deleteAccount', (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
        return;
      }
    });
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  handleWorkTitleChange = event => {
    this.setState({ workTitle: event.target.value });
  };

  handleWorkShortDescriptionChange = event => {
    this.setState({ workShortDescription: event.target.value });
  };

  handleWorkDescriptionChange = value => {
    this.setState({ workDescription: value });
  };

  createWork = () => {
    const { workTitle, workDescription, imageUrl } = this.state;
    const newWork = {
      title: workTitle,
      description: workDescription,
      imageUrl
    };
    Meteor.call('createWork', newWork, (error, response) => {
      if (error) {
        message.error('Could not create work due to ', error.error);
      }
      console.log(response);
      message.success('You work is successfully created');
      this.setState({
        isAddWorkModalOn: false
      });
    });
  };

  removeWork = workId => {
    console.log(workId);
  };

  handleFileDrop = files => {
    if (files.length !== 1) {
      message.error('Please drop only one file at a time.');
      return;
    }

    this.setState({ isUploading: true });
    const closeLoader = () => this.setState({ isUploading: false });

    const upload = new Slingshot.Upload('groupImageUpload');
    files.forEach(file => {
      const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
      const uploadableFile = new File([file], parsedName, {
        type: file.type
      });
      upload.send(uploadableFile, (error, downloadUrl) => {
        if (error) {
          console.error('Error uploading:', error);
          message.error(error.reason);
          closeLoader();
          return;
        } else {
          this.setState({
            imageUrl: downloadUrl
          });
          closeLoader();
        }
      });
    });
  };

  render() {
    const { currentUser, history } = this.props;
    const {
      personal,
      bio,
      isUploading,
      imageUrl,
      isDeleteModalOn,
      isAddWorkModalOn,
      workTitle,
      workShortDescription,
      workDescription,
      myWorks
    } = this.state;

    const myWorksWithActions = myWorks.map(work => ({
      ...work,
      actions: [
        {
          content: 'Remove',
          handleClick: () => this.removeWork(work._id)
        }
      ]
    }));

    const formItemStyle = {
      marginBottom: 24
    };

    const pathname = history && history.location.pathname;

    return (
      <Template
        heading="Edit Personal Information"
        leftContent={
          <Fragment>
            <ListMenu list={menuRoutes}>
              {datum => (
                <Link to={datum.value} key={datum.value}>
                  <Text weight={pathname === datum.value ? 'bold' : 'normal'}>
                    {datum.label}
                  </Text>
                </Link>
              )}
            </ListMenu>
            {currentUser && (
              <Box pad="medium">
                <Blaze template="loginButtons" />
              </Box>
            )}
          </Fragment>
        }
      >
        {currentUser ? (
          <Personal
            formValues={personal}
            bio={bio}
            onQuillChange={this.handleQuillChange}
            onFormChange={this.handleFormChange}
            onSubmit={this.handleSubmit}
          />
        ) : (
          <Box pad="medium">
            <Blaze template="loginButtons" />
          </Box>
        )}

        {currentUser && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => this.setState({ isAddWorkModalOn: true })}>
                Add work
              </Button>
            </div>

            {myWorksWithActions && (
              <NiceList list={myWorksWithActions}>
                {work => (
                  <div key={work.title}>
                    <h3>
                      <Link to={`/work/${work._id}`}>{work.title}</Link>
                    </h3>
                    <em
                      dangerouslySetInnerHTML={{
                        __html: work.shortDescription
                      }}
                    />
                  </div>
                )}
              </NiceList>
            )}
          </div>
        )}

        {currentUser && (
          <div>
            <Button
              onClick={() => this.setState({ isDeleteModalOn: true })}
              style={{ color: 'red' }}
            >
              Delete Account
            </Button>
            <Divider />
          </div>
        )}

        <Modal
          title="Are you sure?"
          okText="Confirm Deletion"
          onOk={this.deleteAccount}
          onCancel={() => this.setState({ isDeleteModalOn: false })}
          visible={isDeleteModalOn}
        >
          <p>
            You are about to permanently delete your user information. This is
            an irreversible action.
          </p>
        </Modal>

        <Modal
          title="Create New Work"
          okText="Create"
          onOk={this.createWork}
          onCancel={() => this.setState({ isAddWorkModalOn: false })}
          visible={isAddWorkModalOn}
        >
          {imageUrl && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 24
              }}
            >
              <img src={imageUrl} height="100px" />}
            </div>
          )}

          <Input
            placeholder="Title"
            value={workTitle}
            onChange={this.handleWorkTitleChange}
            style={formItemStyle}
          />

          <TextArea
            placeholder="Short description"
            value={workShortDescription}
            onChange={this.handleWorkShortDescriptionChange}
            style={formItemStyle}
          />

          <ReactDropzone onDrop={this.handleFileDrop} multiple={false}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                style={{
                  width: '100%',
                  height: 100,
                  background: isDragActive ? '#ea3924' : '#fff5f4cc',
                  padding: 24,
                  marginBottom: 24,
                  border: '1px dashed #ea3924',
                  textAlign: 'center'
                }}
              >
                {isUploading ? (
                  <div>
                    <Loader />
                    uploading
                  </div>
                ) : (
                  <div>
                    <b>Drop image to upload</b>
                  </div>
                )}
                <input {...getInputProps()} />
              </div>
            )}
          </ReactDropzone>

          <ReactQuill
            modules={editorModules}
            formats={editorFormats}
            value={workDescription}
            onChange={this.handleWorkDescriptionChange}
            placeholder="description"
            style={{ minHeight: 120 }}
          />
        </Modal>
      </Template>
    );
  }
}

export default Profile;

const SimpleMenu = ({ items, children }) => {
  {
    items.map((item, index) => {
      return children(item, index);
    });
  }
};
