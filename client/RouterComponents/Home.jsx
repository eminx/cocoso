import React from 'react';
import moment from 'moment';
import { Row } from 'antd/lib';
import Loader from '../UIComponents/Loader';
import PublicActivityThumb from '../UIComponents/PublicActivityThumb';

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

    return futureGroups.map(group => ({
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
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              marginBottom: 50
            }}
          >
            <div style={{ width: '100%' }}>
              {isLoading ? (
                <Loader />
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {allSortedActivities.map(activity => (
                    <PublicActivityThumb key={activity.title} item={activity} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Row>
      </div>
    );
  }
}

export default Home;
