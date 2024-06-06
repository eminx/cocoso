import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Activity from './Activity';
import { call } from '../../utils/shared';
import { message } from '../../components/message';

export default function () {
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');
  const params = useParams();

  useEffect(() => {
    getActivityById();
  }, []);

  const { activityId } = params;

  const getActivityById = async () => {
    try {
      setActivityData(await call('getActivityById', activityId));
    } catch (error) {
      message(error.reason);
    } finally {
      setIsLoading(false);
    }
  };

  const allProps = {
    getActivityById,
    activityData,
    isLoading,
    t,
    tc,
  };

  return <Activity {...allProps} />;
}
