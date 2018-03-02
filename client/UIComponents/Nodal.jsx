import React from 'react';
import { List, Avatar, Icon, Card, Radio, Button } from 'antd/lib';
import { Link } from 'react-router-dom';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/sv';
BigCalendar.momentLocalizer(moment);

const avatarSrc = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';

function sortDates(a,b) {
	return a.start - b.start;
}

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const footerIcons = [
	<IconText type="star-o" text="156" />, 
	<IconText type="like-o" text="156" />, 
	<IconText type="message" text="2" />
];


class Nodal extends React.Component { 

	state= {
	}

  render() {

  	const rsvpButton = <Button>Read more</Button>;

  	const { gatherings, images } = this.props;
	  const gatheringsSorted = gatherings.sort(sortDates);

	  return (
	  	<div>

       	<List
			    itemLayout="vertical"
			    size="large"
			    dataSource={gatheringsSorted}
			    renderItem={(item, i) => (
			    	<Card>
				      <List.Item
				        key={item.title + i}
				        actions={[<Link to={`/gathering/${item._id}`}>{rsvpButton}</Link>]}
				        extra={<img width={272} alt="image" src={item.imageUrl} />}
				      >
				        <List.Item.Meta
				          avatar={<Avatar src={avatarSrc} />}
				          title={<Link to={`/gathering/${item._id}`}>{item.title}</Link>}
				          description={item.shortDescription}
				        />
				        {item.longDescription}
				      </List.Item>
			      </Card>
			    )}
			  />
	    </div>
    )
	}
}

export default Nodal;