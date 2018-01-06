import React from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Select, InputNumber, Switch, Upload, Icon } from 'antd';
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;

class AddContentForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      // Should format date value before submit.
      const rangeValue = fieldsValue['range-picker'];
      const rangeTimeValue = fieldsValue['range-time-picker'];
      const values = {
        ...fieldsValue,
        'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
        'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
        'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
        'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
        'range-time-picker': [
          rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
          rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
        ],
        'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
      };
      console.log('Received values of form: ', values);
    });
  }

  handleSelectChange = (value) => {
    console.log(value);
    // this.props.form.setFieldsValue({
    //   note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    // });
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
    return (
      <Form onSubmit={this.handleSubmit}>

        <FormItem {...formItemLayout} label="Name">
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
          {getFieldDecorator('short-description', {
            rules: [{
              required: true,
              message: 'Enter the Title',
            }],
          })(
            <Input placeholder="Enter a short description" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Long description">
          {getFieldDecorator('short-description', {
            rules: [{
              required: true,
              message: 'Enter the Title',
            }],
          })(
            <TextArea placeholder="Enter a detailed description of your thing" autosize />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Select the Day"
        >
          {getFieldDecorator('date-picker', config)(
            <DatePicker />
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="Select the Time"
        >
          {getFieldDecorator('time-picker', config)(
            <TimePicker />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Select Room"
        >
          {getFieldDecorator('room', {
            rules: [{ required: true, message: 'Please select the Space in Noden' }],
          })(
            <Select
              placeholder="Select space..."
              onChange={this.handleSelectChange}
            >
              <Option value="big-room">Big Room</Option>
              <Option value="small-room">Small Room</Option>
              <Option value="sound-studio">Sound Studio</Option>
              <Option value="smoking-room">Smoking Room</Option>
              <Option value="kitchen">Kitchen</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Capacity (max 60)"
        >
          {getFieldDecorator('capacity', { initialValue: 15 })(
            <InputNumber min={1} max={60} />
          )}
          <span className="ant-form-text">people (incl. children)</span>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Have to RSVP"
        >
          {getFieldDecorator('rsvp', { valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Select image"
          extra="choose an image from your device"
        >
          {getFieldDecorator('upload-image', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Phone Number"
        >
          {getFieldDecorator('phone-number', {
            rules: [{ required: true, message: 'Phone number to contact' }],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type="primary" htmlType="submit">Post the Gathering</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedAddContentForm = Form.create()(AddContentForm);
export default WrappedAddContentForm;