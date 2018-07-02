import React from 'react';
import PropTypes from 'prop-types';

import './chattery.css';

import { ChatteryWindow } from './ChatteryWindow';
import { ChatteryInput } from './ChatteryInput';

class Chattery extends React.Component {
	render() {
		const { messages, onNewMessage, meta } = this.props;

		return (
			<div className="chattery-main-container">
				<ChatteryWindow 
					messages={messages}
					meta={meta || null}
				/>
				<ChatteryInput onNewMessage={onNewMessage} />
			</div>
		)
	}
}

Chattery.propTypes = {
	messages: PropTypes.array.isRequired,
	onNewMessage: PropTypes.func.isRequired,
	meta: PropTypes.object
}

export { Chattery };