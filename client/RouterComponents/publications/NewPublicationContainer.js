import { withTracker } from 'meteor/react-meteor-data';
import NewPublication from './NewPublication';

export default (NewPublicationContainer = withTracker(props => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  return {
    currentUser
  };
})(NewPublication));
