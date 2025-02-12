import React, { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import PublicActivityForm from './PublicActivityForm';
import { ActivityContext } from './Activity';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';

export default function EditPublicActivity() {
  const [updated, setUpdated] = useState(null);
  const { activity, getActivityById } = useContext(ActivityContext);
  const [, setSearchParams] = useSearchParams();

  const updateActivity = async (newActivity) => {
    const activityId = activity._id;
    try {
      await call('updateActivity', activityId, newActivity);
      await getActivityById(activityId);
      setUpdated(activityId);
    } catch (error) {
      console.log(error);
    }
  };

  const activityFields = (({
    address,
    capacity,
    datesAndTimes,
    images,
    isExclusiveActivity,
    isRegistrationEnabled,
    longDescription,
    place,
    resource,
    resourceId,
    subTitle,
    title,
  }) => ({
    address,
    capacity,
    datesAndTimes,
    images,
    isExclusiveActivity,
    isRegistrationEnabled,
    longDescription,
    place,
    resource,
    resourceId,
    subTitle,
    title,
  }))(activity);

  return (
    <SuccessRedirector ping={updated} onSuccess={() => setSearchParams({ edit: 'false' })}>
      <PublicActivityForm activity={activityFields} onFinalize={updateActivity} />
    </SuccessRedirector>
  );
}
