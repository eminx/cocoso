import { withTracker } from 'meteor/react-meteor-data';
import Booking from './Booking';
 
export default BookingContainer = withTracker((props) => {
  const bookingId = props.match.params.id;
  const booking = Meteor.subscribe('gathering', bookingId);

  const isLoading = !booking.ready();
  const bookingData = Gatherings ? Gatherings.findOne({_id: bookingId}) : null;
  const currentUser = Meteor.user();

  const chatSubscription = Meteor.subscribe('chat', bookingId);
  const chatData = Chats ? Chats.findOne({contextId: bookingId}) : null;

  return {
    isLoading,
    bookingData,
    currentUser,
    chatData
  };
})(Booking);