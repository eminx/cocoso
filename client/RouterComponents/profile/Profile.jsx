import React from 'react';
import { Link } from 'react-router-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';
import ReactDropzone from 'react-dropzone';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../../themes/skogen';

import {
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Divider,
  Modal
} from 'antd/lib';
const TextArea = Input.TextArea;
const FormItem = Form.Item;
import NiceList from '../../UIComponents/NiceList';
import Loader from '../../UIComponents/Loader';
import Terms from '../../UIComponents/Terms';

class Profile extends React.Component {
  state = {
    isDeleteModalOn: false,
    isAddWorkModalOn: false,
    workTitle: '',
    workShortDescription: '',
    workDescription: '',
    isUploading: false,
    imageUrl: null,
    myWorks: []
  };

  componentDidMount() {
    Meteor.call('getMyWorks', (error, respond) => {
      if (error) {
        console.log(error);
        message.error(error.reason);
        return;
      }
      this.setState({
        myWorks: respond
      });
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        return;
      }
      const values = {
        firstName: fieldsValue['firstName'],
        lastName: fieldsValue['lastName']
        // bio: fieldsValue['bio']
      };

      Meteor.call('saveUserInfo', values, (error, respond) => {
        if (error) {
          console.log(error);
          message.error(error.reason);
        } else {
          message.success('Your data is successfully saved');
        }
      });
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
    // message.success('Your account is successfully deleted from our database');
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
    const { isUploading, imageUrl } = this.state;
    const { currentUser } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
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

    return (
      <div style={{ padding: 24, minHeight: '80vh' }}>
        <Row gutter={24}>
          <Col md={6}>
            <Blaze template="loginButtons" />
          </Col>
        </Row>
        <Row>
          <Divider />
          <Col md={12}>
            <h2>Personal Info</h2>
            {currentUser && (
              <Form onSubmit={this.handleSubmit}>
                <FormItem>
                  {getFieldDecorator('firstName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter your first name'
                      }
                    ],
                    initialValue: currentUser ? currentUser.firstName : null
                  })(<Input placeholder="first name" />)}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('lastName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter your last name'
                      }
                    ],
                    initialValue: currentUser ? currentUser.lastName : null
                  })(<Input placeholder="last name" />)}
                </FormItem>

                <FormItem
                  wrapperCol={{
                    xs: { span: 24, offset: 0 },
                    sm: { span: 16, offset: 0 }
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </FormItem>
              </Form>
            )}
            <Divider />
          </Col>

          <Col md={2} />

          <Col md={10}>
            <h2 style={{ marginBottom: 24 }}>Works</h2>

            {currentUser && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => this.setState({ isAddWorkModalOn: true })}
                  >
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

            <Divider />

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
          </Col>

          <Col md={4} />
        </Row>

        <Divider />

        <Row>
          <Col md={10}>
            <Terms />
          </Col>
        </Row>

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
      </div>
    );
  }
}

export default Form.create()(Profile);
