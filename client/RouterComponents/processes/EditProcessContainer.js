import { withTracker } from 'meteor/react-meteor-data';
import EditProcess from './EditProcess';

export default EditProcessContainer = withTracker((props) => {
  const processId = props.match.params.id;
  const processSubscription = Meteor.subscribeLite('process', processId);
  const isLoading = !processSubscription.ready();
  const process = Processes ? Processes.findOne({ _id: processId }) : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    process,
    currentUser,
  };
})(EditProcess);
