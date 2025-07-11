import React, { useMemo } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import '../../utils/styles/bigcalendar-custom.css';
import NewEntryHandler from '../../listing/NewEntryHandler';
import NewCalendarActivity from './NewCalendarActivity';

const weekday = require('dayjs/plugin/weekday');

dayjs.extend(weekday);
dayjs().weekday(1);

export default function CalendarView(props) {
  const { activities, resources } = props;
  const [t] = useTranslation('calendar');

  const localizer = useMemo(() => dayjsLocalizer(dayjs), []);

  let culture = 'en-GB';
  if (i18n.language !== 'en') {
    culture = i18n.language;
  }
  dayjs.locale(culture);

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
        defaultDate={dayjs().toDate()}
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
      <NewEntryHandler>
        <NewCalendarActivity resources={resources} />
      </NewEntryHandler>
    </>
  );
}
