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

const yesterday = dayjs(new Date()).add(-1, 'days');
const isFutureMeeting = (meeting) => dayjs(meeting.endDate).isAfter(yesterday);

function MeetingDatesContent({ group, isAdmin }) {
  const [t] = useTranslation('groups');

  if (!group) {
    return null;
  }

  const isFutureMeetings =
    group.meetings?.filter((meeting) => dayjs(meeting.endDate).isAfter(yesterday)).length > 0;

  const getTitle = () => {
    if (!isFutureMeetings) {
      return (
        <Text fontSize="sm" mb="4" textAlign="center">
          {t('meeting.info.empty')}
        </Text>
      );
    } else if (isAdmin) {
      return (
        <Text fontSize="sm" mb="4">
          {t('meeting.info.admin')}
        </Text>
      );
    }
    return (
      <Text fontSize="sm" mb="4">
        {t('meeting.info.member')}
      </Text>
    );
  };

  return (
    <>
      {getTitle()}

      <Accordion allowToggle>
        {group.meetings?.map((meeting) => (
          <AccordionItem
            key={meeting._id}
            mb="4"
            style={{
              display: isFutureMeeting(meeting) ? 'block' : 'none',
            }}
          >
            <AccordionButton
              _hover={{ bg: 'brand.50' }}
              _expanded={{ bg: 'brand.500', color: 'white' }}
              bg="white"
              border="1px solid"
              borderColor="brand.500"
              color="brand.800"
            >
              <Box flex="1" textAlign="left">
                <FancyDate occurrence={meeting} />
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel bg="brand.50" border="1px solid" borderColor="brand.500">
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
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

export default function GroupMeetingDates(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [t] = useTranslation('groups');

  const { group, isMember } = props;

  if (!group) {
    return null;
  }

  return (
    <>
      {group.meetings && (
        <Center color="gray.700" p="1">
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
      )}

      <Modal
        h="80%"
        isCentered
        isOpen={modalOpen}
        title={t('labels.meetings')}
        onCancel={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      >
        <MeetingDatesContent {...props} />
      </Modal>
    </>
  );
}
