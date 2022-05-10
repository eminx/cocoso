import React from 'react';
import PropTypes from 'prop-types';

import './chattery.css';

import ChatteryWindow from './ChatteryWindow';
import ChatteryInput from './ChatteryInput';

const noMemberText = 'If you want to participate to the discussion, please join the process.';

function Chattery({ messages, onNewMessage, removeNotification, isMember, meta }) {
  return (
    <div className="chattery-main-container">
      <ChatteryWindow
        messages={messages}
        meta={meta || null}
        removeNotification={removeNotification}
      />
      {isMember ? (
        <ChatteryInput onNewMessage={onNewMessage} />
      ) : (
        <p style={{ padding: 24, textAlign: 'center' }}>{noMemberText}</p>
      )}
    </div>
  );
}

/* eslint-disable react/forbid-prop-types */
Chattery.propTypes = {
  messages: PropTypes.array.isRequired,
  onNewMessage: PropTypes.func.isRequired,
  meta: PropTypes.object,
};
/* eslint-enable react/forbid-prop-types */

export default Chattery;
