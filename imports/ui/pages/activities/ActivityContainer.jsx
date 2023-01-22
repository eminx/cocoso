import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Activity from './Activity';
import { call } from '../../utils/shared';
import { message } from '../../components/message';

export default function (props) {
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getActivityById();
  }, []);

  const { activityId } = props.match.params;
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
    ...props,
    activityData,
    isLoading,
    t,
    tc,
  };

  return <Activity {...allProps} />;
}
