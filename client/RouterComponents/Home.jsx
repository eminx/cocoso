import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Radio } from 'antd/lib';
import Nodal from '../UIComponents/Nodal';
import CalendarView from '../UIComponents/CalendarView';

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
    	<div>

    		<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1em'}}>
		  		<Radio.Group onChange={this.handleModeChange} value={mode} style={{ marginBottom: 8 }}>
	          <Radio.Button value="list">List</Radio.Button>
	          <Radio.Button value="calendar">Calendar</Radio.Button>
	        </Radio.Group>
	      </div>

    		<Row>
    			<Col sm={8}>
    				
    			</Col>

    			<Col xs={24} sm={16}>
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