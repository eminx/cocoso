import { withTracker } from 'meteor/react-meteor-data';
import ProcessesList from './ProcessesList';
import Processes from '../../../api/processes/process';

export default ProcessesListContainer = withTracker((props) => {
  const processesSubscription = Meteor.subscribe('processes');
  const processes = Processes ? Processes.find().fetch() : null;
  const isLoading = !processesSubscription.ready();
  const currentUser = Meteor.user();
  return {
    isLoading,
    currentUser,
    processes,
  };
})(ProcessesList);
