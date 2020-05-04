import React from 'react';
import moment from 'moment';
import { Row, List } from 'antd/lib';
import Loader from '../UIComponents/Loader';
import PublicActivityThumb from '../UIComponents/PublicActivityThumb';
import { Box } from 'grommet';

const ListItem = List.Item;

const yesterday = moment(new Date()).add(-1, 'days');

const getFirstFutureOccurence = occurence =>
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
    isUploading: false
  };

  getPublicActivities = () => {
    const { bookingsList } = this.props;
    if (!bookingsList) {
      return null;
    }

    const publicActivities = bookingsList.filter(
      activity => activity.isPublicActivity === true
    );

    const futurePublicActivities = publicActivities.filter(activity =>
      activity.datesAndTimes.some(date =>
        moment(date.endDate).isAfter(yesterday)
      )
    );

    return futurePublicActivities;
  };

  parseOnlyAllowedGroups = futureGroups => {
    const { currentUser } = this.props;

    const futureGroupsAllowed = futureGroups.filter(group => {
      if (!group.isPrivate) {
        return true;
      } else {
        if (!currentUser) {
          return false;
        }
        const currentUserId = currentUser._id;
        return (
          group.adminId === currentUserId ||
          group.members.some(member => member.memberId === currentUserId) ||
          group.peopleInvited.some(
            person => person.email === currentUser.emails[0].address
          )
        );
      }
    });

    return futureGroupsAllowed;
  };

  getGroupMeetings = () => {
    const { groupsList } = this.props;
    if (!groupsList) {
      return null;
    }

    const futureGroups = groupsList.filter(group =>
      group.meetings.some(meeting =>
        moment(meeting.startDate).isAfter(yesterday)
      )
    );

    const futureGroupsWithAccessFilter = this.parseOnlyAllowedGroups(
      futureGroups
    );

    return futureGroupsWithAccessFilter.map(group => ({
      ...group,
      datesAndTimes: group.meetings,
      isGroup: true
    }));
  };

  getAllSorted = () => {
    const allActitivities = [
      ...this.getPublicActivities(),
      ...this.getGroupMeetings()
    ];
    return allActitivities.sort(compareForSort);
  };

  render() {
    const { isLoading } = this.props;

    const allSortedActivities = this.getAllSorted();

    return (
      <Box
        // justify="center"
        // direction="row"
        width="100%"
        margin={{ bottom: '50px' }}
        pad="medium"
      >
        {isLoading ? (
          <Loader />
        ) : (
          <Box direction="row" wrap justify="center">
            {allSortedActivities.map(activity => (
              <PublicActivityThumb key={activity.title} item={activity} />
            ))}
          </Box>
        )}
      </Box>
    );
  }
}

export default Home;
