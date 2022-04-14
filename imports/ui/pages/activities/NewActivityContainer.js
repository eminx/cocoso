import { withTracker } from 'meteor/react-meteor-data';
import NewActivity from './NewActivity';
import { parseAllBookingsWithResources, parseComboResourcesWithAllData } from '../../@/shared';
import Resources from '../../../api/resources/resource';
import Activities from '../../../api/activities/activity'; 
import Processes from '../../../api/processes/process'; 
import { useTranslation } from 'react-i18next';

export default NewActivityContainer = withTracker((props) => {
  const resourcesSub = Meteor.subscribe('resources');
  const resources = Resources ? Resources.find().fetch() : null;
  const activitiesSub = Meteor.subscribe('activities');
  const activities = Activities ? Activities.find().fetch() : null;
  const processesSub = Meteor.subscribe('processes');
  const processes = Processes ? Processes.find().fetch() : null;
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  const resourcesWithComboParsed = resources && parseComboResourcesWithAllData(resources);
  const allBookings = resourcesWithComboParsed && processes && activities && parseAllBookingsWithResources(activities, processes, resourcesWithComboParsed);

  const isLoading =
    !activitiesSub.ready() || !resourcesSub.ready() || !processesSub.ready();

  const [ t ] = useTranslation('activities');
  const [ tc ] = useTranslation('common');

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
