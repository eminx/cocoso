import { withTracker } from 'meteor/react-meteor-data';
import Home from './Home';
import moment from 'moment';

export default (HomeContainer = withTracker(props => {
  // here we can pull out the props.subID and change our Meteor subscription based on it
  // this is handled on the publication side of things

  // const handle = Meteor.subscribe('myDataSub', props.subID);

  const bookings = Meteor.subscribe('gatherings');
  const images = Meteor.subscribe('images');
  const isLoading = !bookings.ready();
  const bookingsList = Gatherings ? Gatherings.find().fetch() : null;
  const imagesArray = Images ? Images.find().fetch() : null;
  const currentUser = Meteor.user();
  const placesSub = Meteor.subscribe('places');
  const placesList = Places ? Places.find().fetch() : null;

  const allActivities = [];
  bookingsList.forEach(booking => {
    booking.datesAndTimes.forEach(recurrence => {
      allActivities.push({
        title: booking.title,
        start: moment(
          recurrence.startDate + recurrence.startTime,
          'YYYY-MM-DD HH:mm'
        ).toDate(),
        end: moment(
          recurrence.endDate + recurrence.endTime,
          'YYYY-MM-DD HH:mm'
        ).toDate(),
        startDate: recurrence.startDate,
        startTime: recurrence.startTime,
        endDate: recurrence.endDate,
        endTime: recurrence.endTime,
        authorName: booking.authorName,
        room: booking.room,
        longDescription: booking.longDescription,
        isMultipleDay: recurrence.isMultipleDay,
        roomIndex: booking.roomIndex,
        _id: booking._id
      });
    });
  });

  return {
    isLoading,
    bookings,
    allActivities,
    imagesArray,
    currentUser,
    placesList
  };
})(Home));
