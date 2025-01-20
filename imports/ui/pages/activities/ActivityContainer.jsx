import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Activity from './Activity';
import { call } from '../../utils/shared';
import { message } from '../../components/message';
import { useChattery } from '../../chattery';
import { StateContext } from '../../LayoutContainer';

export default function () {
  const { currentUser } = useContext(StateContext);
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');
  const params = useParams();

  const { activityId } = params;

  const { isChatLoading, discussion } = useChattery(activityId, currentUser);

  useEffect(() => {
    getActivityById();
  }, []);

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
    isChatLoading,
    discussion,
    t,
    tc,
  };

  return <Activity {...allProps} />;
}
