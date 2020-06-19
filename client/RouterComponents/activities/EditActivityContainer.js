import { withTracker } from 'meteor/react-meteor-data';
import EditActivity from './EditActivity';

export default EditActivityContainer = withTracker((props) => {
  const gatheringId = props.match.params.id;
  const gathering = Meteor.subscribe('gathering', gatheringId);
  const resourcesSub = Meteor.subscribe('resources');
  const resources = Resources ? Resources.find().fetch() : null;
  const gatheringData = Activities
    ? Activities.findOne({ _id: gatheringId })
    : null;
  const currentUser = Meteor.user();
  const isLoading = !gathering.ready() || resourcesSub.ready();

  return {
    isLoading,
    gatheringData,
    currentUser,
    resources,
  };
})(EditActivity);
