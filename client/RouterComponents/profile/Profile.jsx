import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

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
    isDeleteModalOn: false
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

  render() {
    const { currentUser } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { isDeleteModalOn } = this.state;

    return (
      <div style={{ padding: 24, minHeight: '80vh' }}>
        <Row gutter={24}>
          <Col md={6}>
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
              <Button onClick={() => this.setState({ isDeleteModalOn: true })}>
                Delete Account
              </Button>
            )}
          </Col>

          <Col md={8} style={{ paddingRight: 24 }}>
            <Blaze template="loginButtons" />
            <Divider />
          </Col>

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
      </div>
    );
  }
}

export default Form.create()(Profile);
