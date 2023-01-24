import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useTranslation } from 'react-i18next';

import NewProcess from './NewProcess';

const NewProcessContainer = withTracker((props) => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  return {
    currentUser,
  };
})(NewProcess);

export default function (props) {
  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

  const allProps = {
    ...props,
    t,
    tc,
  };

  return <NewProcessContainer {...allProps} />;
}
