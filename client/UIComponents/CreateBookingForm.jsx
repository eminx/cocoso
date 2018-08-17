import React from 'react';
import { Col, Form, Input, DatePicker, TimePicker, Button, Select, InputNumber, Switch, Upload, Icon, Divider, Modal, message } from 'antd/lib';
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';

class CreateBookingForm extends React.Component {
  state = {
    addSpaceModal: false,
    isMultipleDay: false
  }

  componentDidMount() {
    if (this.props.bookingData) {
      this.setState({
        isMultipleDay: this.props.bookingData.isMultipleDay || false
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // const { bookingData } = this.props;
    // if (bookingData) {
    //   this.setState({
    //     isMultipleDay: bookingData.isMultipleDay
    //   })
    // }
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

    const { isMultipleDay } = this.state;

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        return;
      }

      let startTime, endTime, startDate, endDate;
      if (!isMultipleDay) {
        startTime = fieldsValue['timePickerStart'];
        endTime = startTime.clone();
        endTime.add(fieldsValue.duration,'hours');
        startTime = startTime.format('HH:mm');
        endTime = endTime.format('HH:mm');
        startDate = fieldsValue['datePicker'].format('YYYY-MM-DD');
        endDate = startDate;
      } else {
        startTime = fieldsValue['timePickerMultiDayStart'].format('HH:mm');
        endTime = fieldsValue['timePickerMultiDayFinish'].format('HH:mm');
        startDate = fieldsValue['datePickerMultiDayStart']
        startDate = startDate.format('YYYY-MM-DD');
        endDate = fieldsValue['datePickerMultiDayFinish'];
        endDate = endDate.format('YYYY-MM-DD');
      }

      const values = {
        title: fieldsValue['title'],
        room: fieldsValue['room'],
        longDescription: fieldsValue['longDescription'],
        duration: fieldsValue['duration'] || null,
        dateStart: startDate,
        dateEnd: endDate,
        timePickerStart: startTime,
        timePickerEnd: endTime,
        isMultipleDay: isMultipleDay
      }

      values.datePicker = null;

      if (!err) {
        this.props.registerGatheringLocally(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { uploadableImage, setUploadableImage, places, bookingData } = this.props;
    const { addSpaceModal, isMultipleDay } = this.state;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    
    const datePickerMultiDayStart = {
      rules: [{
        type: 'object',
        required: isMultipleDay,
        message: 'Please select the start day!'
      }],
      initialValue: bookingData ? moment(bookingData.startDate, 'YYYY-MM-DD') : null
    };
    const datePickerMultiDayFinish = {
      rules: [{
        type: 'object',
        required: isMultipleDay,
        message: 'Please select the ending day!'
      }],
      initialValue: bookingData ? moment(bookingData.endDate, 'YYYY-MM-DD') : null
    };
    const timePickerMultiDayStart = {
      rules: [{
        type: 'object',
        required: isMultipleDay,
        message: 'Please select the start time!'
      }],
      initialValue: bookingData ? moment(bookingData.startTime, 'HH:mm') : null
    };

    const timePickerMultiDayFinish = {
      rules: [{
        type: 'object',
        required: isMultipleDay,
        message: 'Please select the ending time!'
      }],
      initialValue: bookingData ? moment(bookingData.endTime, 'HH:mm') : null
    };

    const configDate = {
      rules: [{
        type: 'object',
        required: !isMultipleDay,
        message: 'Please select the day!'
      }],
      initialValue: bookingData ? moment(bookingData.startDate, 'YYYY-MM-DD') : null
    };
    const configTimeStart = {
      rules: [{
        type: 'object',
        required: !isMultipleDay,
        message: 'Please select the start time!'
      }],
      initialValue: bookingData ? moment(bookingData.startTime, 'HH:mm') : null
    };

    const durationCal = bookingData ? moment(bookingData.endTime, 'HH:mm').diff(moment(bookingData.startTime, 'HH:mm'), 'hours') : null;
    const configDuration = {
      rules: [{
        type: 'number',
        required: !isMultipleDay,
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

          <FormItem {...formItemLayout} label="Description">
            {getFieldDecorator('longDescription', {
              rules: [{
                message: 'Please enter a detailed description (optional)',
              }],
              initialValue: bookingData ? bookingData.longDescription : null
            })(
              <TextArea placeholder="Optionally enter a description" autosize />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="multiple days?">
            <Switch onChange={() => this.setState({isMultipleDay: !isMultipleDay})} checked={isMultipleDay} />
          </FormItem>

          { isMultipleDay
            ?
              <div>
                <FormItem
                  {...formItemLayout}
                  label="Start day & time"
                >
                  <Col span={12}>
                    <FormItem>
                      {getFieldDecorator('datePickerMultiDayStart', datePickerMultiDayStart)(
                        <DatePicker />
                      )}
                    </FormItem>
                  </Col>
                  <Divider type="vertical" />
                  <Col span={12}>
                    <FormItem>
                      {getFieldDecorator('timePickerMultiDayStart', timePickerMultiDayStart)(
                        <TimePicker format='HH:mm' minuteStep={30} />
                      )}
                    </FormItem>
                  </Col>
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="Finish day & time"
                >
                  <Col span={12}>
                    <FormItem>
                      {getFieldDecorator('datePickerMultiDayFinish', datePickerMultiDayFinish)(
                        <DatePicker />
                      )}
                    </FormItem>
                  </Col>
                  <Divider type="vertical" />
                  <Col span={12}>
                    <FormItem>
                      {getFieldDecorator('timePickerMultiDayFinish', timePickerMultiDayFinish)(
                        <TimePicker format='HH:mm' minuteStep={30} />
                      )}
                    </FormItem>
                  </Col>
                </FormItem>
              </div>

            :
              <div>
                <FormItem
                  {...formItemLayout}
                  label="Select the day"
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
              </div>
          }   

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
          visible={addSpaceModal}
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