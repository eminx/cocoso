import React from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Select, InputNumber, Switch, Upload, Icon, Divider, Modal } from 'antd/lib';
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import nodenParts from '../constants/parts';

class CreateGatheringForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      if (!this.props.uploadableImage) {
        Modal.error({
          title: 'Image is required',
          content: 'Please upload an image',
        }); 
        return;
      }

      const startTime = fieldsValue['timePickerStart'], 
            endTime = startTime.clone();
      endTime.add(fieldsValue.duration,'minutes');

      const values = {
        ...fieldsValue,
        'datePicker': fieldsValue['datePicker'].format('YYYY-MM-DD'),
        'timePickerStart': startTime.format('HH:mm'),
        'timePickerEnd': endTime.format('HH:mm')
      };
      if (!err) {
        this.props.registerGatheringLocally(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { uploadableImage, setUploadableImage } = this.props;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const configDate = {
      rules: [{
        type: 'object',
        required: true,
        message: 'Please select the day!'
      }],
    };
    const configTimeStart = {
      rules: [{
        type: 'object',
        required: true,
        message: 'Please select the start time!' }],
    };
    const configDuration = {
      rules: [{
        type: 'number',
        required: true,
        message: 'Please type duration'
      }],
      initialValue: 60
    };

    return (
      <div className="create-gathering-form">
        <h3>Please enter the details about your event</h3>
        <Divider />
        <Form onSubmit={this.handleSubmit}>

          <FormItem {...formItemLayout} label="Title">
            {getFieldDecorator('title', {
              rules: [{
                required: true,
                message: 'Enter the Title',
              }],
            })(
              <Input placeholder="Amazing Workshop..." />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Short description">
            {getFieldDecorator('shortDescription', {
              rules: [{
                required: true,
                message: 'Please enter a brief description',
              }],
            })(
              <Input placeholder="Enter a short description" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Long description">
            {getFieldDecorator('longDescription', {
              rules: [{
                required: true,
                message: 'Please enter a detailed description',
              }],
            })(
              <TextArea placeholder="Enter a detailed description of your Stream" autosize />
            )}
          </FormItem>

         <FormItem
            {...formItemLayout}
            label="Select the Day"
          >
            {getFieldDecorator('datePicker', configDate)(
              <DatePicker />
            )}
          </FormItem>
          
          <FormItem
            {...formItemLayout}
            label="Start time"
          >
            {getFieldDecorator('timePickerStart', configTimeStart)(
              <TimePicker format='HH:mm' />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Duration (mins)"
          >
            {getFieldDecorator('duration', configDuration)(
              <InputNumber />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Enter place in the UB">
            {getFieldDecorator('room', {
              rules: [{
                required: true,
                message: 'Please enter where in the UB you are hosting your event',
              }],
            })(
              <Input placeholder="Example: The main stage..." />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Capacity"
          >
            {getFieldDecorator('capacity', { initialValue: 15 })(
              <InputNumber min={1} max={300} />
            )}
            <span className="ant-form-text">people (incl. children)</span>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Require RSVP?"
          >
            {getFieldDecorator('isRSVPrequired', {
              valuePropName: 'checked',
              initialValue: false
            })(
              <Switch />
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

const WrappedAddContentForm = Form.create()(CreateGatheringForm);
export default WrappedAddContentForm;