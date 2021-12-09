import { Meteor } from 'meteor/meteor';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { Box, Button, Center, Wrap, WrapItem } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';
import PublicActivityThumb from '../../UIComponents/PublicActivityThumb';

const publicSettings = Meteor.settings.public;
const yesterday = moment().add(-1, 'days');

const getFirstFutureOccurence = (occurence) =>
  moment(occurence.endDate).isAfter(yesterday);

const compareForSort = (a, b) => {
  const firstOccurenceA = a.datesAndTimes.find(getFirstFutureOccurence);
  const firstOccurenceB = b.datesAndTimes.find(getFirstFutureOccurence);
  const dateA = new Date(
    firstOccurenceA.startDate + 'T' + firstOccurenceA.startTime + ':00Z'
  );
  const dateB = new Date(
    firstOccurenceB.startDate + 'T' + firstOccurenceB.startTime + ':00Z'
  );
  return dateA - dateB;
};

function Activities({ activitiesList, processesList, isLoading, history }) {
  const { currentUser, currentHost, canCreateContent } =
    useContext(StateContext);

  const getPublicActivities = () => {
    if (!activitiesList) {
      return null;
    }

    const publicActivities = activitiesList.filter(
      (activity) => activity.isPublicActivity === true
    );

    const futurePublicActivities = publicActivities.filter((activity) =>
      activity.datesAndTimes.some((date) =>
        moment(date.endDate).isAfter(yesterday)
      )
    );

    return futurePublicActivities;
  };

  const getProcessMeetings = () => {
    if (!processesList) {
      return null;
    }

    const futureProcesses = processesList.filter((process) =>
      process.meetings.some((meeting) =>
        moment(meeting.startDate).isAfter(yesterday)
      )
    );

    const futureProcessesWithAccessFilter =
      parseOnlyAllowedProcesses(futureProcesses);

    return futureProcessesWithAccessFilter.map((process) => ({
      ...process,
      datesAndTimes: process.meetings,
      isProcess: true,
    }));
  };

  const parseOnlyAllowedProcesses = (futureProcesses) => {
    const futureProcessesAllowed = futureProcesses.filter((process) => {
      if (!process.isPrivate) {
        return true;
      } else {
        if (!currentUser) {
          return false;
        }
        const currentUserId = currentUser._id;
        return (
          process.adminId === currentUserId ||
          process.members.some((member) => member.memberId === currentUserId) ||
          process.peopleInvited.some(
            (person) => person.email === currentUser.emails[0].address
          )
        );
      }
    });

    return futureProcessesAllowed;
  };

  const getAllSorted = () => {
    const allActivities = [...getPublicActivities(), ...getProcessMeetings()];
    return allActivities.sort(compareForSort);
  };

  const allSortedActivities = getAllSorted();

  if (isLoading) {
    return (
      <Box width="100%" mb="50px">
        <Loader />
      </Box>
    );
  }

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`Public Activities | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
      </Helmet>

      <Center mb="3">
        {canCreateContent && (
          <Link to="/new-activity">
            <Button as="span" colorScheme="green" variant="outline">
              NEW
            </Button>
          </Link>
        )}
      </Center>

      <Center>
        <Wrap spacing="3">
          {allSortedActivities.map((activity) => (
            <WrapItem flexBasis="360px" flexGrow={1} key={activity.title}>
              <Link
                to={
                  activity.isProcess
                    ? `/process/${activity._id}`
                    : `/activity/${activity._id}`
                }
              >
                <PublicActivityThumb item={activity} />
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </Center>
    </Box>
  );
}

export default Activities;