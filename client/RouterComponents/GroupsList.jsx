import React from 'react';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import { Menu, Row, Col, List, Card, Spin, Divider, Avatar } from 'antd/lib';
import colors from '../constants/colors';

const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;
const ListItem = List.Item;
const { Meta } = Card;

const getInitials = (string) => {
  var names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();
  
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

class GroupsList extends React.PureComponent {

	getTitle = (group) => {
		return (
			<div>
				<h1>{group.title}</h1>
				<h3 style={{fontWeight: 300}}><em>reading: <b>{group.readingMaterial}</b></em></h3>
			</div>
		)
	}

	getExtra = (group) => {
		return (
			<div>
				<b>{group.members.length + ' / ' + group.capacity}</b> 
				<br />
				created by {group.authorName}
			</div>
		)	
	}

	render() {
		const { isLoading, currentUser, groupsData } = this.props;

		if (isLoading) {
			return (
				<div style={{display: 'flex', justifyContent: 'center'}}>
          <Spin size="large" />
        </div>
			)
		}

		return (
			<Row gutter={24}>
				<Col md={8}>
					

        </Col>

        <Col md={14}>
					<List 
						dataSource={groupsData}
						renderItem={group => 
							<ListItem style={{paddingBottom: 0}}>
								<Link to={`/group/${group._id}`} style={{width: '100%'}}>
									<Card
						        title={this.getTitle(group)}
						        bordered
						        hoverable
						        extra={this.getExtra(group)}
						        style={{width: '100%', marginBottom: 0}}
						      >
						        <Meta
						          description={group.description}
						        />
						      </Card>
						    </Link>
							</ListItem>
						}
					/>
				</Col>

				<Col md={16}>
				</Col>
			</Row>
		)
	}
}

export default GroupsList;