import React from 'react';
import { List, Avatar, Icon, Card, Radio } from 'antd';
import CalendarView from './CalendarView';

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

const pagination = {
  pageSize: 10,
  current: 1,
  total: listData.length,
  onChange: (() => {}),
};

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

  render(){

  	const { gatherings } = this.props;
  	const { mode } = this.state;

	  return (
	  	<div>

	  		<Radio.Group onChange={this.handleModeChange} value={mode} style={{ marginBottom: 8 }}>
          <Radio.Button value="calendar">Calendar</Radio.Button>
          <Radio.Button value="list">List</Radio.Button>
        </Radio.Group>

	  		{	mode === 'calendar' ?
	  			<CalendarView gatherings={gatherings} /> :

	       	<List
				    itemLayout="vertical"
				    size="large"
				    pagination={pagination}
				    dataSource={gatherings}
				    renderItem={item => (
				    	<Card>
					      <List.Item
					        key={item.title}
					        actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
					        extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
					      >
					        <List.Item.Meta
					          avatar={<Avatar src={listData[0].avatar} />}
					          title={<a href={item.title}>{item.title}</a>}
					          description={item.shortDescription}
					        />
					        {item.longDescription}
					      </List.Item>
				      </Card>
				    )}
				  />
				}
	    </div>
    )
	}
}

export default Nodal;