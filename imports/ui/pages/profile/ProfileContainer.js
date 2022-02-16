import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import Profile from './Profile';

export default ProfileContainer = withTracker((props) => {
  const currentUser = Meteor.user();
  // const myWorksSubscription = Meteor.subscribe('myworks');
  const isLoading = !currentUser;
  // const myWorks = Works.find().fetch() || null;

  const [ t ] = useTranslation('accounts');
  const [ tc ] = useTranslation('common');
  return {
    isLoading,
    currentUser,
    t,
    tc
    // myWorks
  };
})(Profile);
