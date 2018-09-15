import { withTracker } from 'meteor/react-meteor-data';
import Profile from './Profile';

export default (ProfileContainer = withTracker(props => {
  const currentUser = Meteor.user();
  const isLoading = !currentUser;

  return {
    isLoading,
    currentUser
  };
})(Profile));
