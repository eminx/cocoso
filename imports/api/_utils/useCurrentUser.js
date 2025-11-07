import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

const useCurrentUser = () =>
  useTracker(() => {
    const subscription = Meteor.subscribe('me');
    const currentUser = Meteor.user();

    return {
      currentUser,
    };
  }, []);

export default useCurrentUser;
