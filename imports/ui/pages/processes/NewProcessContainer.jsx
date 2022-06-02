import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import NewProcess from './NewProcess';

const NewProcessContainer = withTracker(() => {
  // const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

  return {
    currentUser,
    t,
    tc,
  };
})(NewProcess);

export default NewProcessContainer;
