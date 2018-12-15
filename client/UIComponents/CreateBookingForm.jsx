import React, { Component } from 'react';
import {
  Col,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Select,
  InputNumber,
  Switch,
  Upload,
  Icon,
  Divider,
  Modal,
  message
} from 'antd/lib';
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';

const emptyDateAndTime = {
  dateStart: null,
  dateEnd: null,
  timeStart: null,
  timeEnd: null
};

class CreateBookingForm extends Component {
  state = {
    addSpaceModal: false,
    datesAndTimes: [emptyDateAndTime]
  };

  componentDidMount() {
    this.setDatesAndTimes();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.bookingData && this.props.bookingData) {
      this.setDatesAndTimes();
    }
  }

  setDatesAndTimes = () => {
    const { bookingData } = this.props;
    if (!bookingData) {
      return;
    }

    this.setState({
      datesAndTimes: bookingData.datesAndTimes
    });
  };

  addRecurrence = () => {
    this.setState({
      datesAndTimes: [...this.state.datesAndTimes, { ...emptyDateAndTime }]
    });
  };

  addSpace = name => {
    Meteor.call('addSpace', name, (err, res) => {
      if (err) {
        message.error(err.reason);
        console.log(err);
      } else {
        message.success('Your place succesfully added to the list :)');
        this.setState({ addSpaceModal: false });
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        return;
      }

      if (this.props.isPublicActivity && !this.props.uploadableImage) {
        Modal.error({
          title: 'Image is required',
          content: 'Please upload an image'
        });
        return;
      }

      const startTime = fieldsValue['timePickerMultiDayStart'].format('HH:mm');
      const endTime = fieldsValue['timePickerMultiDayFinish'].format('HH:mm');
      let startDate = fieldsValue['datePickerMultiDayStart'];
      startDate = startDate.format('YYYY-MM-DD');
      let endDate = fieldsValue['datePickerMultiDayFinish'];
      endDate = endDate.format('YYYY-MM-DD');

      const values = {
        title: fieldsValue['title'],
        room: fieldsValue['room'],
        longDescription: fieldsValue['longDescription'],
        duration: fieldsValue['duration'] || null,
        dateStart: startDate,
        dateEnd: endDate,
        timePickerStart: startTime,
        timePickerEnd: endTime,
        isMultipleDay: startDate !== endDate
      };

      values.datePicker = null;

      if (!err) {
        this.props.registerGatheringLocally(values);
      }
    });
  };

  renderDateTime = () => {
    const { datesAndTimes } = this.state;
    const { bookingData, removeRecurrence } = this.props;
    const { getFieldDecorator } = this.props.form;

    const props = {
      bookingData,
      getFieldDecorator
    };

    return (
      <div style={{ marginBottom: 12 }}>
        {datesAndTimes.map((recurrence, index) => (
          <DatesAndTimes
            key={index}
            recurrence={recurrence}
            handleStartDateChange={(date, dateString) =>
              this.handleDateAndTimeChange(date, dateString, index, 'dateStart')
            }
            handleStartTimeChange={(time, timeString) =>
              this.handleDateAndTimeChange(time, timeString, index, 'timeStart')
            }
            handleFinishDateChange={(date, dateString) =>
              this.handleDateAndTimeChange(date, dateString, index, 'dateEnd')
            }
            handleFinishTimeChange={(time, timeString) =>
              this.handleDateAndTimeChange(time, timeString, index, 'timeEnd')
            }
          />
        ))}
        <div
          style={{
            padding: 24,
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 24,
            backgroundColor: '#f8f8f8'
          }}
        >
          <Icon
            style={{ fontSize: 48 }}
            type="plus-circle"
            onClick={this.addRecurrence}
          />
        </div>
      </div>
    );
  };

  handleDateAndTimeChange = (date, dateString, index, entity) => {
    const { datesAndTimes } = this.state;
    const newDatesAndTimes = datesAndTimes.map((item, i) => {
      if (index === i) {
        item[entity] = date;
      }
      return item;
    });
    this.setState({
      datesAndTimes: newDatesAndTimes
    });
  };

  handleStartDateChange = (date, dateString, index) => {
    const { datesAndTimes } = this.state;
    const newDatesAndTimes = datesAndTimes.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          dateStart: date
        };
      } else {
        return item;
      }
    });
    this.setState({
      datesAndTimes: newDatesAndTimes
    });
  };

  handleStartTimeChange = (time, timeString, index) => {
    const { datesAndTimes } = this.state;
    const newDatesAndTimes = (datesAndTimes[index].startTime = time);
    this.setState({
      datesAndTimes: newDatesAndTimes
    });
  };

  handleFinishDateChange = (date, dateString, index) => {
    const { datesAndTimes } = this.state;
    const newDatesAndTimes = (datesAndTimes[index].endDate = date);
    this.setState({
      datesAndTimes: newDatesAndTimes
    });
  };

  handleFinishTimeChange = (time, timeString, index) => {
    const { datesAndTimes } = this.state;
    const newDatesAndTimes = (datesAndTimes[index].endTime = time);
    this.setState({
      datesAndTimes: newDatesAndTimes
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      uploadableImage,
      setUploadableImage,
      places,
      bookingData,
      currentUser,
      isPublicActivity
    } = this.props;
    const { addSpaceModal } = this.state;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };

    return (
      <div className="create-gathering-form">
        <h3>Please enter the details below</h3>
        <Divider />
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Enter the Title'
                }
              ],
              initialValue: bookingData ? bookingData.title : null
            })(<Input placeholder="Booking title" />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('longDescription', {
              rules: [
                {
                  message: 'Please enter a detailed description (optional)'
                }
              ],
              initialValue: bookingData ? bookingData.longDescription : null
            })(
              <TextArea
                placeholder="Description"
                autosize={{ minRows: 3, maxRows: 6 }}
              />
            )}
          </FormItem>

          {this.renderDateTime()}

          {isPublicActivity && (
            <FormItem
              className="upload-image-col"
              extra={uploadableImage ? null : 'Pick an image from your device'}
            >
              <Upload
                name="gathering"
                action="/upload.do"
                onChange={setUploadableImage}
              >
                {uploadableImage ? (
                  <Button>
                    <Icon type="check-circle" />
                    Image selected
                  </Button>
                ) : (
                  <Button>
                    <Icon type="upload" />
                    Pick an image
                  </Button>
                )}
              </Upload>
            </FormItem>
          )}

          {currentUser && currentUser.isSuperAdmin && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <span style={{ marginRight: 10 }}>
                Wanna add space/equipment to the list?
              </span>
              <Button onClick={() => this.setState({ addSpaceModal: true })}>
                Add
              </Button>
            </div>
          )}

          <FormItem>
            {getFieldDecorator('room', {
              rules: [
                {
                  required: true,
                  message: 'Please enter which part of Skogen you want to book'
                }
              ],
              initialValue: bookingData ? bookingData.room : null
            })(
              <Select placeholder="Select space/equipment">
                {places
                  ? places.map((part, i) => (
                      <Option key={part.name + i} value={part.name}>
                        {part.name}
                      </Option>
                    ))
                  : null}
              </Select>
            )}
          </FormItem>

          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 }
            }}
          >
            <Button type="primary" htmlType="submit">
              Continue
            </Button>
          </FormItem>
        </Form>

        <Modal
          className="addSpace-modal"
          title="Add a space/equipment for booking"
          visible={addSpaceModal}
          onOk={() => this.setState({ addSpaceModal: false })}
          onCancel={() => this.setState({ addSpaceModal: false })}
        >
          <h3>
            Please enter the name of the space or equipment to be added to the
            list
          </h3>
          <Input.Search
            placeholder="type and press enter"
            enterButton="Add"
            size="large"
            onSearch={value => this.addSpace(value)}
          />
        </Modal>
      </div>
    );
  }
}

