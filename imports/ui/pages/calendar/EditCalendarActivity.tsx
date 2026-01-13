import React, { useState } from 'react';
import { useAtom } from 'jotai';

import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';

import CalendarActivityForm from './CalendarActivityForm';
import { activityAtom } from '../activities/ActivityItemHandler';

interface ActivityFields {
  _id: string;
  datesAndTimes: any[];
  isExclusiveActivity: boolean;
  longDescription: string;
  resource: string;
  resourceId: string;
  title: string;
}

export default function EditCalendarActivity() {
  const [updated, setUpdated] = useState(null);
  const [activity, setActivity] = useAtom(activityAtom);

  const updateActivity = async (newActivity: any) => {
    const activityId = activity._id;
    try {
      await call('updateActivity', activityId, newActivity);
      setActivity(await call('getActivityById', activityId));
      setUpdated(activityId);
      setTimeout(() => {
        setUpdated(null);
      }, 1000);
    } catch (error: any) {
      message.error(error.reason || error.error);
    }
  };

  if (!activity) {
    return null;
  }

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
    <SuccessRedirector forEdit ping={updated}>
      <CalendarActivityForm
        activity={activityFields}
        onFinalize={updateActivity}
      />
    </SuccessRedirector>
  );
}
