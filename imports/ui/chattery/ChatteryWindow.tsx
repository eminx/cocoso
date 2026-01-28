import React, { useEffect, useRef } from 'react';

import ChatteryBubble from './ChatteryBubble';
import type { Message } from '/imports/ui/types';

interface ChatteryWindowProps {
  messages: Message[];
  removeNotification: (index: number) => void;
}

const ChatteryWindow: React.FC<ChatteryWindowProps> = ({ messages, removeNotification }) => {
  const chatWindow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindow.current) {
      chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chattery-window-container">
      <div className="chattery-window" ref={chatWindow}>
        {messages?.map((message, index) => (
          <ChatteryBubble
            key={message.content + message.createdDate}
            createdDate={message.createdDate}
            senderUsername={message.senderUsername}
            isSeen={Boolean(message.isSeen)}
            isFromMe={message.isFromMe}
            removeNotification={() => removeNotification(index)}
          >
            {message.content}
          </ChatteryBubble>
        ))}
      </div>
    </div>
  );
};

export default ChatteryWindow;
