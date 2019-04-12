import React from 'react';
import { Link } from 'react-router-dom';
import Blaze from 'meteor/gadicc:blaze-react-component';
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
import SkogenTerms from '../../UIComponents/SkogenTerms';
const FormItem = Form.Item;
import NiceList from '../../UIComponents/NiceList';

class Profile extends React.Component {
  state = {
    isDeleteModalOn: false,
    isAddWorkModalOn: false,
    workTitle: '',
    workShortDescription: '',
    workDescription: ''
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        return;
      }
      const values = {
        firstName: fieldsValue['firstName'],
        lastName: fieldsValue['lastName'],
        bio: fieldsValue['bio']
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
    const { workTitle, workDescription } = this.state;
    const newWork = {
      title: workTitle,
      description: workDescription
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

  render() {
    const { currentUser, myWorks } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      isDeleteModalOn,
      isAddWorkModalOn,
      workTitle,
      workShortDescription,
      workDescription
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
          <Blaze template="loginButtons" />

          <Divider />
          <Col md={8}>
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

                <FormItem>
                  {getFieldDecorator('bio', {
                    initialValue: currentUser ? currentUser.bio : null
                  })(
                    <ReactQuill
                      modules={editorModules}
                      formats={editorFormats}
                    />
                  )}
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
                          dangerouslySetInnerHTML={{ __html: work.description }}
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
            <SkogenTerms />
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

          <ReactQuill
            modules={editorModules}
            formats={editorFormats}
            value={workDescription}
            onChange={this.handleWorkDescriptionChange}
            placeholder="description"
          />
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Profile);
