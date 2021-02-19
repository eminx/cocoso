import { withTracker } from 'meteor/react-meteor-data';
import NewActivity from './NewActivity.jsx';

export default NewActivityContainer = withTracker((props) => {
  //here we can pull out the props.subID and change our Meteor subscription based on it
  //this is handled on the publication side of things

  const calendarList = Meteor.subscribe('calendarView', props.id);
  const isLoading = !calendarList.ready();
  const resourcesSub = Meteor.subscribe('resources');
  const meSub = Meteor.subscribe('me');
  const resources = Resources ? Resources.find().fetch() : null;
  const currentUser = Meteor.user();
  return {
    isLoading,
    calendarList,
    currentUser,
    resources,
  };
})(NewActivity);
