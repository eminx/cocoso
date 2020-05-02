import { withTracker } from 'meteor/react-meteor-data';
import EditGroup from './EditGroup';

export default (EditGroupContainer = withTracker(props => {
  const groupId = props.match.params.id;
  const groupSubscription = Meteor.subscribe('group', groupId);
  const isLoading = !groupSubscription.ready();
  const group = Groups ? Groups.findOne({ _id: groupId }) : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    group,
    currentUser
  };
})(EditGroup));
