import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../@/styles/bigcalendar-custom.css';

moment.locale('en-GB', {
  week: {
    dow: 1, //Monday is the first day of the week.
  },
});

const localizer = momentLocalizer(moment);

function CalendarView(props) {
  const { activities } = props;

  const [ t, i18n ] = useTranslation('calendar');
  const messages = {
    allDay: t('bigCal.allDay'),
    previous: t('bigCal.previous'),
    next: t('bigCal.next'),
    today: t('bigCal.today'),
    month: t('bigCal.month'),
    week: t('bigCal.week'),
    day: t('bigCal.day'),
    agenda: t('bigCal.agenda'),  
    date: t('bigCal.date'),
    time: t('bigCal.time'),
    event: t('bigCal.event'),
    noEventsInRange: t('bigCal.noEventsInRange'),
    showMore: total => t('bigCal.showMore', { total }),
  }

  // import locale from node_modules
  require('moment/locale/sv')

  return (
    <div>
      <Calendar
        localizer={localizer}
        culture={i18n.language}
        messages={messages}
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
