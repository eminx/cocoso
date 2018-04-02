import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Radio, Alert, Spin, Button, Divider } from 'antd/lib';
import BigCalendar from 'react-big-calendar';
import Nodal from '../UIComponents/Nodal';
import CalendarView from '../UIComponents/CalendarView';
import moment from 'moment';

const aboutUB = <div>
  <p>
    Wanna host a workshop, performance, jam session, training, meditation or any timely event at the Urban burn in Stockholm? This is made for you!
    Just press create and then fill the form and then once you confirm it, it will automatically be published in this web-app. You can then share the link in your networks to communicate about it.
  </p>
  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
    <Link to="/create"><Button type="primary">Create an Event</Button></Link>
  </div>
</div>;

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
    const { isLoading } = this.props;
  	const gatherings = this.props.gatheringsList;
  	const images = this.props.imagesArray;
  	const { mode, goto } = this.state;

    let futureEvents = [];

    gatherings.forEach((event) => {
      if (moment(event).isAfter('2010-10-19')) {
        console.log('xxx');
      }
    });

  	if (goto) {
      return <Redirect to={`/event/${goto}`} />
    }

    return (
    	<div style={{padding: 24}}>
        <Row gutter={32}>
          <Col xs={24} sm={24} md={8}>
          </Col>
          <Col xs={0} sm={0} md={16}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
            </div>
          </Col>
        </Row>

        <Row gutter={32}>
          <Col xs={24} sm={24} md={8}>
            <div style={{marginBottom: 24}}>
              <Alert
                message="Events at the Urban Burn"
                description={aboutUB}
                type="info"
              />
            </div>
          </Col>

          <Col xs={24} sm={24} md={16}>
            {
              isLoading
              ? 
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <Spin size="large" />
                </div>
              :
                <div>
  	    					<CalendarView
  		    					gatherings={gatherings}
  		    					images={images} 
  		    					onSelect={this.onSelect}
  		    				/>
                  <Divider />
                  <h2 style={{textAlign: 'center'}}>Upcoming activities</h2>
  			    			<Nodal 
  		    					push={this.props.history.push}
  		    					images={this.props.imagesArray}
  		    					gatherings={gatherings}
  		    				/>
                </div>
    				}
    			</Col>
    		</Row>
      </div>
    )
  }
}

export default Home;