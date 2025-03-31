import { Meteor } from 'meteor/meteor';
import React from 'react';

import ChatteryWindow from './ChatteryWindow';
import ChatteryInput from './ChatteryInput';

if (Meteor.isClient) {
  import './chattery.css';
}

const noMemberText = 'If you want to participate to the discussion, please join the group.';

export default function Chattery({ messages, withInput, onNewMessage, removeNotification }) {
  return (
    <div className="main-chattery-container">
      <ChatteryWindow messages={messages} removeNotification={removeNotification} />
      {withInput ? (
        <ChatteryInput onNewMessage={onNewMessage} />
      ) : (
        <p style={{ padding: 24, textAlign: 'center' }}>{noMemberText}</p>
      )}
    </div>
  );
}
