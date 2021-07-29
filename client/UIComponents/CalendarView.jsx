import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/en-gb';
BigCalendar.momentLocalizer(moment);

function CalendarView(props) {
  const { activities } = props;

  return (
    <div>
      <BigCalendar
        eventPropGetter={(event) => ({
          className: 'category-' + event.resourceIndex,
        })}
        onSelectEvent={props.onSelect}
        events={activities}
        defaultView="month"
        showMultiDayTimes
        step={60}
        views={['month', 'week', 'day', 'agenda']}
        popup
        popupOffset={30}
        allDayAccessor="isMultipleDay"
      />
    </div>
  );
}

export default CalendarView;
