import React from 'react';
import PropTypes from 'prop-types';

import { ChatteryBubble } from './ChatteryBubble';

class ChatteryWindow extends React.Component {
  constructor(props) {
    super(props);
    this.chatWindow = React.createRef();
  }

  componentDidMount() {
    this.scrollBottom();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.scrollBottom();
  }

  scrollBottom = () => {
    const chatWindow = this.chatWindow.current;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  render() {
    const { removeNotification } = this.props;
    return (
      <div className="chattery-window-container" data-oid="ctfx__d">
        <div className="chattery-window" ref={this.chatWindow} data-oid="ke1ebqd">
          {this.props.messages?.map((message, index) => (
            <ChatteryBubble
              key={message.content.substring(0, 2) + index}
              createdDate={message.createdDate}
              senderUsername={message.senderUsername}
              isSeen={Boolean(message.isSeen)}
              isFromMe={message.isFromMe}
              removeNotification={() => removeNotification(index)}
              data-oid="im66efb"
            >
              {message.content}
            </ChatteryBubble>
          ))}
        </div>
      </div>
    );
  }
}

ChatteryWindow.propTypes = {
  messages: PropTypes.array.isRequired,
  meta: PropTypes.object,
};

export { ChatteryWindow };
