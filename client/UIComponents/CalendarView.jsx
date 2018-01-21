import React from 'react';
import BigCalendar from 'react-big-calendar';
import events from './events';
import moment from 'moment';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

let CalendarView = props => {

  const { gatherings } = props;

  return (
    <div>
      <BigCalendar
        onSelectEvent={props.onSelect}
        events={gatherings}
        defaultView="week"
        views={['week', 'day', 'agenda']}
      />
    </div>
  )
}

export default CalendarView;
