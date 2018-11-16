import { withTracker } from 'meteor/react-meteor-data';
import Home from './Home';
import moment from 'moment';

export default (HomeContainer = withTracker(props => {
  //here we can pull out the props.subID and change our Meteor subscription based on it
  //this is handled on the publication side of things

  // const handle = Meteor.subscribe('myDataSub', props.subID);

  const bookings = Meteor.subscribe('gatherings');
  const images = Meteor.subscribe('images');
  const isLoading = !bookings.ready();
  const bookingsList = Gatherings ? Gatherings.find().fetch() : null;
  const imagesArray = Images ? Images.find().fetch() : null;
  const currentUser = Meteor.user();
  const placesSub = Meteor.subscribe('places');
  const placesList = Places ? Places.find().fetch() : null;

  bookingsList.forEach(booking => {
    booking.start = moment(
      booking.startDate + booking.startTime,
      'YYYY-MM-DD HH:mm'
    ).toDate();
    booking.end = moment(
      booking.endDate + booking.endTime,
      'YYYY-MM-DD HH:mm'
    ).toDate();
  });

  return {
    isLoading,
    bookings,
    bookingsList,
    imagesArray,
    currentUser,
    placesList
  };
})(Home));
