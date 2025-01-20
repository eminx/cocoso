import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import VisibilitySensor from 'react-visibility-sensor';

class ChatteryBubble extends React.Component {
  componentDidMount() {
    const { isFromMe, children } = this.props;
    if (!isFromMe) {
      this.removeNotification;
    }
  }

  parseDate = (theDate) => {
    const isToday = moment(theDate).isSame(moment(), 'd');
    const isYesterday = moment(theDate).isSame(moment().add(-1, 'days'), 'd');
    const isThisYear = moment(theDate).isSame(moment(), 'y');

    if (isToday) {
      return moment(theDate).format('[Today,] HH:mm');
    } else if (isYesterday) {
      return moment(theDate).format('[Yesterday,] HH:mm');
    } else if (isThisYear) {
      return moment(theDate).format('ddd, D MMM, [at] HH:mm');
    }
    return moment(theDate).format("D MMM [']YY, [at] HH:mm");
  };

  removeNotification = (isVisible) => {
    const { isFromMe, removeNotification } = this.props;
    if (isVisible && !isFromMe) {
      removeNotification();
    }
  };

  render() {
    const { senderUsername, createdDate, isFromMe, isSeen, children } = this.props;
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
      <div className={bubbleClassContainer} data-oid="tss5jjj">
        <VisibilitySensor
          partialVisibility="bottom"
          onChange={this.removeNotification}
          data-oid="xfrljq0"
        >
          {({ isVisible }) => (
            <div className={bubbleClass} data-oid="h5fjo57">
              <div className="talktext" data-oid="_9cd_ce">
                <p className="talktext-senderinfo" data-oid="-khw73n">
                  {senderUsername}
                </p>
                <p className="talktext-content" data-oid=":j3hl6y">
                  {children}
                </p>
                <p className="talktext-dateinfo" data-oid=".pawxog">
                  {this.parseDate(createdDate)}
                </p>
              </div>
            </div>
          )}
        </VisibilitySensor>
      </div>
    );
  }
}

ChatteryBubble.propTypes = {
  children: PropTypes.string.isRequired,
  createdDate: PropTypes.instanceOf(Date),
  sender: PropTypes.string,
  isSeen: PropTypes.bool,
};

export { ChatteryBubble };
