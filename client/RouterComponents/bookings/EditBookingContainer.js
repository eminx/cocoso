import { withTracker } from 'meteor/react-meteor-data';
import EditBooking from './EditBooking';

export default (EditBookingContainer = withTracker(props => {
  const gatheringId = props.match.params.id;
  const gathering = Meteor.subscribe('gathering', gatheringId);
  const placesSub = Meteor.subscribe('places');
  const places = Places ? Places.find().fetch() : null;
  const gatheringData = Gatherings
    ? Gatherings.findOne({ _id: gatheringId })
    : null;
  const currentUser = Meteor.user();
  const isLoading = !gathering.ready() || placesSub.ready();

  return {
    isLoading,
    gatheringData,
    currentUser,
    places
  };
})(EditBooking));
