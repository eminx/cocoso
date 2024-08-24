import React, { useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../utils/styles/bigcalendar-custom.css';

console.log(i18n);
dayjs.locale(i18n.language, {
  week: {
    dow: 1, // Monday is the first day of the week.
  },
});

const localizer = dayjsLocalizer(dayjs);

function CalendarView(props) {
  const { activities } = props;
  const [t] = useTranslation('calendar');

  // useEffect(() => {
  //   dayjs.locale(i18n?.language, {
  //     week: {
  //       dow: 1, // Monday is the first day of the week.
  //     },
  //   });
  // }, []);

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
    showMore: (total) => t('bigCal.showMore', { total }),
  };

  require('dayjs/locale/en');
  require('dayjs/locale/sv');
  require('dayjs/locale/tr');

  return (
    <Calendar
      allDayAccessor="isMultipleDay"
      culture={i18n.language}
      defaultView="month"
      events={activities}
      localizer={localizer}
      messages={messages}
      popup
      popupOffset={30}
      selectable
      showMultiDayTimes
      step={60}
      views={['month', 'week', 'day', 'agenda']}
      eventPropGetter={(event) => ({
        style: { backgroundColor: event.resourceColor },
      })}
      onSelectEvent={props.onSelect}
      onSelectSlot={props.onSelectSlot}
    />
  );
}

export default CalendarView;
