import React from 'react';
import moment from 'moment';

const getInitials = string => {
  var names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const sectionStyle = {
  marginTop: 12,
  paddingTop: 12,
  paddingRright: 12,
  fontStyle: 'italic',
  textAlign: 'right',
  whiteSpace: 'pre-line'
};

function CardArticle({ item, currentUser }) {
  const getEventTimes = event => {
    if (event) {
      if (event.isMultipleDay || event.isFullDay) {
        return (
          moment(event.startDate).format('Do MMM') +
          ' ' +
          event.startTime +
          ' – ' +
          moment(event.endDate).format('Do MMM') +
          ' ' +
          event.endTime
        );
      } else if (event.startTime) {
        return `${event.startTime}–${event.endTime} ${moment(
          event.startDate
        ).format('Do MMMM')}`;
      } else {
        return '';
      }
    }
  };

  return (
    <div>
      <div style={{ paddingBottom: 12 }}>
        <img width="100%" height="100%" alt={item.title} src={item.imageUrl} />
      </div>

      <div
        style={{
          whiteSpace: 'pre-line',
          color: 'rgba(0,0,0, .85)'
        }}
        dangerouslySetInnerHTML={{
          __html: item.longDescription
        }}
      />

      {item.practicalInfo && item.practicalInfo.length > 0 && (
        <div style={{ ...sectionStyle, textAlign: 'left' }}>
          <h4>Practical information:</h4>
          <div>{item.practicalInfo}</div>
        </div>
      )}

      {currentUser &&
        currentUser.isRegisteredMember &&
        item &&
        item.internalInfo && (
          <div style={{ ...sectionStyle, textAlign: 'left' }}>
            <h4>Internal information for members:</h4>
            <p>{item.internalInfo}</p>
          </div>
        )}

      <div style={sectionStyle}>
        <div>
          {item.room && item.room + ', '}
          {item.place}
        </div>
        <div>{item.address}</div>
      </div>
    </div>
  );
}

export default CardArticle;
