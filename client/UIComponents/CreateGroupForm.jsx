import React from 'react';
import { Col, Form, Input, DatePicker, TimePicker, Button, Select, InputNumber, Switch, Upload, Icon, Divider, Modal, message } from 'antd/lib';
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
import moment from 'moment';

class CreateGroupForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        return;
      }

      if (!this.props.uploadableImage) {
        Modal.error({
          title: 'Image is required',
          content: 'Please upload an image',
        }); 
        return;
      }

      const values = {
        title: fieldsValue['title'],
        description: fieldsValue['description'],
        readingMaterial: fieldsValue['readingMaterial'],
        capacity: fieldsValue['capacity'],
      }

      if (!err) {
        this.props.registerGroupLocally(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { uploadableImage, setUploadableImage, groupData, currentUser } = this.props;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <div className="create-gathering-form">
        <h3>Please enter the details below</h3>
        <Divider />

        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Title">
            {getFieldDecorator('title', {
              rules: [{
                required: true,
                message: 'Please enter the Title'
              }],
              initialValue: groupData ? groupData.title : null
            })(
              <Input placeholder="Booking title" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Description">
            {getFieldDecorator('description', {
              rules: [{
                required: true,
                message: 'Please enter a detailed description',
              }],
              initialValue: groupData ? groupData.description : null
            })(
              <TextArea
                placeholder="Enter a description for your study group"
                autosize={{ minRows: 3, maxRows: 6 }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Reading Material">
            {getFieldDecorator('readingMaterial', {
              rules: [{
                required: true,
                message: 'Please enter the reading Material or area of interest'
              }],
              initialValue: groupData ? groupData.readingMaterial : null
            })(
              <Input placeholder="Reading Material" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Capacity">
            {getFieldDecorator('capacity', {
              rules: [{
                required: true,
                message: 'Please enter capacity for the group',
              }],
              min: 2,
              max: 50,
              initialValue: groupData ? groupData.capacity : null
            })(
              <InputNumber min={2} max={50} placeholder="Capacity" autosize />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Select an image"
            className="upload-image-col"
            extra={ uploadableImage ? null : "Pick an image from your device" }
          >
            <Upload 
              name="gathering"
              action="/upload.do"
              onChange={setUploadableImage}
            >
              { uploadableImage
                ? <Button><Icon type="check-circle" />Image selected</Button>
                : <Button><Icon type="upload" />Pick an image</Button>
              }
            </Upload>
          </FormItem>

          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button type="primary" htmlType="submit">Continue</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(CreateGroupForm);