import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import NewActivity from './NewActivity';
import { parseAllBookingsWithResources } from '../../utils/shared';
import Resources from '../../../api/resources/resource';
import Activities from '../../../api/activities/activity';
import Processes from '../../../api/processes/process';

const NewActivityContainer = withTracker((props) => {
  const resourcesSub = Meteor.subscribe('resources');
  const resources = Resources ? Resources.find().fetch() : null;
  const activitiesSub = Meteor.subscribe('activities');
  const activities = Activities ? Activities.find().fetch() : null;
  const processesSub = Meteor.subscribe('processes');
  const processes = Processes ? Processes.find().fetch() : null;
  // const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  const allBookings = parseAllBookingsWithResources(activities, processes, resources);

  const isLoading = !activitiesSub.ready() || !resourcesSub.ready() || !processesSub.ready();

  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');

  if (!allBookings) {
    return null;
  }

  return {
    allBookings,
    currentUser,
    history: props.history,
    resources,
    t,
    tc,
    isLoading,
  };
})(NewActivity);

export default NewActivityContainer;
