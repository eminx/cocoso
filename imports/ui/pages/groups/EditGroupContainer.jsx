import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useTranslation } from 'react-i18next';

import EditGroup from './EditGroup';
import Groups from '../../../api/groups/group';

const EditGroupContainer = withTracker((props) => {
  const groupId = props.match.params.groupId;
  const groupSubscription = Meteor.subscribe('group', groupId);
  const isLoading = !groupSubscription.ready();
  const group = Groups ? Groups.findOne({ _id: groupId }) : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    group,
    currentUser,
  };
})(EditGroup);

export default function (props) {
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');

  const allProps = {
    ...props,
    t,
    tc,
  };

  return <EditGroupContainer {...allProps} />;
}
