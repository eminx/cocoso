import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import { parseAllBookingsWithResources } from '../utils/shared';
import Calendar from './Calendar';

import Processes from '../../api/processes/process';
import Resources from '../../api/resources/resource';
import Activities from '../../api/activities/activity';

moment.locale(i18n.language);
const CalendarContainer = withTracker((props) => {
  const activitiesSub = Meteor.subscribe('activities');
  const activities = Activities ? Activities.find().fetch() : null;
  const resourcesSub = Meteor.subscribe('resources');
  const resources = Resources ? Resources.find().fetch() : null;
  const processesSub = Meteor.subscribe('processes');
  const processes = Processes ? Processes.find().fetch() : null;

  const allBookings = parseAllBookingsWithResources(activities, processes, resources);

  const currentUser = Meteor.user();
  const isLoading = !activitiesSub.ready() || !resourcesSub.ready() || !processesSub.ready();

  const [tc] = useTranslation('common');

  return {
    allBookings,
    currentUser,
    resources,
    isLoading,
    tc,
  };
})(Calendar);

export default CalendarContainer;
