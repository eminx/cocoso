import React from 'react';
import dayjs from 'dayjs';

import { Flex } from '/imports/ui/core';

const fancyDateStyle = {
  alignItems: 'flex-end',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: `'Raleway', sans-serif`,
  fontWeight: 'bold',
  justifyContent: 'space-between',
  lineHeight: 0.9,
  width: '100%',
};

const fancyTimeStyle = {
  fontSize: 14,
  paddingTop: 6,
  fontStyle: 'italic',
};

function DateJust({ time, children, ...otherProps }) {
  return (
    <div {...otherProps}>
      <div style={{ ...fancyDateStyle, fontSize: 28 }}>
        {dayjs(children).format('DD')}
      </div>
      <div style={{ ...fancyDateStyle, fontSize: 20 }}>
        {dayjs(children).format('MMM')}
      </div>
      {time && (
        <div style={{ ...fancyDateStyle, ...fancyTimeStyle }}>
          {time}
        </div>
      )}
    </div>
  );
}

function FancyDate({ occurrence, resources, ...otherProps }) {
  if (!occurrence) {
    return null;
  }
  return (
    <>
      <Flex
        justifyContent="space-between"
        mb="1"
        p="1"
        w="100%"
        {...otherProps}
      >
        <div style={{ flexGrow: 1 }}>
          {occurrence.startDate === occurrence.endDate ? (
            <DateJust>{occurrence.startDate}</DateJust>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <DateJust style={{ paddingRight: 12 }}>
                {occurrence.startDate}
              </DateJust>
              {' – '}
              <DateJust style={{ paddingLeft: 12 }}>
                {occurrence.endDate}
              </DateJust>
            </div>
          )}
        </div>
        <div
          style={{
            ...fancyDateStyle,
            fontSize: 18,
            fontStyle: 'italic',
          }}
        >
          <div>
            {occurrence.startTime} – {occurrence.endTime}
          </div>
          {resources && (
            <div
              style={{
                fontWeight: 300,
                maxWidth: 120,
                marginTop: 12,
                textAlign: 'right',
              }}
            >
              <em>
                {resources
                  .map((place) => place.label)
                  .includes(occurrence.resource)
                  ? `${occurrence.resource}`
                  : occurrence.resource}
              </em>
            </div>
          )}
        </div>
      </Flex>
    </>
  );
}

export { DateJust };
export default FancyDate;
