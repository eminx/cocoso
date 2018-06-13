import React from 'react';
import BigCalendar from 'react-big-calendar';
import { removeSpace } from '../functions';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

let CalendarView = props => {
  const { gatherings } = props;

  return (
    <div>
      <BigCalendar
        eventPropGetter={event => ({className: 'category-' + event.roomIndex})}
        onSelectEvent={props.onSelect}
        events={gatherings}
        defaultView="month"
        showMultiDayTimes
        step={60}
        views={['month', 'week', 'day', 'agenda']}
        popupOffset={{x: 0, y: 200}}
      />
    </div>
  )
}

export default CalendarView;
