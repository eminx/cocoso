import { withTracker } from 'meteor/react-meteor-data';
import Home from './Home';
import moment from 'moment';

export default (HomeContainer = withTracker(props => {
  // here we can pull out the props.subID and change our Meteor subscription based on it
  // this is handled on the publication side of things

  // const handle = Meteor.subscribe('myDataSub', props.subID);

  const groupsSubscription = Meteor.subscribe('groups');
  const groupsList = Groups ? Groups.find().fetch() : null;

  const bookings = Meteor.subscribe('gatherings');
  const isLoading = !bookings.ready();
  const bookingsList = Gatherings ? Gatherings.find().fetch() : null;
  const currentUser = Meteor.user();

  const manualsSubscription = Meteor.subscribe('manuals');
  const manuals = Documents ? Documents.find().fetch() : null;

  return {
    isLoading,
    bookingsList,
    currentUser,
    groupsList,
    manuals
  };
})(Home));
