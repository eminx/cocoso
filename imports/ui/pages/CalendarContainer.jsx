import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import Calendar from './Calendar';

const CalendarContainer = withTracker((props) => {
  const currentUser = Meteor.user();

  return {
    currentUser,
  };
})(Calendar);

export default function (props) {
  const [tc] = useTranslation('common');

  const allProps = {
    ...props,
    tc,
  };

  return <CalendarContainer {...allProps} />;
}
