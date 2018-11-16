import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { Row, Col, Alert, Tag, Modal } from 'antd/lib';
import { PulseLoader } from 'react-spinners';
import CalendarView from '../UIComponents/CalendarView';
import colors from '../constants/colors';

const yesterday = moment(new Date()).add(-1, 'days');

class Home extends React.Component {
  state = {
    mode: 'list',
    goto: null,
    calendarFilter: 'All rooms',
    modal: null
  };

  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };

  handleSelect = (booking, e) => {
    Modal.info({
      title: booking.title,
      content: (
        <div>
          <Row>
            <Col span={12}>booked by: </Col>
            <Col span={12}>
              <b>{booking.authorName}</b>
            </Col>
          </Row>
          <Row>
            <Col span={12}>space/equipment: </Col>
            <Col span={12}>
              <b>{booking.room}</b>
            </Col>
          </Row>
          <Row>
            <Col span={12}>information:</Col>
            <Col span={12}>
              <b>{booking.longDescription}</b>
            </Col>
          </Row>
        </div>
      ),
      okType: 'secondary'
    });
  };

  handleCalendarFilterChange = value => {
    this.setState({
      calendarFilter: value
    });
  };

  handleCloseModal = () => {
    this.setState({
      modal: null
    });
  };

  handleGotoBooking = () => {
    this.setState({
      goto: this.state.modal._id
    });
  };

  getBookingTimes = booking => {
    if (booking) {
      if (booking.isMultipleDay || booking.isFullDay) {
        return (
          moment(booking.startDate).format('Do MMM') +
          ' ' +
          booking.startTime +
          ' – ' +
          moment(booking.endDate).format('Do MMM') +
          ' ' +
          booking.endTime
        );
      } else if (booking.startTime) {
        return `${booking.startTime}–${booking.endTime} ${moment(
          booking.startDate
        ).format('Do MMMM')}`;
      } else {
        return '';
      }
    }
  };

  render() {
    const { isLoading, placesList } = this.props;
    const bookings = this.props.bookingsList;
    const images = this.props.imagesArray;
    const { mode, goto, modal, calendarFilter } = this.state;

    const futureBookings = [];

    bookings.filter(booking => {
      if (moment(booking.endDate).isAfter(yesterday)) {
        futureBookings.push(booking);
      }
    });

    let filteredBookings = bookings;

    if (calendarFilter !== 'All rooms') {
      filteredBookings = bookings.filter(
        booking => booking.room === calendarFilter
      );
    }

    if (goto) {
      return <Redirect to={`/booking/${goto}`} />;
    }

    const modalStyle = {
      width: 80
    };

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={32}>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              marginBottom: 50
            }}
          >
            <div style={{ maxWidth: 900, width: '100%' }}>
              <h2 style={{ textAlign: 'center' }}>Bookings Calendar</h2>
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <PulseLoader />
                </div>
              ) : (
                <CalendarView
                  bookings={filteredBookings}
                  images={images}
                  onSelect={this.handleSelect}
                />
              )}
            </div>
          </div>
        </Row>
        <Row gutter={32}>
          <Col xs={24} sm={24} md={12}>
            <div style={{ marginBottom: 50 }}>
              <h2 style={{ textAlign: 'center' }}>Book Skogen</h2>

              <Alert
                message="With this application you're able to book certain resources at the Skogen facility and view bookings done by other members"
                type="info"
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
