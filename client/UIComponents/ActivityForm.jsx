import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import ReactQuill from 'react-quill';
import {
  Box,
  Form,
  FormField,
  TextInput,
  TextArea,
  Heading,
  Select,
  Button,
  Text,
} from 'grommet';
import { AddCircle } from 'grommet-icons/icons/AddCircle';

import { editorFormats, editorModules } from '../constants/quillConfig';
import DatesAndTimes from './DatesAndTimes';
import FileDropper from './FileDropper';
import { message } from './message';

const defaultCapacity = 40;
const today = new Date().toISOString().substring(0, 10);

let emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '',
  endTime: '',
  attendees: [],
  capacity: defaultCapacity,
};

function Field({ label, children, ...otherProps }) {
  return (
    <FormField label={label} {...otherProps} margin={{ bottom: 'medium' }}>
      {children}
    </FormField>
  );
}

class ActivityForm extends PureComponent {
  addRecurrence = () => {
    const { datesAndTimes, setDatesAndTimes } = this.props;
    const newDatesAndTimes = [...datesAndTimes, { ...emptyDateAndTime }];

    setDatesAndTimes(newDatesAndTimes);
  };

  removeRecurrence = (index) => {
    const { datesAndTimes, setDatesAndTimes } = this.props;
    const newDatesAndTimes = [...datesAndTimes];
    newDatesAndTimes.splice(index, 1);

    setDatesAndTimes(newDatesAndTimes);
  };

  addSpace = (name) => {
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

  renderDateTime = () => {
    const { isPublicActivity, datesAndTimes } = this.props;

    return (
      <div style={{ marginBottom: 12 }}>
        {datesAndTimes.map((recurrence, index) => (
          <DatesAndTimes
            key={index}
            isPublicActivity={isPublicActivity}
            recurrence={recurrence}
            removeRecurrence={() => this.removeRecurrence(index)}
            isNotDeletable={index === 0}
            handleCapacityChange={(value) =>
              this.handleCapacityChange(value, index)
            }
            handleDateChange={(date, isEndDate) =>
              this.handleDateChange(date, isEndDate, index)
            }
            handleStartTimeChange={(time) =>
              this.handleTimeChange(time, index, 'startTime')
            }
            handleFinishTimeChange={(time) =>
              this.handleTimeChange(time, index, 'endTime')
            }
            handleRangeSwitch={(event) => this.handleRangeSwitch(event, index)}
            noAnimate={index === 0}
          />
        ))}
        <Box
          direction="row"
          justify="center"
          pad="small"
          margin="medium"
          onClick={this.addRecurrence}
          hoverIndicator
        >
          <AddCircle style={{ fontSize: 48, cursor: 'pointer' }} />
        </Box>
      </div>
    );
  };

  handleTimeChange = (time, recurrenceIndex, startOrFinishTime) => {
    const { datesAndTimes, setDatesAndTimes } = this.props;

    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (index === recurrenceIndex) {
        item[startOrFinishTime] = time;
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  handleDateChange = (isoDate, isEndDate, recurrenceIndex) => {
    const date = isoDate.substring(0, 10);
    const { datesAndTimes, setDatesAndTimes } = this.props;
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (recurrenceIndex === index) {
        const recurrence = datesAndTimes[recurrenceIndex];
        if (recurrence.isRange) {
          if (isEndDate) {
            item.endDate = date;
          } else {
            item.startDate = date;
          }
        } else {
          item.startDate = date;
          item.endDate = date;
        }
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  handleCapacityChange = (event, recurrenceIndex) => {
    const value = Number(event.target.value);
    if (typeof value !== 'number') {
      return;
    }
    const { datesAndTimes, setDatesAndTimes } = this.props;
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (recurrenceIndex === index) {
        item.capacity = value;
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  handleRangeSwitch = (event, recurrenceIndex) => {
    const value = event.target.checked;
    const { datesAndTimes, setDatesAndTimes } = this.props;
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (recurrenceIndex === index) {
        item.isRange = value;
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  render() {
    const {
      imageUrl,
      uploadableImageLocal,
      setUploadableImage,
      resources,
      isCreating,
      isPublicActivity,
      onFormValueChange,
      onQuillChange,
      formValues,
      longDescription,
      onSubmit,
      isButtonDisabled,
      buttonLabel,
      isFormValid,
    } = this.props;

    if (!formValues) {
      return null;
    }

    return (
      <Box pad="medium" background="white">
        <Form
          onSubmit={onSubmit}
          value={formValues}
          onChange={onFormValueChange}
          // errors={{ name: ['message', '<Box>...</Box>'] }}
          validate="blur"
        >
          <Heading level={4}>Resource</Heading>
          <Field name="resource" required>
            <Select
              size="small"
              plain={false}
              placeholder="Select resource to book"
              name="resource"
              options={resources}
            >
              {(option, index, options, { active, disabled, selected }) => (
                <Box pad="small">
                  {option.isCombo ? (
                    <Text>
                      {option.label +
                        ': [' +
                        option.resourcesForCombo.map((res, i) => res.label) +
                        ']'}
                    </Text>
                  ) : (
                    <Text>{option.label}</Text>
                  )}
                </Box>
              )}
            </Select>
          </Field>

          <Heading level={4}>Occurences</Heading>

          {this.renderDateTime()}
          <Box pad={{ top: 'large' }}>
            <Heading level={4}>Details</Heading>
            <Field
              label="Title"
              name="title"
              required
              // help="This is typicaly title of your event"
              // validate={(fieldValue, formValue) => console.log(fieldValue)}
            >
              <TextInput
                plain={false}
                name="title"
                placeholder="give it a title"
                required
              />
            </Field>

            {isPublicActivity && (
              <Field label="Subtitle" name="subTitle">
                <TextInput
                  plain={false}
                  name="subTitle"
                  placeholder="give it a subtitle (artist name etc.)"
                />
              </Field>
            )}

            <Field label="Description">
              <ReactQuill
                modules={editorModules}
                formats={editorFormats}
                onChange={onQuillChange}
                value={longDescription || ''}
              />
            </Field>

            {isPublicActivity && (
              <Field label="Place" name="place">
                <TextInput
                  plain={false}
                  name="place"
                  placeholder="Artistosphere"
                />
              </Field>
            )}

            {isPublicActivity && (
              <Field label="Address" name="address">
                <TextArea
                  plain={false}
                  name="address"
                  placeholder="17th Street, Berlin..."
                />
              </Field>
            )}

            {isPublicActivity && (
              <Field
                label="Image"
                help={
                  (uploadableImageLocal || imageUrl) && (
                    <Text size="small">
                      If you want to replace it with another one, click on the
                      image to reopen the file picker
                    </Text>
                  )
                }
              >
                <Box alignSelf="center">
                  <FileDropper
                    uploadableImageLocal={uploadableImageLocal}
                    imageUrl={imageUrl}
                    setUploadableImage={setUploadableImage}
                  />
                </Box>
              </Field>
            )}

            <Box direction="row" justify="end" pad="small">
              <Button
                type="submit"
                primary
                disabled={isButtonDisabled}
                label={buttonLabel}
              />
            </Box>
          </Box>
        </Form>
      </Box>
    );
  }
}

export default ActivityForm;
