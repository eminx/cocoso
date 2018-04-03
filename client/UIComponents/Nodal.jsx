import React from 'react';
import { List, Avatar, Icon, Card, Radio, Button } from 'antd/lib';
import { Link } from 'react-router-dom';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/en-gb';
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

function shortenDescription(str) {
    return str.split(/\s+/).slice(0,20).join(" ");
}

class Nodal extends React.Component { 

	state= {
	}

  render() {
  	const readMoreButton = <Button>Read more</Button>;
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
				        actions={[<Link to={`/event/${item._id}`}>{readMoreButton}</Link>]}
				        extra={<Link to={`/event/${item._id}`}><img height={180} alt="image" src={item.imageUrl} style={{marginBottom: 24}} /></Link>}
				      >
				        <List.Item.Meta
				          avatar={<Avatar src={avatarSrc} />}
				          title={<Link to={`/event/${item._id}`}>{item.title}</Link>}
				          description={item.shortDescription}
				        />
				        {shortenDescription(item.longDescription) + '...'}
				      </List.Item>
			      </Card>
			    )}
			  />
	    </div>
    )
	}
}

export default Nodal;