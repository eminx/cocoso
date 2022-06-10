import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import Profile from './Profile';

export default ProfileContainer = withTracker((props) => {
  const currentUser = Meteor.user();
  const isLoading = !currentUser;

  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');
  return {
    isLoading,
    currentUser,
    history: props.history,
    t,
    tc,
  };
})(Profile);