const WrappedAddContentForm = Form.create()(CreateBookingForm);
export default WrappedAddContentForm;

class DatesAndTimes extends Component {
  render() {
    const {
      recurrence,
      handleStartDateChange,
      handleStartTimeChange,
      handleFinishDateChange,
      handleFinishTimeChange
    } = this.props;

    return (
      <div
        style={{ padding: 12, backgroundColor: '#f8f8f8', marginBottom: 12 }}
      >
        <FormItem style={{ marginBottom: 6 }}>
          <DatePicker
            onChange={handleStartDateChange}
            value={recurrence.dateStart}
            placeholder="Start date"
          />
        </FormItem>

        <FormItem style={{ marginBottom: 12 }}>
          <TimePicker
            onChange={handleStartTimeChange}
            value={recurrence.timeStart}
            format="HH:mm"
            minuteStep={30}
            placeholder="Start time"
          />
        </FormItem>

        <FormItem style={{ marginBottom: 6 }}>
          <DatePicker
            placeholder="Finish date"
            onChange={handleFinishDateChange}
            value={recurrence.dateEnd}
          />
        </FormItem>

        <FormItem style={{ marginBottom: 12 }}>
          <TimePicker
            onChange={handleFinishTimeChange}
            value={recurrence.timeEnd}
            format="HH:mm"
            minuteStep={30}
            placeholder="Finish time"
          />
        </FormItem>
      </div>
    );
  }
}
