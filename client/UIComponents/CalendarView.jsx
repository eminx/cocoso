import React from 'react';
import BigCalendar from 'react-big-calendar';

const CalendarView = (props) => {
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
        // components={{
        //   toolbar: CalendarToolbar
        // }}
      />
    </div>
  );
};

export default CalendarView;
