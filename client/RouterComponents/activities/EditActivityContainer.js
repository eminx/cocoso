import { withTracker } from 'meteor/react-meteor-data';
import EditActivity from './EditActivity';

export default EditActivityContainer = withTracker((props) => {
  const activityId = props.match.params.id;
  const activitySub = Meteor.subscribeLite('activity', activityId);
  const resourcesSub = Meteor.subscribeLite('resources');
  const resources = Resources ? Resources.find().fetch() : null;
  const activity = Activities ? Activities.findOne({ _id: activityId }) : null;
  const currentUser = Meteor.user();
  const isLoading = !activitySub.ready() || !resourcesSub.ready();

  return {
    isLoading,
    activity,
    currentUser,
    resources,
  };
})(EditActivity);
