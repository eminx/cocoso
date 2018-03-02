import React from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Select, InputNumber, Switch, Upload, Icon } from 'antd/lib';
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
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const configDate = {
      rules: [{ type: 'object', required: true, message: 'Please select the day!'}],
    };
    const configTimeStart = {
      rules: [{ type: 'object', required: true, message: 'Please select the start time!' }],
    };
    const configDuration = {
      rules: [{ type: 'number', required: true, message: 'Please type duration'}],
      initialValue: 60
    };

    const { uploadableImage, setUploadableImage } = this.props;


    return (
      <div>
        <h2>Please enter the details about your gathering</h2>
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

          <FormItem {...formItemLayout} label="Long description">
            {getFieldDecorator('longDescription', {
              rules: [{
                required: true, message: 'Please enter a detailed description',
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
            label="Duration"
          >
            {getFieldDecorator('duration', configDuration)(
              <InputNumber />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Select Room"
          >
            {getFieldDecorator('room', {
              rules: [{ required: true, message: 'Please select a part of Noden in which this gathering will be held' }],
            })(
              <Select
                placeholder="Select part of Noden..."
              >
                {nodenParts.map(part => (
                  <Option key={part.name} value={part.name}>{part.name}</Option>
                ))}
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
            extra={ uploadableImage ? uploadableImage.name : "Pick an image from your device" }
          >
            {getFieldDecorator('upload-image', {
              required: true,
              valuePropName: 'fileList',
              getValueFromEvent: setUploadableImage,
            })(
              <Upload name="gathering" action="/upload.do" >
                { uploadableImage
                  ? <Button><Icon type="check-circle" />Image selected</Button>
                  : <Button><Icon type="upload" />Pick an image</Button>
                }
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
            <Button type="primary" htmlType="submit">Save and Continue</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedAddContentForm = Form.create()(CreateGatheringForm);
export default WrappedAddContentForm;