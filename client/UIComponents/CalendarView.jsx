import React from 'react';
import BigCalendar from 'react-big-calendar';
import events from './events';
import moment from 'moment';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

let CalendarView = props => {

  const { gatherings } = props;

  gatherings.forEach(gather => {
    gather.start = moment(gather.startDate + gather.startTime, 'YYYY-MM-DD HH:mm');
    gather.end = moment(gather.startDate + gather.startTime, 'YYYY-MM-DD HH:mm');
    gather.allDay = true;
    console.log(gatherings);
  });

  return (
    <div>
      <BigCalendar
      	{...props}
        events={gatherings}
        defaultView="week"
        culture="se"
        views={['week', 'day', 'agenda']}
        defaultDate={new Date(2015, 3, 1)}
      />
    </div>
  )
}

export default CalendarView;
