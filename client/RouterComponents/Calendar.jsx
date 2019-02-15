import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { Row, Col, Alert, Tag, Button, Modal } from 'antd/lib';
import Loader from '../UIComponents/Loader';
import CalendarView from '../UIComponents/CalendarView';
import colors from '../constants/colors';

const yesterday = moment(new Date()).add(-1, 'days');

class Calendar extends React.PureComponent {
  state = {
    mode: 'list',
    editBooking: null,
    calendarFilter: 'All rooms',
    selectedBooking: null
  };

  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };

  handleSelectBooking = (booking, e) => {
    e.preventDefault();
    this.setState({
      selectedBooking: booking
    });
  };

  handleCalendarFilterChange = value => {
    this.setState({
      calendarFilter: value
    });
  };

  handleCloseModal = () => {
    this.setState({
      selectedBooking: null
    });
  };

  handleEditBooking = () => {
    this.setState({
      editBooking: true
    });
  };

  getBookingTimes = booking => {
    if (!booking) {
      return '';
    }
    if (booking.startDate === booking.endDate) {
      return `${booking.startTime}–${booking.endTime} ${moment(
        booking.startDate
      ).format('DD MMMM')}`;
    }
    return (
      moment(booking.startDate).format('DD MMM') +
      ' ' +
      booking.startTime +
      ' – ' +
      moment(booking.endDate).format('DD MMM') +
      ' ' +
      booking.endTime
    );
  };

  isCreator = () => {
    const { currentUser } = this.props;
    const { selectedBooking } = this.state;

    if (!selectedBooking || !currentUser) {
      return false;
    }

    if (
      selectedBooking &&
      currentUser &&
      currentUser.username === selectedBooking.authorName
    ) {
      return true;
    }
  };

  render() {
    const { isLoading, currentUser, placesList, allActivities } = this.props;
    const { editBooking, calendarFilter, selectedBooking } = this.state;

    const futureBookings = [];

    allActivities.filter(booking => {
      if (moment(booking.endDate).isAfter(yesterday)) {
        futureBookings.push(booking);
      }
    });

    let filteredBookings = allActivities;

    if (calendarFilter !== 'All rooms') {
      filteredBookings = allActivities.filter(
        booking => booking.room === calendarFilter
      );
    }

    if (editBooking) {
      return <Redirect to={`/edit-booking/${selectedBooking._id}`} />;
    }

    const centerStyle = {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 24
    };

    return (
      <div style={{ padding: 24 }}>
        {currentUser && currentUser.isRegisteredMember && (
          <Row gutter={24}>
            <div style={centerStyle}>
              <Link to="/new-booking">
                <Button type="primary">New Booking</Button>
              </Link>
            </div>
          </Row>
        )}

        <Row gutter={24}>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              marginBottom: 50
            }}
          >
            <div style={{ width: '100%' }}>
              <div
                className="tags-container"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <Tag.CheckableTag
                  checked={calendarFilter === 'All rooms'}
                  onChange={() => this.handleCalendarFilterChange('All rooms')}
                  key={'All rooms'}
                >
                  {'All rooms'}
                </Tag.CheckableTag>
                {placesList.map((room, i) => (
                  <Tag
                    color={colors[i]}
                    className={calendarFilter === room.name ? 'checked' : null}
                    onClick={() => this.handleCalendarFilterChange(room.name)}
                    key={room.name}
                  >
                    {room.name}
                  </Tag>
                ))}
              </div>

              {isLoading ? (
                <Loader />
              ) : (
                <CalendarView
                  bookings={filteredBookings}
                  onSelect={this.handleSelectBooking}
                />
              )}
            </div>
          </div>
        </Row>

        <Modal
          visible={Boolean(selectedBooking)}
          okText="Edit"
          cancelText="Close"
          okButtonProps={!this.isCreator() && { style: { display: 'none' } }}
          onOk={this.handleEditBooking}
          onCancel={this.handleCloseModal}
          title={
            <div>
              <h2>{selectedBooking && selectedBooking.title}</h2>{' '}
              <h4>{this.getBookingTimes(selectedBooking)}</h4>
            </div>
          }
          destroyOnClose
        >
          <Row>
            <Col span={12}>booked by: </Col>
            <Col span={12}>
              <b>{selectedBooking && selectedBooking.authorName}</b>
            </Col>
          </Row>
          <Row>
            <Col span={12}>space/equipment: </Col>
            <Col span={12}>
              <b>{selectedBooking && selectedBooking.room}</b>
            </Col>
          </Row>
          <Row style={{ paddingTop: 12 }}>
            <Row span={24}>
              <em>
                {selectedBooking &&
                  selectedBooking.longDescription &&
                  selectedBooking.longDescription.slice(0, 120) + '...'}
              </em>
              {selectedBooking && selectedBooking.isPublicActivity && (
                <Link
                  to={
                    (selectedBooking.isGroup ? '/group/' : '/event/') +
                    selectedBooking._id
                  }
                >
                  {' '}
                  go to the {selectedBooking.isGroup ? 'group ' : 'event '}
                  page
                </Link>
              )}
            </Row>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default Calendar;
