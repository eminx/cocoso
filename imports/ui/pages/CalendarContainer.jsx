import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import dayjs from 'dayjs';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import Calendar from './Calendar';

dayjs.locale(i18n.language);
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
