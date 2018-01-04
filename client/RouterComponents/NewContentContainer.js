import { withTracker } from 'meteor/react-meteor-data';
import NewContent from './NewContent';
 
export default NewContentContainer = withTracker((props) => {
  //here we can pull out the props.subID and change our Meteor subscription based on it
  //this is handled on the publication side of things
  
  // const handle = Meteor.subscribe('myDataSub', props.subID);
  
  const userId = Meteor.userId();
  if (userId) {
	  return {
	  	userId
  	};
  }
})(NewContent);