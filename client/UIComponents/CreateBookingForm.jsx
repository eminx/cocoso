import React from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Select, InputNumber, Switch, Upload, Icon, Divider, Modal, message } from 'antd/lib';
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import nodenParts from '../constants/parts';

class CreateBookingForm extends React.Component {
  state = {
    addSpaceModal: false
  }

  addSpace = (name) => {
    Meteor.call('addSpace', name, (err, res) => {
      if (err) {
        message.error(err.reason);
        console.log(err);
      } else {
        message.success("Your place succesfully added to the list :)");
        this.setState({addSpaceModal: false});
      }
    });
    
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const startTime = fieldsValue['timePickerStart'], 
            endTime = startTime.clone();
      endTime.add(fieldsValue.duration,'hours');

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
    const { uploadableImage, setUploadableImage, places, bookingData } = this.props;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const configDate = {
      rules: [{
        type: 'object',
        required: true,
        message: 'Please select the day!'
      }],
      initialValue: bookingData ? moment(bookingData.startDate) : null
    };
    const configTimeStart = {
      rules: [{
        type: 'object',
        required: true,
        message: 'Please select the start time!'
      }],
      initialValue: bookingData ? moment(bookingData.startTime, 'HH:mm') : null
    };

    const durationCal = bookingData ? moment(bookingData.endTime, 'HH:mm').diff(moment(bookingData.startTime, 'HH:mm'), 'hours') : null;
    const configDuration = {
      rules: [{
        type: 'number',
        required: true,
        message: 'Please type duration in hours!'
      }],
      initialValue: durationCal
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
                message: 'Enter the Title'
              }],
              initialValue: bookingData ? bookingData.title : null
            })(
              <Input placeholder="Booking title" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Long description">
            {getFieldDecorator('longDescription', {
              rules: [{
                message: 'Please enter a detailed description (optional)',
              }],
              initialValue: bookingData ? bookingData.longDescription : null
            })(
              <TextArea placeholder="Optionally enter a description" autosize />
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
              <TimePicker format='HH:mm' minuteStep={30} />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Duration (h)"
          >
            {getFieldDecorator('duration', configDuration)(
              <InputNumber step={0.5} />
            )}
          </FormItem>
          
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <span style={{marginRight: 10}}>Wanna add space/equipment to the list?</span>
            <Button onClick={() => this.setState({addSpaceModal: true})}>Add</Button>
          </div>

          <FormItem
            {...formItemLayout}
            label="Space/equipment"
          >
            {getFieldDecorator('room', {
              rules: [{
                required: true,
                message: 'Please enter which part of Skogen you want to book'
              }],
              initialValue: bookingData ? bookingData.room : null
            })(
              <Select
                placeholder="Select space/equipment"
              >
                {places ? places.map((part, i) => (
                  <Option key={part.name + i} value={part.name}>{part.name}</Option>
                )) : null}
              </Select>
            )}
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

        <Modal
          className="addSpace-modal"
          title="Add a space/equipment for booking"
          visible={this.state.addSpaceModal}
          onOk={() => this.setState({addSpaceModal: false})}
          onCancel={() => this.setState({addSpaceModal: false})}
        >
          <h3>Please enter the name of the space or equipment to be added to the list</h3>
          <Input.Search 
            placeholder="type and press enter" 
            enterButton="Add" 
            size="large"
            onSearch={value => this.addSpace(value)} />
        </Modal>

      </div>
    );
  }
}

const WrappedAddContentForm = Form.create()(CreateBookingForm);
export default WrappedAddContentForm;