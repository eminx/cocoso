import { withTracker } from 'meteor/react-meteor-data';
import GroupsList from './GroupsList';
 
export default GroupsListContainer = withTracker((props) => {
  const groupsSubscription = Meteor.subscribe('groups');
  const placesSubscription = Meteor.subscribe('places');

  const places = Places ? Places.find().fetch() : null;
  // const groups = Groups ? Groups.find().fetch() : null;
  
  const isLoading = !placesSubscription.ready();

  const currentUser = Meteor.user();

  return {
    isLoading,
    currentUser,
    places,
    // groups,
  };
})(GroupsList);