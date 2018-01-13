import React from 'react';
import BigCalendar from 'react-big-calendar';
import events from './events';

// Monday is the first day of the week
// moment.lang('sv', { week : { dow : 1 } });
// moment.updateLocale('sv', { weekdaysShort : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] });

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

let CalendarView = props => (
  <div>
    <BigCalendar
    	{...props}
      events={events}
      defaultView="week"
      culture="se"
      views={['week', 'day', 'agenda']}
      defaultDate={new Date(2015, 3, 1)}
    />
  </div>
)

export default CalendarView;
