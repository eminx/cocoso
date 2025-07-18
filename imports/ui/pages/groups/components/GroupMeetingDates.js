import React, { useContext, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import {
  Accordion,
  Box,
  Button,
  Center,
  Flex,
  Modal,
  List,
  ListItem,
  Text,
} from '/imports/ui/core';

import FancyDate from '/imports/ui/entry/FancyDate';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/ui/utils/shared';
import ActionButton from '/imports/ui/generic/ActionButton';

import { GroupContext } from '../Group';

const yesterday = dayjs(new Date()).add(-1, 'days');
const isFutureMeeting = (meeting) => dayjs(meeting.endDate).isAfter(yesterday);

function MeetingDatesContent({
  currentUser,
  group,
  isAdmin,
  isMember,
  onClose,
}) {
  const [regButtonDisabled, setRegButtonDisabled] = useState(false);
  const [delButtonDisabled, setDelButtonDisabled] = useState(false);
  const { getGroupById } = useContext(GroupContext);
  const [t] = useTranslation('groups');

  if (!group) {
    return null;
  }

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

    setRegButtonDisabled(true);

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
        await getGroupById();
        setRegButtonDisabled(false);
        message.success(t('meeting.attends.remove'));
        onClose();
      } catch (error) {
        message.error(error.error || error.reason);
      }
    } else {
      try {
        await call('registerAttendance', activityId, meetingAttendee);
        await getGroupById();
        setRegButtonDisabled(false);
        message.success(t('meeting.attends.register'));
        onClose();
      } catch (error) {
        message.error(error.error || error.reason);
      }
    }
  };

  const deleteActivity = async (activityId) => {
    if (!isAdmin) {
      message.error(t('meeting.access.remove'));
      return;
    }

    setDelButtonDisabled(true);

    try {
      await call('deleteActivity', activityId);
      message.success(t('meeting.success.remove'));
      getGroupById();
      setDelButtonDisabled(false);
    } catch (error) {
      message.error(error.error);
    }
  };

  const getAccordionOptions = () => {
    return group.meetings
      ?.filter((m) => isFutureMeeting(m))
      .map((meeting, meetingIndex) => {
        const isAttending =
          currentUser &&
          meeting.attendees &&
          meeting.attendees
            .map((attendee) => attendee.username)
            .includes(currentUser.username);
        return {
          key: meeting._id,
          header: <FancyDate occurrence={meeting} />,
          content: isAdmin ? (
            <Box>
              <Text fontWeight="bold" mt="1">
                {t('labels.attendees')}
              </Text>
              <List>
                {meeting?.attendees?.map(
                  (attendee) =>
                    attendee && (
                      <ListItem key={attendee.username} mt="2">
                        <Text as="span" fontWeight="bold">
                          {attendee.username}
                        </Text>
                        {(attendee.firstName || attendee.lastName) && (
                          <Text as="span">{` (${attendee.firstName} ${attendee.lastName})`}</Text>
                        )}
                      </ListItem>
                    )
                )}
              </List>

              <Center py="2" mt="2">
                <Button
                  colorScheme="red"
                  loading={delButtonDisabled}
                  size="xs"
                  variant="outline"
                  onClick={() => deleteActivity(meeting.meetingId)}
                >
                  {t('meeting.actions.remove')}
                </Button>
              </Center>
            </Box>
          ) : (
            <Center p="2">
              <Button
                size="sm"
                colorScheme={isAttending ? 'red' : 'green'}
                loading={regButtonDisabled}
                onClick={() =>
                  toggleAttendance(meeting.meetingId, meetingIndex)
                }
              >
                {isAttending
                  ? t('meeting.isAttending.false')
                  : t('meeting.isAttending.true')}
              </Button>
            </Center>
          ),
        };
      });
  };

  return <Accordion options={getAccordionOptions()} />;
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
    group.meetings.filter((meeting) =>
      dayjs(meeting.endDate).isAfter(yesterday)
    ).length > 0;

  if (!isFutureMeetings) {
    return (
      <Text color="gray.100" my="2" textAlign="center">
        {t('meeting.info.empty')}
      </Text>
    );
  }

  return (
    <>
      <Center color="gray.100">
        <Box>
          <Center>
            {isMember && (
              <ActionButton
                label={t('actions.register')}
                onClick={() => setModalOpen(true)}
              />
            )}
          </Center>
          <Center>
            <Flex mt="2">
              <Text fontSize="sm" mr="2" mt="-1px">
                {t('labels.next_meeting')}
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
                color="brand.50"
                fontSize="sm"
                variant="link"
                onClick={() => setModalOpen(true)}
              >
                {t('labels.meeting_dates')}
              </Button>
            )}
          </Center>
        </Box>
      </Center>

      <Modal
        hideFooter
        open={modalOpen}
        title={t('labels.meetings')}
        onClose={() => setModalOpen(false)}
      >
        {isMember && (
          <Text mb="4" textAlign="center">
            {t('meeting.info.member')}
          </Text>
        )}
        <MeetingDatesContent {...props} onClose={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
