import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useAtom, useSetAtom } from 'jotai';

import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { initialLoader, loaderAtom } from '/imports/ui/listing/NewEntryHandler';

import PublicActivityForm from './PublicActivityForm';
import { activityAtom } from './ActivityItemHandler';

export default function EditPublicActivity() {
  const [updated, setUpdated] = useState(null);
  const [activity, setActivity] = useAtom(activityAtom);
  const setLoaders = useSetAtom(loaderAtom);
  const { activityId } = useParams();
  const [, setSearchParams] = useSearchParams();

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

  const handleSuccess = () => {
    setSearchParams({ edit: 'false' });
    setUpdated(null);
    setTimeout(() => {
      setLoaders({ ...initialLoader });
    }, 1200);
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
    <SuccessRedirector ping={updated} onSuccess={handleSuccess}>
      <PublicActivityForm
        activity={activityFields}
        onFinalize={updateActivity}
      />
    </SuccessRedirector>
  );
}
