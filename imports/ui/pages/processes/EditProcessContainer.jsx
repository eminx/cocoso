import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useTranslation } from 'react-i18next';

import EditProcess from './EditProcess';
import Processes from '../../../api/processes/process';

const EditProcessContainer = withTracker((props) => {
  const processId = props.match.params.processId;
  const processSubscription = Meteor.subscribe('process', processId);
  const isLoading = !processSubscription.ready();
  const process = Processes ? Processes.findOne({ _id: processId }) : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    process,
    currentUser,
  };
})(EditProcess);

export default function (props) {
  const [t] = useTranslation('processes');
  const [tc] = useTranslation('common');

  const allProps = {
    ...props,
    t,
    tc,
  };

  return <EditProcessContainer {...allProps} />;
}
