import React, { useContext, useState } from 'react';
import { useSearchParams } from 'react-router';

import CalendarActivityForm from './CalendarActivityForm';
import { ActivityContext } from '../activities/Activity';
import { call } from '../../utils/shared';
import { message } from '../../generic/message';
import SuccessRedirector from '../../forms/SuccessRedirector';

export default function EditPublicActivity() {
  const [updated, setUpdated] = useState(null);
  const { activity, getActivityById } = useContext(ActivityContext);
  const [, setSearchParams] = useSearchParams();
  if (!activity) {
    return null;
  }

  const updateActivity = async (newActivity) => {
    const activityId = activity._id;
    try {
      await call('updateActivity', activityId, newActivity);
      await getActivityById(activityId);
      setUpdated(activityId);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const activityFields = (({
    _id,
    datesAndTimes,
    isExclusiveActivity,
    longDescription,
    resource,
    resourceId,
    title,
  }) => ({
    _id,
    datesAndTimes,
    isExclusiveActivity,
    longDescription,
    resource,
    resourceId,
    title,
  }))(activity);

  return (
    <SuccessRedirector
      ping={updated}
      onSuccess={() => setSearchParams({ edit: 'false' })}
    >
      <CalendarActivityForm
        activity={activityFields}
        onFinalize={updateActivity}
      />
    </SuccessRedirector>
  );
}
