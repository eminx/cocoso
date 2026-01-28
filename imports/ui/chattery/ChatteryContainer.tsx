import React from 'react';

import type { Message } from '/imports/ui/types';

import ChatteryWindow from './ChatteryWindow';
import ChatteryInput from './ChatteryInput';
import './chattery.css';

const noMemberText =
  'If you want to participate to the discussion, please join the group.';

interface ChatteryProps {
  messages: Message[];
  withInput: boolean;
  onNewMessage: (message: string) => void;
  removeNotification: () => void;
}

export default function Chattery({
  messages,
  withInput,
  onNewMessage,
  removeNotification,
}: ChatteryProps) {
  return (
    <div className="main-chattery-container">
      <ChatteryWindow
        messages={messages}
        removeNotification={removeNotification}
      />
      {withInput ? (
        <ChatteryInput onNewMessage={onNewMessage} />
      ) : (
        <p style={{ padding: 24, textAlign: 'center' }}>{noMemberText}</p>
      )}
    </div>
  );
}
