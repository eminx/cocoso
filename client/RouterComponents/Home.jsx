import React from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import Loader from '../UIComponents/Loader';
import PublicActivityThumb from '../UIComponents/PublicActivityThumb';
import { Box } from 'grommet';

const yesterday = moment(new Date()).add(-1, 'days');

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

class Home extends React.Component {
  state = {
    isUploading: false,
  };

  getPublicActivities = () => {
    const { activitiesList } = this.props;
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

  parseOnlyAllowedProcesses = (futureProcesses) => {
    const { currentUser } = this.props;

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

  getProcessMeetings = () => {
    const { processesList } = this.props;
    if (!processesList) {
      return null;
    }

    const futureProcesses = processesList.filter((process) =>
      process.meetings.some((meeting) =>
        moment(meeting.startDate).isAfter(yesterday)
      )
    );

    const futureProcessesWithAccessFilter = this.parseOnlyAllowedProcesses(
      futureProcesses
    );

    return futureProcessesWithAccessFilter.map((process) => ({
      ...process,
      datesAndTimes: process.meetings,
      isProcess: true,
    }));
  };

  getAllSorted = () => {
    const allActitivities = [
      ...this.getPublicActivities(),
      ...this.getProcessMeetings(),
    ];
    return allActitivities.sort(compareForSort);
  };

  render() {
    const { isLoading, history } = this.props;
    const allSortedActivities = this.getAllSorted();

    return <Redirect to="/market" />;

    return (
      <Box width="100%" margin={{ bottom: '50px' }} pad="medium">
        {isLoading ? (
          <Loader />
        ) : (
          <Box direction="row" wrap justify="center">
            {allSortedActivities.map((activity) => (
              <PublicActivityThumb
                key={activity.title}
                item={activity}
                history={history}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }
}

export default Home;
