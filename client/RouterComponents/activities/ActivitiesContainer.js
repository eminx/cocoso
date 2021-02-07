import { withTracker } from 'meteor/react-meteor-data';
import ActivitiesList from './Activities';

export default ActivitiesContainer = withTracker((props) => {
  // here we can pull out the props.subID and change our Meteor subscription based on it
  // this is handled on the publication side of things

  // const handle = Meteor.subscribe('myDataSub', props.subID);

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
