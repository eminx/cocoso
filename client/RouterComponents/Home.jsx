import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Radio, Alert, Spin, Button, Divider } from 'antd/lib';
import BigCalendar from 'react-big-calendar';
import Nodal from '../UIComponents/Nodal';
import CalendarView from '../UIComponents/CalendarView';
import moment from 'moment';

class Home extends React.Component {
	state = {
		mode: 'list',
		goto: null,
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

  render() {
    const { isLoading, placesList } = this.props;
  	const gatherings = this.props.gatheringsList;
  	const images = this.props.imagesArray;
  	const { mode, goto } = this.state;

    let futureEvents = [];

    // gatherings.forEach((event) => {
    //   if (moment(event).isAfter('2010-10-19')) {
    //     console.log('xxx');
    //   }
    // });

  	if (goto) {
      return <Redirect to={`/booking/${goto}`} />
    }

    return (
    	<div style={{padding: 24}}>
        <Row gutter={32}>
          <div style={{justifyContent: 'center', display: 'flex', marginBottom: 50}}>
            <div style={{maxWidth: 900}}>
              <h2 style={{textAlign: 'center'}}>Calendar</h2>
              <CalendarView
                gatherings={gatherings}
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