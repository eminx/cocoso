import { withTracker } from 'meteor/react-meteor-data';
import ActivitiesList from './Activities';
import Processes from '../../../api/processes/process';

export default ActivitiesContainer = withTracker((props) => {
  const processesSubscription = Meteor.subscribe('processes');
  const processesList = Processes ? Processes.find().fetch() : null;

  const activities = Meteor.subscribe('activities', true);
  const isLoading = !activities.ready();
  const activitiesList = Activities ? Activities.find().fetch() : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    activitiesList,
    currentUser,
    processesList,
  };
})(ActivitiesList);
