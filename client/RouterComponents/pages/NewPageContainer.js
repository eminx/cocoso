import { withTracker } from 'meteor/react-meteor-data';
import NewPage from './NewPage';

export default (NewPageContainer = withTracker(props => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  if (currentUser && currentUser.isSuperAdmin) {
    return { currentUser };
  }
})(NewPage));
