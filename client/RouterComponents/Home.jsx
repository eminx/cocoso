import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { Row, Col, Alert, Tag, Modal } from 'antd/lib';
import { PulseLoader } from 'react-spinners';
import BookingsList from '../UIComponents/BookingsList';
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
    this.setState({
      modal: booking
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

  render() {
    const { isLoading, placesList } = this.props;
    const gatherings = this.props.gatheringsList;
    const images = this.props.imagesArray;
    const { mode, goto, modal, calendarFilter } = this.state;

    const futureBookings = [];

    gatherings.filter(gathering => {
      if (moment(gathering.endDate).isAfter(yesterday)) {
        futureBookings.push(gathering);
      }
    });

    let filteredBookings = gatherings;

    if (calendarFilter !== 'All rooms') {
      filteredBookings = gatherings.filter(
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
              <CalendarView
                gatherings={filteredBookings}
                images={images}
                onSelect={this.handleSelect}
              />
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

          <Col xs={24} sm={24} md={12}>
            <div style={{ marginBottom: 50 }}>
              <h2 style={{ textAlign: 'center' }}>Current bookings</h2>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <PulseLoader loading />
                </div>
              ) : (
                <div>
                  <BookingsList
                    push={this.props.history.push}
                    images={this.props.imagesArray}
                    gatherings={futureBookings}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>

        {modal && (
          <Modal
            title={modal.title}
            visible
            onOk={this.handleGotoBooking}
            onCancel={this.handleCloseModal}
            okText="to Booking page"
            cancelText="Close"
          >
            <div>
              <Row>
                <Col span={8}>booked by: </Col>
                <Col span={8}>
                  <b>{modal.authorName}</b>
                </Col>
              </Row>
              <Row>
                <Col span={8}>space/equipment: </Col>
                <Col span={8}>
                  <b>{modal.room}</b>
                </Col>
              </Row>
              <Row>
                <Col span={8}>information:</Col>
                <Col span={8}>
                  <b>{modal.longDescription}</b>
                </Col>
              </Row>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default Home;
