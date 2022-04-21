import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import ProcessesList from './ProcessesList';
import Processes from '../../../api/processes/process';

export default ProcessesListContainer = withTracker((props) => {
  const processesSubscription = Meteor.subscribe('processes');
  const processes = Processes ? Processes.find().fetch() : null;
  const isLoading = !processesSubscription.ready();
  const currentUser = Meteor.user();

  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

  return {
    isLoading,
    currentUser,
    processes,
    t,
    tc,
  };
})(ProcessesList);
