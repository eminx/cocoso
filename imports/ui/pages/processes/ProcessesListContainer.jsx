import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import ProcessesList from './ProcessesList';

export default ProcessesListContainer = withTracker((props) => {
  const currentUser = Meteor.user();

  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

  return {
    currentUser,
    t,
    tc,
  };
})(ProcessesList);
