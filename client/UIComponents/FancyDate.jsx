import React from 'react';
import moment from 'moment';

const fancyDateStyle = {
  color: '#030303',
  fontWeight: 700,
  lineHeight: 1,
  paddingRight: 12
};

const DateJust = ({ children, ...otherProps }) => {
  return (
    <div {...otherProps}>
      <div style={{ ...fancyDateStyle, fontSize: 24 }}>
        {moment(children).format('DD')}
      </div>
      <div style={{ ...fancyDateStyle, fontSize: 15 }}>
        {moment(children)
          .format('MMM')
          .toUpperCase()}
      </div>
    </div>
  );
};

const FancyDate = ({ occurence, places }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div style={{ flexGrow: 1 }}>
      {occurence.startDate === occurence.endDate ? (
        <DateJust>{occurence.startDate}</DateJust>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DateJust>{occurence.startDate}</DateJust>
          {' – '}
          <DateJust style={{ paddingLeft: 12 }}>{occurence.endDate}</DateJust>
        </div>
      )}
    </div>
    <div
      style={{
        ...fancyDateStyle,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}
    >
      <div>
        {occurence.startTime} – {occurence.endTime}
      </div>
      {places && (
        <div
          style={{
            fontWeight: 300,
            maxWidth: 120,
            marginTop: 12,
            textAlign: 'right'
          }}
        >
          <em>
            {places.map(place => place.name).includes(occurence.room)
              ? occurence.room + ', Skogen'
              : occurence.room}
          </em>
        </div>
      )}
    </div>
  </div>
);

export default FancyDate;
