import { withTracker } from 'meteor/react-meteor-data';
import Users from './Users';

export default (UsersContainer = withTracker(props => {
  const currentUser = Meteor.user();
  const usersSubscription = Meteor.subscribe('users');
  const isLoading = !usersSubscription.ready();
  const users = Meteor.users ? Meteor.users.find().fetch() : null;

  return {
    isLoading,
    currentUser,
    users
  };
})(Users));
