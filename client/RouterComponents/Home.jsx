import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { Row, Col, Alert, Tag, Button, Modal } from 'antd/lib';
import { PulseLoader } from 'react-spinners';
import CalendarView from '../UIComponents/CalendarView';
import colors from '../constants/colors';
import PublicActivityThumb from '../UIComponents/PublicActivityThumb';

const compareForSort = (a, b) => {
  const firstOccA = a.datesAndTimes[0];
  const firstOccB = b.datesAndTimes[0];
  const dateA = new Date(
    firstOccA.startDate + 'T' + firstOccA.startTime + ':00Z'
  );
  const dateB = new Date(
    firstOccB.startDate + 'T' + firstOccB.startTime + ':00Z'
  );
  return dateA - dateB;
};

const yesterday = moment(new Date()).add(-1, 'days');

class Home extends React.Component {
  render() {
    const { isLoading, currentUser, bookingsList } = this.props;

    const publicActivities = bookingsList.filter(
      activity => activity.isPublicActivity === true
    );

    const futurePublicActivities = publicActivities.filter(activity =>
      activity.datesAndTimes.some(date =>
        moment(date.endDate).isAfter(yesterday)
      )
    );

    const sortedPublicActivities = futurePublicActivities.sort(compareForSort);

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
            <div style={{ maxWidth: 900, width: '100%' }}>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <PulseLoader color="#ea3924" />
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {sortedPublicActivities.map(activity => (
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
