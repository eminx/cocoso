import { withTracker } from 'meteor/react-meteor-data';
import Calendar from './Calendar';
import moment from 'moment';

export default (CalendarContainer = withTracker(props => {
  // here we can pull out the props.subID and change our Meteor subscription based on it
  // this is handled on the publication side of things

  // const handle = Meteor.subscribe('myDataSub', props.subID);

  const bookings = Meteor.subscribe('gatherings');
  const isLoading = !bookings.ready();
  const bookingsList = Gatherings ? Gatherings.find().fetch() : null;
  const currentUser = Meteor.user();
  const placesSub = Meteor.subscribe('places');
  const placesList = Places ? Places.find().fetch() : null;
  const groupsSubscription = Meteor.subscribe('groups');
  const groupsList = Groups ? Groups.find().fetch() : null;

  const allActivities = [];
  if (bookingsList) {
    bookingsList.forEach(booking => {
      if (booking.datesAndTimes) {
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
            isMultipleDay:
              recurrence.isMultipleDay ||
              recurrence.startDate !== recurrence.endDate,
            roomIndex: booking.roomIndex,
            isPublicActivity: booking.isPublicActivity,
            imageUrl: booking.imageUrl,
            _id: booking._id
          });
        });
      }
    });
  }

  if (groupsList) {
    groupsList.forEach(group => {
      if (group.meetings) {
        group.meetings.forEach(meeting => {
          allActivities.push({
            title: group.title,
            start: moment(
              meeting.startDate + meeting.startTime,
              'YYYY-MM-DD HH:mm'
            ).toDate(),
            end: moment(
              meeting.endDate + meeting.endTime,
              'YYYY-MM-DD HH:mm'
            ).toDate(),
            startDate: meeting.startDate,
            startTime: meeting.startTime,
            endDate: meeting.endDate,
            endTime: meeting.endTime,
            authorName: group.adminUsername,
            room: meeting.room,
            longDescription: group.description,
            isMultipleDay: false,
            roomIndex: meeting.roomIndex,
            isPublicActivity: true,
            imageUrl: group.imageUrl,
            _id: group._id,
            isGroup: true
          });
        });
      }
    });
  }

  return {
    isLoading,
    allActivities,
    currentUser,
    placesList
  };
})(Calendar));
