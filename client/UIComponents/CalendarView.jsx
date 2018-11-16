import React from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import { Icon } from 'antd';

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

const CalendarView = props => {
  const { bookings } = props;

  return (
    <div>
      <BigCalendar
        eventPropGetter={event => ({
          className: 'category-' + event.roomIndex
        })}
        onSelectEvent={props.onSelect}
        events={bookings}
        defaultView="month"
        showMultiDayTimes
        step={60}
        views={['month', 'week', 'day', 'agenda']}
        popup
        popupOffset={30}
        allDayAccessor="isMultipleDay"
        // components={{
        //   toolbar: CalendarToolbar
        // }}
      />
    </div>
  );
};

export default CalendarView;

class CalendarToolbar extends React.Component {
  static propTypes = {
    view: PropTypes.string.isRequired,
    views: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.node.isRequired,
    localizer: PropTypes.object,
    onNavigate: PropTypes.func.isRequired
    // onView: PropTypes.func.isRequired
  };

  render() {
    let {
      localizer: { messages },
      label
    } = this.props;

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">{this.viewNamesGroup(messages)}</span>

        <span
          className="rbc-toolbar-label"
          style={{ textTransform: 'uppercase', color: '#ea3924' }}
        >
          {label}
        </span>

        <span className="rbc-btn-group">
          <a onClick={this.navigate.bind(null, navigate.TODAY)}>
            {messages.today}
          </a>
          <a onClick={this.navigate.bind(null, navigate.PREVIOUS)}>
            <Icon
              // theme="outlined"
              type="double-left"
              style={{ fontSize: 24, cursor: 'pointer' }}
            />
          </a>
          <a onClick={this.navigate.bind(null, navigate.NEXT)}>
            <Icon
              // theme="outlined"
              type="double-right"
              style={{ fontSize: 24, cursor: 'pointer' }}
            />
          </a>
        </span>
      </div>
    );
  }

  navigate = action => {
    this.props.onNavigate(action);
  };

  view = view => {
    this.props.onView(view);
  };

  viewNamesGroup(messages) {
    let viewNames = this.props.views;
    const view = this.props.view;

    if (viewNames.length > 1) {
      return viewNames.map(name => (
        <a
          type="button"
          key={name}
          className={cn({ 'rbc-active': view === name })}
          onClick={this.view.bind(null, name)}
        >
          {messages[name]}
        </a>
      ));
    }
  }
}
