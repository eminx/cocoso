import { withTracker } from 'meteor/react-meteor-data';
import User from './User';

export default (UserContainer = withTracker(props => {
  const username = props.match.params.id;
  const currentUser = Meteor.user();
  const userSubscription = Meteor.subscribe('user', username);
  const isLoading = !userSubscription.ready();
  const user = Meteor.users ? Meteor.users.findOne({ username }) : null;

  return {
    isLoading,
    currentUser,
    user
  };
})(User));
