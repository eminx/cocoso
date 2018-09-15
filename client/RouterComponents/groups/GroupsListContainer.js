import { withTracker } from 'meteor/react-meteor-data';
import GroupsList from './GroupsList';

export default (GroupsListContainer = withTracker(props => {
  const groupsSubscription = Meteor.subscribe('groups');
  const groupsData = Groups ? Groups.find().fetch() : null;
  const isLoading = !groupsSubscription.ready();
  const currentUser = Meteor.user();

  return {
    isLoading,
    currentUser,
    groupsData
  };
})(GroupsList));
