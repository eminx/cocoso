import { withTracker } from 'meteor/react-meteor-data';
import Gathering from './Gathering';
 
export default GatheringContainer = withTracker((props) => {
  const gatheringId = props.match.params.id;
  console.log("gatheringId", gatheringId);
  const gathering = Meteor.subscribe('gathering', gatheringId);
  const isLoading = !gathering.ready();
  const theGathering = Gatherings ? Gatherings.findOne({_id:gatheringId}) : null;

  return {
    isLoading,
    gathering,
    theGathering
  };
})(Gathering);