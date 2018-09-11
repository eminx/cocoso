import { withTracker } from 'meteor/react-meteor-data';
import NewGroup from './NewGroup';
 
export default NewGroupContainer = withTracker((props) => {
  
	const currentUser = Meteor.user();

  return {
  	currentUser,
  };
})(NewGroup);