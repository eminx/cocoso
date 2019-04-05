import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../themes/skogen';

import {
  Row,
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
import moment from 'moment';

const compareForSort = (a, b) => {
  const dateA = moment(a.startDate, 'YYYY-MM-DD');
  const dateB = moment(b.startDate, 'YYYY-MM-DD');
  return dateA.diff(dateB);
};

const defaultCapacity = 40;

let emptyDateAndTime = {
  startDate: null,
  endDate: null,
  startTime: null,
  endTime: null,
  attendees: [],
  capacity: defaultCapacity
};

const skogenAddress = 'Masthuggsterrassen 3, SE-413 18 Göteborg, Sverige';
const defaultPracticalInfo = `MAT: Efter föreställning serveras en vegetarisk middag, välkommen att stanna och äta med oss. \n\n
BILJETTPRIS: Skogen har inget fast biljettpris. Välkommen att donera för konst och mat när du går. Kontanter / Swish.`;

const iconStyle = {
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 24,
  backgroundColor: '#f8f8f8'
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

    const datesAndTimesSorted = bookingData.datesAndTimes.sort(compareForSort);

    const datesAndTimesWithMoment = datesAndTimesSorted.map(recurrence => ({
      ...recurrence,
      startDateMoment: moment(recurrence.startDate, 'YYYY-MM-DD'),
      startTimeMoment: moment(recurrence.startTime, 'HH:mm'),
      endDateMoment: moment(recurrence.endDate, 'YYYY-MM-DD'),
      endTimeMoment: moment(recurrence.endTime, 'HH:mm'),
      capacity: recurrence.capacity,
      attendees: recurrence.attendees || []
    }));

    this.setState({
      datesAndTimes: datesAndTimesWithMoment
    });
  };

  addRecurrence = () => {
    this.setState({
      datesAndTimes: [...this.state.datesAndTimes, { ...emptyDateAndTime }]
    });
  };

  removeRecurrence = index => {
    const allOccurences = [...this.state.datesAndTimes];
    allOccurences.splice(index, 1);

    this.setState({
      datesAndTimes: allOccurences
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
    const { datesAndTimes } = this.state;
    const { form, isPublicActivity } = this.props;

    form.validateFields((err, fieldsValue) => {
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

      const datesAndTimesWithoutMoment = datesAndTimes.map(recurrence => ({
        startDate: recurrence.startDate,
        startTime: recurrence.startTime,
        endDate: recurrence.endDate,
        endTime: recurrence.endTime,
        capacity: recurrence.capacity || defaultCapacity,
        attendees: recurrence.attendees || []
      }));

      const values = {
        title: fieldsValue['title'],
        subTitle: fieldsValue['subTitle'],
        longDescription: fieldsValue['longDescription'],
        datesAndTimes: datesAndTimesWithoutMoment
      };

      if (isPublicActivity) {
        values.room = fieldsValue['room'];
        values.place = fieldsValue['place'];
        values.address = fieldsValue['address'];
        values.practicalInfo = fieldsValue['practicalInfo'];
        values.internalInfo = fieldsValue['internalInfo'];
      } else {
        values.room = fieldsValue['room'];
      }

      if (!err) {
        this.props.registerGatheringLocally(values);
      }
    });
  };

  renderDateTime = () => {
    const { datesAndTimes } = this.state;

    return (
      <div style={{ marginBottom: 12 }}>
        {datesAndTimes.map((recurrence, index) => (
          <DatesAndTimes
            key={index}
            recurrence={recurrence}
            removeRecurrence={() => this.removeRecurrence(index)}
            isNotDeletable={index === 0}
            handleStartDateChange={(date, dateString) =>
              this.handleDateAndTimeChange(date, dateString, index, 'startDate')
            }
            handleStartTimeChange={(time, timeString) =>
              this.handleDateAndTimeChange(time, timeString, index, 'startTime')
            }
            handleFinishDateChange={(date, dateString) =>
              this.handleDateAndTimeChange(date, dateString, index, 'endDate')
            }
            handleFinishTimeChange={(time, timeString) =>
              this.handleDateAndTimeChange(time, timeString, index, 'endTime')
            }
            handleCapacityChange={value =>
              this.handleCapacityChange(value, index)
            }
          />
        ))}
        <div style={{ ...iconStyle, padding: 24 }}>
          <Icon
            style={{ fontSize: 48, cursor: 'pointer' }}
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
        item[entity + 'Moment'] = date;
        item[entity] = dateString;
      }
      return item;
    });
    this.setState({
      datesAndTimes: newDatesAndTimes
    });
  };

  handleCapacityChange = (value, index) => {
    const { datesAndTimes } = this.state;
    const newDatesAndTimes = datesAndTimes.map((item, i) => {
      if (index === i) {
        item.capacity = value;
      }
      return item;
    });
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
            })(<Input placeholder="Title" />)}
          </FormItem>

          {isPublicActivity && (
            <FormItem>
              {getFieldDecorator('subTitle', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter a subtitle (typically artists name)'
                  }
                ],
                initialValue:
                  bookingData && bookingData.subTitle
                    ? bookingData.subTitle
                    : ''
              })(<Input placeholder="Subtitle (i.e. the artist)" />)}
            </FormItem>
          )}

          <FormItem>
            {getFieldDecorator('longDescription', {
              rules: [
                {
                  message: 'Please enter a detailed description (optional)'
                }
              ],
              initialValue: bookingData ? bookingData.longDescription : null
            })(
              // <TextArea
              //   placeholder="Description"
              //   autosize={{ minRows: 3, maxRows: 6 }}
              // />

              <ReactQuill modules={editorModules} formats={editorFormats} />
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

          {isPublicActivity && (
            <FormItem>
              {getFieldDecorator('place', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter the address'
                  }
                ],
                initialValue:
                  bookingData && bookingData.place
                    ? bookingData.place
                    : 'Skogen'
              })(<Input placeholder="Please enter the name of the place" />)}
            </FormItem>
          )}

          {isPublicActivity && (
            <FormItem>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter the address'
                  }
                ],
                initialValue:
                  bookingData && bookingData.address
                    ? bookingData.address
                    : skogenAddress
              })(<Input placeholder="Please enter the address" />)}
            </FormItem>
          )}

          {isPublicActivity && (
            <FormItem>
              {getFieldDecorator('practicalInfo', {
                rules: [
                  {
                    message: 'Please enter practical info (if any)'
                  }
                ],
                initialValue:
                  bookingData && bookingData.practicalInfo
                    ? bookingData.practicalInfo
                    : ''
              })(
                <TextArea
                  placeholder="Practical info"
                  autosize={{ minRows: 3, maxRows: 6 }}
                />
              )}
            </FormItem>
          )}

          {isPublicActivity && (
            <FormItem>
              {getFieldDecorator('internalInfo', {
                rules: [
                  {
                    message:
                      'Please enter internal info - shown only to Skogen members (if any)'
                  }
                ],
                initialValue:
                  bookingData && bookingData.internalInfo
                    ? bookingData.internalInfo
                    : ''
              })(
                <TextArea
                  placeholder="Internal info"
                  autosize={{ minRows: 3, maxRows: 6 }}
                />
              )}
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
              initialValue: bookingData ? bookingData.room : 'Studio'
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
      handleFinishTimeChange,
      handleCapacityChange,
      removeRecurrence,
      isNotDeletable
    } = this.props;

    return (
      <div
        style={{
          padding: 12,
          backgroundColor: '#f8f8f8',
          marginBottom: 12
        }}
      >
        {!isNotDeletable && (
          <div style={iconStyle}>
            <Icon
              style={{ fontSize: 18, cursor: 'pointer' }}
              type="delete"
              onClick={removeRecurrence}
            />
          </div>
        )}

        <FormItem style={{ marginBottom: 6 }}>
          <DatePicker
            onChange={handleStartDateChange}
            value={recurrence.startDateMoment}
            placeholder="Start date"
          />
        </FormItem>

        <FormItem style={{ marginBottom: 12 }}>
          <TimePicker
            onChange={handleStartTimeChange}
            value={recurrence.startTimeMoment}
            format="HH:mm"
            minuteStep={30}
            placeholder="Start time"
          />
        </FormItem>

        <FormItem style={{ marginBottom: 6 }}>
          <DatePicker
            placeholder="Finish date"
            onChange={handleFinishDateChange}
            value={recurrence.endDateMoment}
          />
        </FormItem>

        <FormItem style={{ marginBottom: 12 }}>
          <TimePicker
            onChange={handleFinishTimeChange}
            value={recurrence.endTimeMoment}
            format="HH:mm"
            minuteStep={30}
            placeholder="Finish time"
          />
        </FormItem>
        <FormItem style={{ marginBottom: 12 }}>
          <InputNumber
            min={1}
            max={90}
            placeholder={'Capacity'}
            value={recurrence.capacity}
            onChange={handleCapacityChange}
          />
        </FormItem>
      </div>
    );
  }
}
