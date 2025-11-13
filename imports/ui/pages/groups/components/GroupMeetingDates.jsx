import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useSetAtom } from 'jotai';

import {
  Accordion,
  Box,
  Button,
  Center,
  Flex,
  Link,
  List,
  ListItem,
  Modal,
  Text,
} from '/imports/ui/core';

import FancyDate from '/imports/ui/entry/FancyDate';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';
import ActionButton from '/imports/ui/generic/ActionButton';

import { groupAtom } from '../GroupItemHandler';

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
  const setGroup = useSetAtom(groupAtom);
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
      const groupId = groupId;
      try {
        await call(
          'removeAttendance',
          activityId,
          0,
          meetingAttendee.email,
          meetingAttendee.lastName
        );
        setGroup(await call('getGroupWithMeetings', groupId));
        setRegButtonDisabled(false);
        message.success(t('meeting.attends.remove'));
        onClose();
      } catch (error) {
        message.error(error.error || error.reason);
      }
    } else {
      try {
        await call('registerAttendance', activityId, meetingAttendee);
        setGroup(await call('getGroupWithMeetings', groupId));
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
      const groupId = group?._id;
      setGroup(await call('getGroupWithMeetings', groupId));
      setDelButtonDisabled(false);
      message.success(t('meeting.success.remove'));
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
              <Text color="gray.50" fontSize="sm" mr="2" mt="-1px">
                {t('labels.next_meeting')}
              </Text>

              <Text color="gray.50" fontSize="sm" fontWeight="bold">
                {dayjs(group.meetings[0]?.startDate).format('DD')}{' '}
                {dayjs(group.meetings[0]?.startDate).format('MMM')}
              </Text>
            </Flex>
          </Center>
          <Center py="1">
            {!isMember && (
              <Link
                color="theme.200"
                variant="outline"
                onClick={() => setModalOpen(true)}
              >
                {t('labels.meeting_dates')}
              </Link>
            )}
          </Center>
        </Box>
      </Center>

      <Modal
        hideFooter
        id="group-meeting-dates"
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
