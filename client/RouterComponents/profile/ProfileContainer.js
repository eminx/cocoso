import { withTracker } from 'meteor/react-meteor-data';
import Profile from './Profile';

export default (ProfileContainer = withTracker(props => {
  const currentUser = Meteor.user();
  const myWorksSubscription = Meteor.subscribe('myworks');
  const isLoading = !currentUser || !myWorksSubscription.ready();
  const myWorks = Works.find().fetch() || null;
  console.log(myWorks);

  return {
    isLoading,
    currentUser,
    myWorks
  };
})(Profile));
