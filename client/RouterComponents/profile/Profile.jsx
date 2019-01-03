import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

import { Row, Col, Form, Input, Button, message } from 'antd/lib';
const FormItem = Form.Item;

class Profile extends React.Component {
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

  render() {
    const { currentUser, isLoading, history } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{ padding: 24, minHeight: '80vh' }}>
        <Row gutter={24}>
          <Col sm={6} />
          <Col sm={12} md={6}>
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
                    sm: { span: 16, offset: 8 }
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </FormItem>
              </Form>
            )}
          </Col>
          <Col sm={18} md={8}>
            <Blaze template="loginButtons" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(Profile);
