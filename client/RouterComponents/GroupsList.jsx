import React from 'react';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import { Menu, Row, Col, List, Spin, Divider } from 'antd/lib';
import colors from '../constants/colors';

const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;


class GroupsList extends React.Component {
	state = {

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
					<Menu>
	          <MenuItemGroup key="g1" title="My Groups">
	            <MenuItem key="1">Group 1</MenuItem>
	            <MenuItem key="2">Group 2</MenuItem>
	          </MenuItemGroup>

	          <MenuItemGroup key="g2" title="Other Groups">
	            <MenuItem key="3">Group 3</MenuItem>
	            <MenuItem key="4">Group 4</MenuItem>
	          </MenuItemGroup>
	        </Menu>

        </Col>

        <Col md={14}>
					<List 
						dataSource={groupsData}
						renderItem={group => 
							<List.Item>
								{group.title}
								{group.description}
							</List.Item>
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