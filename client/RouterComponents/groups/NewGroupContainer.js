import { withTracker } from 'meteor/react-meteor-data';
import NewGroup from './NewGroup';

export default (NewGroupContainer = withTracker(props => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  return {
    currentUser
  };
})(NewGroup));
