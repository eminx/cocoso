import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { Accordion, Box, Center, Flex, Modal, Text } from '/imports/ui/core';
import FancyDate from '/imports/ui/entry/FancyDate';
import ActionButton from '/imports/ui/generic/ActionButton';

import OccurrenceRsvpContent from './OccurrenceRsvpContent';

const buttonStyle = {
  backgroundColor: 'var(--cocoso-colors-theme-100)',
  borderRadius: 'var(--cocoso-border-radius)',
  color: 'var(--cocoso-colors-gray-900)',
  margin: '0.5rem 0',
  padding: '1rem',
  width: '100%',
};

function AccordionDates({ activity, onCloseModal }) {
  const [t] = useTranslation('activities');

  if (!activity) {
    return null;
  }

  if (!activity.datesAndTimes || activity.datesAndTimes.length < 1) {
    return null;
  }

  const isRegistrationEnabled =
    activity.isRegistrationEnabled || activity.isRegistrationDisabled === false;

  const items = [...activity.datesAndTimes];

  if (!isRegistrationEnabled) {
    return (
      <Box>
        <Text mb="2" mt="4" size="sm" textAlign="center">
          {t('public.register.disabled.true')}
        </Text>

        <Box>
          {items.map((occurrence, occurrenceIndex) => (
            <Box
              key={
                occurrence.startDate + occurrence.startTime + occurrenceIndex
              }
              style={buttonStyle}
            >
              <FancyDate occurrence={occurrence} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {items.length > 1 && (
        <Text mb="2" mt="4" size="sm" textAlign="center">
          {t('public.register.disabled.false')}
        </Text>
      )}
      <Accordion
        options={items.map((occurrence, occurrenceIndex) => ({
          key: occurrence.startDate + occurrence.startTime + occurrenceIndex,
          header: <FancyDate occurrence={occurrence} />,
          content: (
            <Box>
              <Text fontWeight="bold">{t('public.register.label')}</Text>
              <Box>
                <OccurrenceRsvpContent
                  activity={activity}
                  occurrence={occurrence}
                  occurrenceIndex={occurrenceIndex}
                  onCloseModal={onCloseModal}
                />
              </Box>
            </Box>
          ),
        }))}
      />
    </Box>
  );
}

function SubInfo({ occurrence }) {
  const [t] = useTranslation('activities');

  if (!occurrence) {
    return null;
  }

  return (
    <Center>
      <Flex mt="2">
        <Text color="gray.100" mr="2" mt="-1px" size="sm">
          {t('label.next')}
        </Text>

        <Text color="gray.100" fontWeight="bold" size="sm">
          {dayjs(occurrence?.startDate).format('DD')}{' '}
          {dayjs(occurrence?.startDate).format('MMM')}
        </Text>
      </Flex>
    </Center>
  );
}

export default function RsvpHandler({ activity }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('activities');

  if (!activity) {
    return null;
  }

  const isRegistrationEnabled =
    activity.isRegistrationEnabled || activity.isRegistrationDisabled === false;

  const today = new Date().toISOString().substring(0, 10);
  const nextEvent = activity.datesAndTimes?.find((d) => d.startDate > today);

  return (
    <>
      <Box>
        <Center>
          <ActionButton
            label={
              isRegistrationEnabled
                ? t('public.labels.datesAndRegistration')
                : t('public.labels.dates')
            }
            onClick={() => setModalOpen(true)}
          />
        </Center>

        <SubInfo occurrence={nextEvent} />
      </Box>

      <Modal
        hideFooter
        id="rsvp-handler"
        open={modalOpen}
        size="lg"
        title={
          isRegistrationEnabled
            ? t('public.labels.datesAndRegistration')
            : t('public.labels.dates')
        }
        onClose={() => setModalOpen(false)}
      >
        <AccordionDates
          activity={activity}
          onCloseModal={() => setModalOpen(false)}
        />
      </Modal>
    </>
  );
}
