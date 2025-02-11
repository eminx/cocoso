import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import CalendarActivityForm from './CalendarActivityForm';
import { ActivityContext } from '../activities/Activity';
import { call } from '../../utils/shared';

export default function EditPublicActivity() {
  const { activity, getActivityById } = useContext(ActivityContext);
  const [, setSearchParams] = useSearchParams();
  if (!activity) {
    return null;
  }

  const updateActivity = async (newActivity) => {
    const activityId = activity._id;
    console.log(newActivity);
    // return;
    try {
      await call('updateActivity', activityId, newActivity);
      await getActivityById(activityId);
      // message.success(t('form.success'));
      setSearchParams({ edit: 'false' });
    } catch (error) {
      console.log(error);
    }
  };

  const activityFields = (({
    datesAndTimes,
    isExclusiveActivity,
    longDescription,
    resource,
    resourceId,
    title,
  }) => ({
    datesAndTimes,
    isExclusiveActivity,
    longDescription,
    resource,
    resourceId,
    title,
  }))(activity);

  return (
    <>
      <CalendarActivityForm activity={activityFields} onFinalize={updateActivity} />
    </>
  );
}
