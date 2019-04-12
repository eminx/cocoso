import React from 'react';
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
import SkogenTerms from '../../UIComponents/SkogenTerms';
const FormItem = Form.Item;

class Profile extends React.Component {
  state = {
    isDeleteModalOn: false,
    isAddWorkModalOn: false,
    workTitle: '',
    workDescription: ''
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(fieldsValue);
      const values = {
        firstName: fieldsValue['firstName'],
        lastName: fieldsValue['lastName']
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

  handleWorkDescriptionChange = value => {
    this.setState({ workDescription: value });
  };

  createWork = () => {
    const { workTitle, workDescription } = this.state;
    const newWork = { workTitle, workDescription };
    Meteor.call('createWork', newWork, (error, response) => {
      if (error) {
        message.error('Could not create work due to ', error.error);
      }
      console.log(response);
      message.success('You work is successfully created');
    });
  };

  render() {
    const { currentUser } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      isDeleteModalOn,
      isAddWorkModalOn,
      workTitle,
      workDescription
    } = this.state;

    return (
      <div style={{ padding: 24, minHeight: '80vh' }}>
        <Row gutter={24}>
          <Col md={8}>
            <Blaze template="loginButtons" />

            <Divider />

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

            {currentUser && (
              <div>
                <Button
                  onClick={() => this.setState({ isDeleteModalOn: true })}
                >
                  Delete Account
                </Button>
                <Divider />
              </div>
            )}

            <Divider />

            {currentUser && (
              <div>
                <Button
                  onClick={() => this.setState({ isAddWorkModalOn: true })}
                >
                  Add work
                </Button>
                <Divider />
              </div>
            )}
          </Col>

          <Col md={4} />

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
            placeholder="Page title"
            value={workTitle}
            onChange={this.handleWorkTitleChange}
          />
          <ReactQuill
            modules={editorModules}
            formats={editorFormats}
            value={workDescription}
            onChange={this.handleWorkDescriptionChange}
          />
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Profile);
