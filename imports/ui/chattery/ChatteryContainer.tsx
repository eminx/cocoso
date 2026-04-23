import React from 'react';

import type { Message } from '/imports/ui/types';

import ChatteryWindow from './ChatteryWindow';
import ChatteryInput from './ChatteryInput';
import './chattery.css';

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
      {withInput ? <ChatteryInput onNewMessage={onNewMessage} /> : null}
    </div>
  );
}
