import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import FancyDate from '../../../components/FancyDate';
import Modal from '../../../components/Modal';
import RsvpContent from './RsvpContent';

if (Meteor.isClient) {
  import 'react-table/react-table.css';
}

const sexyBorder = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'brand.500',
  color: 'brand.800',
};

function AccordionDates({ activity, onCloseModal }) {
  const [t] = useTranslation('activities');

  if (!activity) {
    return null;
  }

  return (
    <Box>
      <Text mb="2" mt="4" size="sm" textAlign="center">
        {t('public.register.disabled.false')}
      </Text>
      <Accordion allowToggle>
        {activity?.datesAndTimes?.map(
          (occurrence, occurrenceIndex) =>
            occurrence && (
              <AccordionItem key={occurrence.startDate + occurrence.startTime} mb="4">
                <AccordionButton
                  _hover={{ bg: 'brand.50' }}
                  _expanded={{ bg: 'brand.500', color: 'white' }}
                  {...sexyBorder}
                >
                  <Box flex="1" textAlign="left">
                    <FancyDate occurrence={occurrence} />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel {...sexyBorder} bg="brand.50">
                  <Text m="2" fontWeight="bold">
                    {t('public.register.label')}
                  </Text>
                  <Box px="2">
                    <RsvpContent
                      activity={activity}
                      occurrence={occurrence}
                      occurrenceIndex={occurrenceIndex}
                      onCloseModal={onCloseModal}
                    />
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            )
        )}
      </Accordion>
    </Box>
  );
}

export default function RsvpHandler({ activity }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('activities');

  if (!activity) {
    return null;
  }

  if ((activity && activity.isRegistrationDisabled) || !activity.isPublicActivity) {
    return (
      <div>
        {activity?.isRegistrationDisabled && (
          <Text mb="2" size="sm" textAlign="center">
            {t('public.register.disabled.true')}
          </Text>
        )}
        {activity?.datesAndTimes.map((occurrence) => (
          <Box
            key={occurrence.startDate + occurrence.startTime}
            {...sexyBorder}
            color="brand.800"
            p="2"
            mb="4"
          >
            <FancyDate occurrence={occurrence} />
          </Box>
        ))}
      </div>
    );
  }

  return (
    <>
      <Center>
        <Button
          borderColor="green.200"
          borderWidth="2px"
          colorScheme="green"
          height="48px"
          size="lg"
          width="240px"
          onClick={() => setModalOpen(true)}
        >
          {t('label.rsvp')}
        </Button>
      </Center>

      <Modal
        isOpen={modalOpen}
        size="lg"
        title={t('public.register.label')}
        onCancel={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      >
        <AccordionDates activity={activity} onCloseModal={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
