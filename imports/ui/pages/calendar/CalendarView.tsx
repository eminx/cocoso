import React, { useMemo } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';

import { canCreateContentAtom, renderedAtom } from '/imports/state';
import {
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Grid,
} from '/imports/ui/core';
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

function Toolbar({ label, view, views, onNavigate, onView }) {
  const [t] = useTranslation('calendar');

  return (
    <Grid
      gap="2"
      p="4"
      w="100%"
      css={{
        gridTemplateColumns: '1fr',
        alignItems: 'center',
        justifyItems: 'center',
        '@media (min-width: 768px)': {
          gridTemplateColumns: '1fr auto 1fr',
          justifyItems: 'initial',
        },
      }}
    >
      <Flex
        align="center"
        css={{
          justifySelf: 'center',
          order: 3,
          '@media (min-width: 768px)': { justifySelf: 'start', order: 0 },
        }}
      >
        <IconButton
          aria-label={t('bigCal.previous', { defaultValue: 'Back' })}
          icon={<ChevronLeft />}
          size="sm"
          variant="ghost"
          onClick={() => onNavigate('PREV')}
        />
        <Button
          aria-label={t('bigCal.today', { defaultValue: 'Today' })}
          size="sm"
          variant="ghost"
          onClick={() => onNavigate('TODAY')}
        >
          {t('bigCal.today', { defaultValue: 'Today' })}
        </Button>
        <IconButton
          aria-label={t('bigCal.next', { defaultValue: 'Next' })}
          icon={<ChevronRight />}
          size="sm"
          variant="ghost"
          onClick={() => onNavigate('NEXT')}
        />
      </Flex>
      <Center
        css={{
          order: 2,
          '@media (min-width: 768px)': { order: 0 },
        }}
      >
        <Heading size="md" textAlign="center">
          {label}
        </Heading>
      </Center>
      <Flex
        align="center"
        css={{
          justifySelf: 'center',
          order: 1,
          '@media (min-width: 768px)': { justifySelf: 'end', order: 0 },
        }}
      >
        {views.map((v: string) => (
          <Button
            key={v}
            size="xs"
            variant={v === view ? 'solid' : 'ghost'}
            css={{ textTransform: 'capitalize' }}
            onClick={() => onView(v)}
          >
            {t(`bigCal.${v}`, { defaultValue: v })}
          </Button>
        ))}
      </Flex>
    </Grid>
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
