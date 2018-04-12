import React from 'react';
import BigCalendar from 'react-big-calendar';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

let CalendarView = props => {

  const { gatherings } = props;

  return (
    <div>
      <BigCalendar
        onSelectEvent={props.onSelect}
        events={gatherings}
        defaultView="week"
        timeslots={4}
        views={['week']}
        popupOffset={{x: 0, y: 200}}
      />
    </div>
  )
}

export default CalendarView;
