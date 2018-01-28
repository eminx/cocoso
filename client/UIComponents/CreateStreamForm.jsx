import React from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Select, InputNumber, Switch, Upload, Icon } from 'antd/lib';
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;

class CreateStreamForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log(fieldsValue);
      // Should format date value before submit.
      // const rangeValue = fieldsValue['range-picker'];
      // const rangeTimeValue = fieldsValue['range-time-picker'];
      // const values = {
      //   ...fieldsValue,
      //   'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
      //   'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
      //   'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
      //   'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
      //   // 'range-time-picker': [
      //     // rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
      //     // rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      //   ],
      //   'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
      // };
      // console.log('Received values of form: ', values);
      if (!err) {
        const formValues = this.props.form.getFieldsValue();
        Meteor.call('createGathering', Meteor.userId(), formValues, (error, result) => {    
          if (error) {
            console.log(error);
          } else {
            console.log('success');
          }
        });
      }
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
      wrapperCol: { span: 10 },
    };
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
    return (
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
              required: true, message: 'Please enter a brief description',
            }],
          })(
            <Input placeholder="Enter a short description" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Detailed description">
          {getFieldDecorator('longDescription', {
            rules: [{
              required: true, message: 'Please enter a detailed description',
            }],
          })(
            <TextArea placeholder="Enter a detailed description of your Stream" autosize />
          )}
        </FormItem>

       {/* <FormItem
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
*/}
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
          label="Capacity"
        >
          {getFieldDecorator('capacity', { initialValue: 15 })(
            <InputNumber min={1} max={300} />
          )}
          <span className="ant-form-text">people (incl. children)</span>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Should RSVP?"
        >
          {getFieldDecorator('isRSVPrequired', { valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Select an image"
          extra="Pick an image from your device"
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
          {getFieldDecorator('phoneNumber', {
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
          <Button type="primary" htmlType="submit">Post the Stream</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedAddContentForm = Form.create()(CreateStreamForm);
export default WrappedAddContentForm;