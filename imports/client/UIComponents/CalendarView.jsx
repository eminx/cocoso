import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../custom-styles/bigcalendar-custom.css';

moment.locale('en-GB', {
  week: {
    dow: 1, //Monday is the first day of the week.
  },
});

const localizer = momentLocalizer(moment);

function CalendarView(props) {
  const { activities } = props;

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={activities}
        eventPropGetter={(event) => ({
          // className: 'category-' + event.resourceIndex,
          style: { backgroundColor: event.resourceColor },
        })}
        onSelectEvent={props.onSelect}
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
