import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAtom } from 'jotai';

import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';

import CalendarActivityForm from './CalendarActivityForm';
import { activityAtom } from '../activities/ActivityItemHandler';

export default function EditPublicActivity() {
  const [updated, setUpdated] = useState(null);
  const [activity, setActivity] = useAtom(activityAtom);
  const [, setSearchParams] = useSearchParams();
  if (!activity) {
    return null;
  }

  const updateActivity = async (newActivity) => {
    const activityId = activity._id;
    try {
      await call('updateActivity', activityId, newActivity);
      setActivity(await call('getActivityById', activityId));
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
