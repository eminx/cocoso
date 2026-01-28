import React from 'react';
import dayjs from 'dayjs';
import VisibilitySensor from 'react-visibility-sensor';

interface ChatteryBubbleProps {
  senderUsername: string;
  createdDate: Date;
  isFromMe: boolean;
  children: React.ReactNode;
  removeNotification: () => void;
}

const parseDate = (theDate: Date): string => {
  const isToday = dayjs(theDate).isSame(dayjs(), 'd');
  const isYesterday = dayjs(theDate).isSame(dayjs().add(-1, 'days'), 'd');
  const isThisYear = dayjs(theDate).isSame(dayjs(), 'y');

  if (isToday) {
    return dayjs(theDate).format('[Today,] HH:mm');
  } else if (isYesterday) {
    return dayjs(theDate).format('[Yesterday,] HH:mm');
  } else if (isThisYear) {
    return dayjs(theDate).format('ddd, D MMM, [at] HH:mm');
  }
  return dayjs(theDate).format("D MMM [']YY, [at] HH:mm");
};

class ChatteryBubble extends React.Component<ChatteryBubbleProps> {
  componentDidMount() {
    const { isFromMe } = this.props;
    if (!isFromMe) {
      this.removeNotification();
    }
  }

  removeNotification = (isVisible?: boolean) => {
    const { isFromMe, removeNotification } = this.props;
    if (isVisible && !isFromMe) {
      removeNotification();
    }
  };

  render() {
    const { senderUsername, createdDate, isFromMe, children } = this.props;
    let bubbleClass = 'talk-bubble tri-right round ';
    let bubbleClassContainer = 'talk-bubble-container ';
    if (isFromMe) {
      bubbleClass += 'right-in';
      bubbleClassContainer += 'right-in';
    } else {
      bubbleClass += 'left-in';
      bubbleClassContainer += 'left-in';
    }

    return (
      <div className={bubbleClassContainer}>
        <VisibilitySensor
          partialVisibility="bottom"
          onChange={this.removeNotification}
        >
          {() => (
            <div className={bubbleClass}>
              <div className="talktext">
                <p className="talktext-senderinfo">{senderUsername}</p>
                <p className="talktext-content">{children}</p>
                <p className="talktext-dateinfo">{parseDate(createdDate)}</p>
              </div>
            </div>
          )}
        </VisibilitySensor>
      </div>
    );
  }
}

export default ChatteryBubble;
