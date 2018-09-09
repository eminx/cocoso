import React from 'react';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, List, Spin } from 'antd/lib';
import colors from '../constants/colors';

class GroupsList extends React.Component {
	state = {

	}

	render() {
		const { isLoading, currentUser, places, groups } = this.props;

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
					<List 
						dataSource={places}
						renderItem={place => 
							<List.Item>
								{place.name}
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