import { withTracker } from 'meteor/react-meteor-data';
import Work from './Work';

export default (WorkContainer = withTracker(props => {
  const workId = props.match.params.id;
  const workSubscription = Meteor.subscribe('work', workId);
  const isLoading = !workSubscription.ready();
  const work = workId ? Works.findOne(workId) : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    currentUser,
    work
  };
})(Work));
