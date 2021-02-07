import { withTracker } from 'meteor/react-meteor-data';
import NewProcess from './NewProcess';

export default NewProcessContainer = withTracker((props) => {
  const meSub = Meteor.subscribeLite('me');
  const currentUser = Meteor.user();

  return {
    currentUser,
  };
})(NewProcess);
