import { withTracker } from 'meteor/react-meteor-data';
import Gathering from './Gathering';
 
export default GatheringContainer = withTracker((props) => {
  const gatheringId = props.match.params.id;
  const gathering = Meteor.subscribe('gathering', gatheringId);
  Meteor.subscribe('attendingEvents');
  const isLoading = !gathering.ready();
  const theGathering = Gatherings ? Gatherings.findOne({_id:gatheringId}) : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    gathering,
    theGathering,
    currentUser
  };
})(Gathering);