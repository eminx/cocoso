import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Radio, Alert } from 'antd/lib';
import BigCalendar from 'react-big-calendar';
import Nodal from '../UIComponents/Nodal';
import CalendarView from '../UIComponents/CalendarView';

const aboutNoden = "Noden is a place for anyone who has an interest to create, co-create, manage, attend or somehow get engaged in cultural, artistic or perhaps political activities. Besides all, Noden is a place for manifesting who you choose to become, and cherishing what it means to gather together."

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
  	const gatherings = this.props.gatheringsList;
  	const images = this.props.imagesArray;
  	const { mode, goto } = this.state;

  	if (goto) {
      return <Redirect to={`/gathering/${goto}`} />
    }

    return (
    	<div style={{padding: 12}}>
        <Row gutter={32}>
          <Col xs={24} sm={24} md={8}>
            <h2>Welcome to Noden</h2>
          </Col>
          <Col xs={0} sm={0} md={16}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h2>Upcoming activities</h2>
              <Radio.Group onChange={this.handleModeChange} value={mode} style={{ marginBottom: 8 }}>
                <Radio.Button value="list">List</Radio.Button>
                <Radio.Button value="calendar">Calendar</Radio.Button>
              </Radio.Group>
            </div>
          </Col>
        </Row>

        <Row gutter={32}>
          <Col xs={24} sm={24} md={8}>
            <div style={{marginBottom: 24}}>
              <Alert
                message="Shortly about Noden"
                description={aboutNoden}
                type="info"
              />
            </div>
            <Col xs={0} sm={0} md={24}>
              <h3>Weekly agenda</h3>
              <BigCalendar
                onSelectEvent={this.onSelect}
                events={gatherings}
                defaultView="agenda"
                views={['agenda']}
              />
            </Col>
          </Col>

          <Col xs={24} sm={24} md={16}>
    				{
    					mode === 'calendar'
    					?
	    					<CalendarView
		    					gatherings={gatherings}
		    					images={images} 
		    					onSelect={this.onSelect}
		    				/>
		    			:
			    			<Nodal 
		    					push={this.props.history.push}
		    					images={this.props.imagesArray}
		    					gatherings={this.props.gatheringsList}
		    				/>
    				}
    			</Col>
    		</Row>
      </div>
    )
  }
}

export default Home;