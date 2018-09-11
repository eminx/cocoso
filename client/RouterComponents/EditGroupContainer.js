import { withTracker } from 'meteor/react-meteor-data';
import EditGroup from './EditGroup';
 
export default EditGroupContainer = withTracker((props) => {
  const groupId = props.match.params.id;
  const groupSubscription = Meteor.subscribe('group', groupId);
  const isLoading = !groupSubscription.ready();
  const groupData = Groups ? Groups.findOne({_id: groupId}) : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    groupData,
    currentUser,
  };
})(EditGroup);