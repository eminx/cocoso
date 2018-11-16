import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { Row, Col, Alert, Tag, Button, Modal } from 'antd/lib';
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
    const { currentUser } = this.props;

    Modal.info({
      title: (
        <div>
          <h2>{booking.title}</h2> <h4>{this.getBookingTimes(booking)}</h4>
        </div>
      ),
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

          {currentUser && currentUser.username === booking.authorName && (
            <div style={{ position: 'absolute', bottom: 24, right: 96 }}>
              <a href={`/edit-booking/${booking._id}`}>
                <Button>Edit</Button>
              </a>
            </div>
          )}
        </div>
      ),
      okType: 'secondary',
      closable: true
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
                  <PulseLoader color="#ea3924" />
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
      </div>
    );
  }
}

export default Home;
