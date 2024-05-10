import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useTranslation } from 'react-i18next';

import NewGroup from './NewGroup';

const NewGroupContainer = withTracker((props) => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  return {
    currentUser,
  };
})(NewGroup);

export default function (props) {
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');

  const allProps = {
    ...props,
    t,
    tc,
  };

  return <NewGroupContainer {...allProps} />;
}
