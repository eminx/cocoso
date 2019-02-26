import { withTracker } from 'meteor/react-meteor-data';
import NewBookSpace from './NewBookSpace';

export default (NewBookSpaceContainer = withTracker(props => {
  //here we can pull out the props.subID and change our Meteor subscription based on it
  //this is handled on the publication side of things

  const calendarList = Meteor.subscribe('calendarView', props.id);
  const isLoading = !calendarList.ready();
  const placesSub = Meteor.subscribe('places');
  const meSub = Meteor.subscribe('me');
  const places = Places ? Places.find().fetch() : null;
  const currentUser = Meteor.user();
  return {
    isLoading,
    calendarList,
    currentUser,
    places
  };
})(NewBookSpace));
