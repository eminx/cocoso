import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { message } from '../../generic/message';

import PublicActivityForm from './PublicActivityForm';
import { activityAtom } from './ActivityItemHandler';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { useAtom } from 'jotai';

export default function EditPublicActivity() {
  const [updated, setUpdated] = useState(null);
  const [activity, setActivity] = useAtom(activityAtom);
  const { activityId } = useParams();
  const [, setSearchParams] = useSearchParams();

  const updateActivity = async (newActivity) => {
    const activityId = activity._id;
    try {
      await call('updateActivity', activityId, newActivity);
      setActivity(await call('getActivityById', activityId));
      await getActivityById(activityId);
      setUpdated(activityId);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (!activity) {
    return null;
  }

  const activityFields = (({
    _id,
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
    _id,
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
    <SuccessRedirector
      ping={updated}
      onSuccess={() => setSearchParams({ edit: 'false' })}
    >
      <PublicActivityForm
        activity={activityFields}
        onFinalize={updateActivity}
      />
    </SuccessRedirector>
  );
}
