import { withTracker } from 'meteor/react-meteor-data';
import NewActivity from './NewActivity.jsx';

export default NewActivityContainer = withTracker((props) => {
  //here we can pull out the props.subID and change our Meteor subscription based on it
  //this is handled on the publication side of things

  const calendarList = Meteor.subscribeLite('calendarView', props.id);
  const isLoading = !calendarList.ready();
  const resourcesSub = Meteor.subscribeLite('resources');
  const meSub = Meteor.subscribeLite('me');
  const resources = Resources ? Resources.find().fetch() : null;
  const currentUser = Meteor.user();
  return {
    isLoading,
    calendarList,
    currentUser,
    resources,
  };
})(NewActivity);
