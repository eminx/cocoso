import { withTracker } from 'meteor/react-meteor-data';
import NewActivity from './NewActivity.jsx';
import { parseActsWithResources } from '../../functions';

export default NewActivityContainer = withTracker((props) => {
  const resourcesSub = Meteor.subscribe('resources');
  const resources = Resources ? Resources.find().fetch() : null;
  const activitiesSub = Meteor.subscribe('activities');
  const activitiesList = Activities ? Activities.find().fetch() : null;
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  const allOccurences = parseActsWithResources(activitiesList, resources);

  return {
    allOccurences,
    currentUser,
    resources,
  };
})(NewActivity);
