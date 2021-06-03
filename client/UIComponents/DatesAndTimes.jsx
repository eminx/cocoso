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
      pad="xsmall"
      margin={{ bottom: 'small' }}
      animation={noAnimate ? null : 'slideUp'}
      background="light-1"
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
              format="yyyy-mm-dd"
              value={recurrence.startDate}
              onChange={({ value }) => {
                handleDateChange(value);
              }}
            />
          </Box>

          {isRange && (
            <Box margin={{ top: 'medium' }}>
              <Text size="small">End Day</Text>
              <DateInput
                format="yyyy-mm-dd"
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
            />
          </Box>
          <Box margin={{ top: 'medium' }}>
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
    dropHeight="small"
    {...otherProps}
  />
);

export { TimePicker };

export default DatesAndTimes;
