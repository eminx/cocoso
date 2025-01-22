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
  Flex,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import FancyDate from '../../../components/FancyDate';
import Modal from '../../../components/Modal';
import { accordionProps } from '../../../utils/constants/general';
import { message } from '../../../components/message';
import { call } from '../../../utils/shared';

const { buttonProps, itemProps, panelProps } = accordionProps;

const yesterday = dayjs(new Date()).add(-1, 'days');
const isFutureMeeting = (meeting) => dayjs(meeting.endDate).isAfter(yesterday);

function MeetingDatesContent({ currentUser, group, isAdmin, isMember }) {
  const [t] = useTranslation('groups');

  if (!group) {
    return null;
  }

  console.log(group.meetings);

  const toggleAttendance = async (activityId, meetingIndex) => {
    if (!currentUser) {
      message.error(t('meeting.access.logged'));
      return;
    }
    if (!isMember) {
      message.error(t('meeting.access.join'));
      return;
    }

    if (!group.meetings || group.meetings.length < 1) {
      return;
    }

    const isAttending = group.meetings[meetingIndex].attendees
      ?.map((attendee) => attendee.username)
      ?.includes(currentUser.username);

    const meetingAttendee = {
      email: currentUser.emails[0].address,
      username: currentUser.username,
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      numberOfPeople: 1,
    };

    if (isAttending) {
      try {
        await call(
          'removeAttendance',
          activityId,
          0,
          meetingAttendee.email,
          meetingAttendee.lastName
        );
        message.success(t('meeting.attends.remove'));
      } catch (error) {
        console.log('error', error);
        message.error(error.error);
      }
    } else {
      try {
        await call('registerAttendance', activityId, meetingAttendee);
        message.success(t('meeting.attends.register'));
      } catch (error) {
        console.log('error', error);
        message.error(error.error);
      }
    }
  };

  return (
    <Accordion allowToggle>
      {group.meetings?.map((meeting, meetingIndex) => {
        const isAttending =
          currentUser &&
          meeting.attendees &&
          meeting.attendees.map((attendee) => attendee.username).includes(currentUser.username);

        return (
          <AccordionItem
            key={meeting._id}
            {...itemProps}
            style={{
              display: isFutureMeeting(meeting) ? 'block' : 'none',
            }}
          >
            <AccordionButton {...buttonProps}>
              <Box flex="1" textAlign="left">
                <FancyDate occurrence={meeting} />
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel {...panelProps}>
              {isAdmin ? (
                <Box>
                  <Text fontWeight="bold">{t('labels.attendees')}</Text>
                  <List>
                    {meeting?.attendees?.map(
                      (attendee) =>
                        attendee && (
                          <ListItem key={attendee.username}>
                            <Text as="span" fontWeight="bold">
                              {attendee.username}
                            </Text>
                            {(attendee.firstName || attendee.lastName) && (
                              <Text as="span">
                                `${attendee.firstName} ${attendee.lastName}`
                              </Text>
                            )}
                          </ListItem>
                        )
                    )}
                  </List>

                  <Center py="2" mt="2">
                    <Button
                      size="xs"
                      colorScheme="red"
                      onClick={() => console.log('deleteActivity(meeting._id')}
                    >
                      {t('meeting.actions.remove')}
                    </Button>
                  </Center>
                </Box>
              ) : (
                <Center p="2">
                  <Button
                    size="sm"
                    colorScheme={isAttending ? 'green' : 'brand'}
                    onClick={() => toggleAttendance(meeting._id, meetingIndex)}
                  >
                    {isAttending ? t('meeting.isAttending.false') : t('meeting.isAttending.true')}
                  </Button>
                </Center>
              )}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default function GroupMeetingDates(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');

  const { group, isMember } = props;

  if (!group) {
    return null;
  }

  const isFutureMeetings =
    group.meetings &&
    group.meetings.length > 0 &&
    group.meetings.filter((meeting) => dayjs(meeting.endDate).isAfter(yesterday)).length > 0;

  if (!isFutureMeetings) {
    return (
      <Text color="gray.100" my="4" textAlign="center">
        {t('meeting.info.empty')}
      </Text>
    );
  }

  return (
    <>
      <Center color="gray.100" p="1">
        <Box>
          <Center>
            {isMember && (
              <Button
                bg="white"
                borderColor="green.100"
                borderWidth="2px"
                colorScheme="green"
                height="48px"
                mt="2"
                size="lg"
                variant="outline"
                width="240px"
                onClick={() => setModalOpen(true)}
              >
                {t('actions.register')}
              </Button>
            )}
          </Center>
          <Center>
            <Flex>
              <Text fontSize="sm" mr="2">
                Next meeting:{' '}
              </Text>

              <Text fontSize="sm" fontWeight="bold">
                {dayjs(group.meetings[0]?.startDate).format('DD')}{' '}
                {dayjs(group.meetings[0]?.startDate).format('MMM')}
              </Text>
            </Flex>
          </Center>
          <Center>
            {!isMember && (
              <Button
                colorScheme="blue"
                fontSize="sm"
                variant="link"
                onClick={() => setModalOpen(true)}
              >
                See all meetings
              </Button>
            )}
          </Center>
        </Box>
      </Center>

      <Modal
        h="80%"
        isCentered
        isOpen={modalOpen}
        title={t('labels.meetings')}
        onCancel={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      >
        {isMember && (
          <Text mb="4" textAlign="center">
            {t('meeting.info.member')}
          </Text>
        )}
        <MeetingDatesContent {...props} />
      </Modal>
    </>
  );
}
