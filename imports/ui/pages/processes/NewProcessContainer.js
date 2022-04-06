import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import NewProcess from './NewProcess';

export default NewProcessContainer = withTracker((props) => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  const [ t ] = useTranslation('processes');
  const [ tc ] = useTranslation('common');

  return {
    currentUser,
    t,
    tc,
  };
})(NewProcess);
