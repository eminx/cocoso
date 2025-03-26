import React, { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../utils/styles/bigcalendar-custom.css';
import NewEntryHandler from '../../listing/NewEntryHandler';
import NewCalendarActivity from './NewCalendarActivity';

export default function CalendarView(props) {
  const { activities, resources } = props;
  const [t] = useTranslation('calendar');

  const localizer = useMemo(() => momentLocalizer(moment), []);

  let culture = 'en-GB';
  if (i18n.language !== 'en') {
    culture = i18n.language;
  }

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

  return (
    <>
      <Calendar
        allDayAccessor="isMultipleDay"
        culture={culture}
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
      <NewEntryHandler title="Create a new activity">
        <NewCalendarActivity resources={resources} />
      </NewEntryHandler>
    </>
  );
}
