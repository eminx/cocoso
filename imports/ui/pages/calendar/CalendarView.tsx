import { Meteor } from 'meteor/meteor';
import React, { useMemo } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';

if (Meteor.isClient) {
  import('react-big-calendar/lib/css/react-big-calendar.css');
}
import { canCreateContentAtom, renderedAtom } from '/imports/state';
import { Box, Button, Flex, Heading, IconButton, Text } from '/imports/ui/core';
import NewEntryHandler from '/imports/ui/forms/NewEntryHandler';

import NewCalendarActivity from './NewCalendarActivity';

const weekday = require('dayjs/plugin/weekday');

dayjs.extend(weekday);
dayjs().weekday(1);

interface CalendarActivity {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  isMultipleDay?: boolean;
  resourceColor?: string;
}

interface Resource {
  _id: string;
  label: string;
  isBookable?: boolean;
}

interface CalendarViewProps {
  activities: CalendarActivity[];
  resources: Resource[];
  onSelect: (activity: CalendarActivity, e: React.SyntheticEvent) => void;
  onSelectSlot: (slotInfo: any) => void;
  onRangeChange: (range: Date[] | { start: Date; end: Date }) => void;
}

function Toolbar({ date, label, localizer, views, onNavigate, onView }) {
  const { messages } = localizer;

  return (
    <Flex align="center" justify="space-between" p="4" w="100%" wrap="wrap">
      <Flex align="center" w="250px">
        <IconButton
          aria-label={messages?.previous}
          icon={<ChevronLeft />}
          size="sm"
          variant="ghost"
          onClick={() => onNavigate('PREV')}
        />
        <Button
          aria-label={messages?.today}
          size="sm"
          variant="ghost"
          onClick={() => onNavigate('TODAY')}
        >
          {messages?.today}
        </Button>
        <IconButton
          aria-label={messages?.next}
          icon={<ChevronRight />}
          size="sm"
          variant="ghost"
          onClick={() => onNavigate('NEXT')}
        />
      </Flex>
      <Box>
        <Heading size="md">{label}</Heading>
      </Box>
      <Flex w="250px">
        <Button size="xs" variant="ghost" onClick={() => onView('month')}>
          Month
        </Button>
        <Button size="xs" variant="ghost" onClick={() => onView('week')}>
          Week
        </Button>
        <Button size="xs" variant="ghost" onClick={() => onView('day')}>
          Day
        </Button>
        <Button size="xs" variant="ghost" onClick={() => onView('agenda')}>
          Agenda
        </Button>
      </Flex>
    </Flex>
  );
}

export default function CalendarView({
  activities,
  resources,
  onSelect,
  onSelectSlot,
  onRangeChange,
}: CalendarViewProps) {
  const [t] = useTranslation('calendar');
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const rendered = useAtomValue(renderedAtom);
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
    showMore: (total: number) => t('bigCal.showMore', { total }),
  };

  return (
    <>
      <Calendar
        allDayAccessor="isMultipleDay"
        components={{
          toolbar: Toolbar,
        }}
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
        onSelectEvent={onSelect}
        onSelectSlot={onSelectSlot}
        onRangeChange={onRangeChange}
      />

      {rendered && canCreateContent ? (
        <NewEntryHandler context="calendar">
          <NewCalendarActivity resources={resources} />
        </NewEntryHandler>
      ) : null}
    </>
  );
}
