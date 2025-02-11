import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PublicActivityForm from './PublicActivityForm';
import { ActivityContext } from './Activity';
import { call } from '../../utils/shared';

export default function EditPublicActivity() {
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');
  const { activity, getActivityById } = useContext(ActivityContext);
  const [searchParams, setSearchParams] = useSearchParams();
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
    title,
    subTitle,
    images,
    isExclusiveActivity,
    datesAndTimes,
    isRegistrationEnabled,
    capacity,
    longDescription,
    place,
    address,
  }) => ({
    title,
    subTitle,
    images,
    isExclusiveActivity,
    datesAndTimes,
    isRegistrationEnabled,
    capacity,
    longDescription,
    place,
    address,
  }))(activity);

  return (
    <>
      <PublicActivityForm activity={activity} onFinalize={updateActivity} />
    </>
  );
}
