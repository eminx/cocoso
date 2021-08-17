import React from 'react';
import {
  Box,
  CheckBox,
  DateInput,
  MaskedInput,
  Text,
  TextInput,
} from 'grommet';
import { FormTrash } from 'grommet-icons/icons/FormTrash';

const dateInputProps = {
  format: 'yyyy-mm-dd',
  daysOfWeek: true,
  calendarProps: {
    firstDayOfWeek: 1,
    size: 'small',
  },
  style: {
    background: 'white',
  },
};

const DatesAndTimes = ({
  recurrence,
  handleDateChange,
  handleStartTimeChange,
  handleFinishTimeChange,
  handleCapacityChange,
  handleRangeSwitch,
  removeRecurrence,
  isNotDeletable,
  isPublicActivity,
  noAnimate,
}) => {
  if (!recurrence) {
    return null;
  }

  const isRange = recurrence.isRange;

  return (
    <Box
      pad="small"
      margin={{ bottom: 'small' }}
      animation={noAnimate ? null : 'slideUp'}
      background="light-1"
      border={
        recurrence.conflict ? { color: 'status-critical', size: 'small' } : null
      }
    >
      {!isNotDeletable && (
        <Box>
          <Box
            alignSelf="center"
            pad="small"
            onClick={removeRecurrence}
            hoverIndicator={{ background: 'light-1' }}
          >
            <FormTrash style={{ fontSize: 18, cursor: 'pointer' }} />
          </Box>
        </Box>
      )}
      <Box direction="row" justify="center">
        <CheckBox
          checked={isRange}
          label={<Text>Multiple Days?</Text>}
          onChange={handleRangeSwitch}
          pad={{ vertical: 'small' }}
        />
      </Box>
      <Box direction="row" justify="around" wrap>
        <Box pad="xsmall" margin={{ bottom: 'medium' }}>
          <Box>
            <Text size="small">{isRange ? 'Start Day' : 'Day'}</Text>
            <DateInput
              {...dateInputProps}
              value={recurrence.startDate}
              onChange={({ value }) => {
                handleDateChange(value);
              }}
            />
          </Box>

          {isRange && (
            <Box margin={{ top: 'medium' }}>
              <Text size="small">Finish Day</Text>
              <DateInput
                {...dateInputProps}
                value={recurrence.endDate}
                onChange={({ value }) => {
                  handleDateChange(value, 'isEndDate');
                }}
              />
            </Box>
          )}
        </Box>
        <Box
          pad="xsmall"
          margin={{ bottom: 'medium' }}
          justify="around"
          flex={{ grow: 0 }}
          basis="180px"
        >
          <Box>
            <Text size="small">Start time</Text>
            <TimePicker
              value={recurrence.startTime}
              onChange={handleStartTimeChange}
              style={{
                background: 'white',
              }}
            />
          </Box>
          <Box margin={{ top: 'medium' }}>
            <Text size="small">Finish time</Text>
            <TimePicker
              value={recurrence.endTime}
              onChange={handleFinishTimeChange}
              style={{
                background: 'white',
              }}
            />
          </Box>
          {isPublicActivity && (
            <Box margin={{ top: 'medium' }} pad="xxsmall">
              <Text size="small">Capacity</Text>
              <TextInput
                placeholder="Capacity"
                value={recurrence.capacity}
                onChange={handleCapacityChange}
                style={{
                  background: 'white',
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
      {recurrence.conflict && (
        <Text size="small" textAlign="center" weight="bold">
          There's already a booking for this resource at this date & time:{' '}
          <br />
          <Text color="status-critical" margin="medium">
            <code>
              {recurrence.conflict.startDate === recurrence.conflict.endDate
                ? recurrence.conflict.startDate
                : recurrence.conflict.startDate +
                  '-' +
                  recurrence.conflict.endDate}
              {', '}
              {recurrence.conflict.startTime +
                ' – ' +
                recurrence.conflict.endTime}
            </code>
          </Text>
        </Text>
      )}
    </Box>
  );
};

const TimePicker = ({ onChange, value, ...otherProps }) => (
  <MaskedInput
    size="medium"
    mask={[
      {
        length: [1, 2],
        options: Array.from(
          { length: 24 },
          (v, k) => (k < 10 ? '0' : '') + k.toString()
        ),
        regexp: /^1[0,1-2]$|^0?[1-9]$|^0$/,
        placeholder: 'hh',
      },
      { fixed: ':' },
      {
        length: 2,
        options: ['00', '15', '30', '45'],
        regexp: /^[0-5][0-9]$|^[0-9]$/,
        placeholder: 'mm',
      },
    ]}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    dropHeight="small"
    {...otherProps}
  />
);

export { TimePicker };

export default DatesAndTimes;
