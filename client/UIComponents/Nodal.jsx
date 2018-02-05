import React from 'react';
import { List, Avatar, Icon, Card, Radio } from 'antd/lib';
import CalendarView from './CalendarView';
import { Link } from 'react-router-dom';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/sv';
BigCalendar.momentLocalizer(moment);

const listData = [];
for (let i = 0; i < 5; i++) {
  listData.push({
    href: 'http://ant.design',
    title: `ant design part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}

function sortDates(a,b) {
	return a.start - b.start;
}

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class Nodal extends React.Component { 
	state = {
		mode: 'list'
	}

	handleModeChange = (e) => {
    const mode = e.target.value;
    this.setState({ mode });
  }

  onSelect = (gathering, e) => {
  	this.props.push(`/gathering/${gathering._id}`);
  }

  render(){

  	const { gatherings, images } = this.props;
	  const gatheringsSorted = gatherings.sort(sortDates);
  	const { mode } = this.state;

  	console.log(images);
	  return (
	  	<div>
	  		
	  		<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1em'}}>
		  		<Radio.Group onChange={this.handleModeChange} value={mode} style={{ marginBottom: 8 }}>
	          <Radio.Button value="list">List</Radio.Button>
	          <Radio.Button value="calendar">Calendar</Radio.Button>
	        </Radio.Group>
	      </div>

	  		{	mode === 'calendar'
		  		?
		  			<CalendarView gatherings={gatherings} images={images} onSelect={this.onSelect} />
		  		:
		       	<List
					    itemLayout="vertical"
					    size="large"
					    dataSource={gatheringsSorted}
					    renderItem={item => {
					    	const img = images.filter(img => img.gatheringId === item._id);
					    	return (
						    	<Card>
							      <List.Item
							        key={item.title}
							        actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
							        extra={<img width={272} alt="logo" src={img ? img.uploadurl : ""} />}
							      >
							        <List.Item.Meta
							          avatar={<Avatar src={listData[0].avatar} />}
							          title={<Link to={`/gathering/${item._id}`}>{item.title}</Link>}
							          description={item.shortDescription}
							        />
							        {item.longDescription}
							      </List.Item>
						      </Card>
						    )
						  }}
					  />
				}
	    </div>
    )
	}
}

export default Nodal;