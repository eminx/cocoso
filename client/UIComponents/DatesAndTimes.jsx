import React from 'react';
import { Box, Text, Calendar, MaskedInput, TextInput } from 'grommet';
import { FormTrash } from 'grommet-icons';
const segmentPad = {
  top: 'xxsmall',
  left: 'xxsmall',
  right: 'xxsmall',
  bottom: 'small',
};

const DatesAndTimes = ({
  recurrence,
  handleDateChange,
  handleStartTimeChange,
  handleFinishTimeChange,
  handleCapacityChange,
  removeRecurrence,
  isNotDeletable,
  isPublicActivity,
}) => {
  const range = [recurrence.startDate, recurrence.endDate];

  if (!recurrence) {
    return null;
  }

  return (
    <Box pad="xsmall" margin={{ bottom: 'small' }}>
      {!isNotDeletable && (
        <Box
          pad={{ top: 'small' }}
          direction="row"
          justify="center"
          onClick={removeRecurrence}
        >
          <FormTrash style={{ fontSize: 18, cursor: 'pointer' }} />
        </Box>
      )}
      <Box direction="row" justify="around" wrap>
        <Box pad="xsmall">
          <Calendar
            size="small"
            dates={[range]}
            onSelect={handleDateChange}
            firstDayOfWeek={1}
            range
          />
        </Box>
        <Box pad="xsmall" justify="around" flex={{ grow: 0 }} basis="180px">
          <Box pad={segmentPad}>
            <Text size="small">Start time</Text>
            <TimePicker
              value={recurrence.startTime}
              onChange={handleStartTimeChange}
            />
          </Box>
          <Box pad={segmentPad}>
            <Text size="small">Finish time</Text>
            <TimePicker
              value={recurrence.endTime}
              onChange={handleFinishTimeChange}
            />
          </Box>
          {isPublicActivity && (
            <Box pad="xxsmall">
              <Text size="small">Capacity</Text>
              <TextInput
                placeholder="Capacity"
                value={recurrence.capacity}
                onChange={handleCapacityChange}
              />
            </Box>
          )}
        </Box>
      </Box>
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
    {...otherProps}
  />
);

export { TimePicker };

export default DatesAndTimes;
