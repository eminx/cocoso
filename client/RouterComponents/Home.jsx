import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Radio, Alert, Spin, Button, Divider, Select } from 'antd/lib';
const Option = Select.Option;
import BigCalendar from 'react-big-calendar';
import Nodal from '../UIComponents/Nodal';
import CalendarView from '../UIComponents/CalendarView';
import moment from 'moment';

class Home extends React.Component {
	state = {
		mode: 'list',
		goto: null,
    calendarFilter: "Show All"
	}

	handleModeChange = (e) => {
    const mode = e.target.value;
    this.setState({ mode });
  }

  onSelect = (gathering, e) => {
  	this.setState({
  		goto: gathering._id
  	});
  }

  handleCalendarFilterChange = (value) => {
    this.setState({
      calendarFilter: value
    });
  }

  render() {
    const { isLoading, placesList } = this.props;
  	const gatherings = this.props.gatheringsList;
  	const images = this.props.imagesArray;
  	const { mode, goto, calendarFilter } = this.state;

    let futureEvents = [];

    let filteredBookings = gatherings;

    if (calendarFilter !== "Show All") {
      filteredBookings = gatherings.filter(booking => booking.room === calendarFilter);
    }

  	if (goto) {
      return <Redirect to={`/booking/${goto}`} />
    }

    return (
    	<div style={{padding: 24}}>
        <Row gutter={32}>
          <div style={{justifyContent: 'center', display: 'flex', marginBottom: 50}}>
            <div style={{maxWidth: 900}}>
              <h2 style={{textAlign: 'center'}}>Calendar</h2>

              <Select
                size="large"
                defaultValue="Show All"
                onChange={this.handleCalendarFilterChange}
                style={{ width: 240 }}
              >
                <Option key="Show All">Show all</Option>
                {placesList.map((room) => (
                  <Option key={room.name}>{room.name}</Option>
                ))}
              </Select>

              <CalendarView
                gatherings={filteredBookings}
                images={images} 
                onSelect={this.onSelect}
              />
            </div>
          </div>
        </Row>
        <Row gutter={32}>
          <Col xs={24} sm={24} md={12}>
            <div style={{marginBottom: 50}}>
              <h2 style={{textAlign: 'center'}}>Book Skogen</h2>

              <Alert
                title="<About></About>"
                message="With this application you're able to book certain resources at the Skogen facility and view bookings done by other members"
                type="info"
              />
            </div>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <div style={{marginBottom: 50}}>
              <h2 style={{textAlign: 'center'}}>Current bookings</h2>
              {
                isLoading
                ? 
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Spin size="large" />
                  </div>
                :
                  <div>
    			    			<Nodal 
    		    					push={this.props.history.push}
    		    					images={this.props.imagesArray}
    		    					gatherings={gatherings}
    		    				/>
                  </div>
      				}
            </div>
    			</Col>
    		</Row>
      </div>
    )
  }
}

export default Home;