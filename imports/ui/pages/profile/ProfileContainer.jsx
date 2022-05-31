import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import Profile from './Profile';

const ProfileContainer = withTracker(() => {
  const currentUser = Meteor.user();
  const isLoading = !currentUser;

  const [t] = useTranslation('accounts');
  const [tc] = useTranslation('common');
  return {
    isLoading,
    currentUser,
    t,
    tc,
  };
})(Profile);

export default ProfileContainer;
