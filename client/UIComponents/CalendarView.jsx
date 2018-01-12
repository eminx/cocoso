import React from 'react';

import BigCalendar from 'react-big-calendar';
import events from './events';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

let CalendarView = props => (
  <div>
    <BigCalendar
    	{...props}
      events={events}
      views={allViews}
      step={60}
      defaultDate={new Date(2015, 3, 1)}
    />
  </div>
)

export default CalendarView;
