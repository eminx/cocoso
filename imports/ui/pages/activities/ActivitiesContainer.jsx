import { withTracker } from 'meteor/react-meteor-data';
import ActivitiesList from './Activities';

import Activities from '../../../api/activities/activity';

export default ActivitiesContainer = withTracker((props) => {
  const activities = Meteor.subscribe('activities', true);
  const isLoading = !activities.ready();
  const activitiesList = Activities ? Activities.find().fetch() : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    activitiesList,
    currentUser,
  };
})(ActivitiesList);
