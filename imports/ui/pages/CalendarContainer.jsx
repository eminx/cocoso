import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import { parseAllBookingsWithResources } from '../utils/shared';
import Calendar from './Calendar';

import Resources from '../../api/resources/resource';
import Activities from '../../api/activities/activity';

moment.locale(i18n.language);
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
