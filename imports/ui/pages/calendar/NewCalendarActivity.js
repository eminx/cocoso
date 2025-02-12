import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import CalendarActivityForm from './CalendarActivityForm';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';

export default function NewCalendarActivity({ resources }) {
  const [newEntryId, setNewEntryId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [initialActivity, setInitialActivity] = useState(null);

  const setInitialValuesWithQueryParams = () => {
    const params = {
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      startTime: searchParams.get('startTime'),
      endTime: searchParams.get('endTime'),
    };

    const parsedActivity = {
      datesAndTimes: [
        {
          ...params,
          isRange: params?.startDate && params?.endDate && params.startDate !== params.endDate,
        },
      ],
    };

    const resourceId = searchParams.get('resourceId');
    const selectedResource = resources?.find((r) => r._id === resourceId);
    if (selectedResource) {
      parsedActivity.resource = selectedResource.label;
      parsedActivity.resourceId = selectedResource._id;
    }

    setInitialActivity(parsedActivity);
  };

  useEffect(() => {
    setInitialValuesWithQueryParams();
  }, [searchParams.get('startDate'), resources.length]);

  const createActivity = async (newActivity) => {
    try {
      const respond = await call('createActivity', newActivity);
      setNewEntryId(respond);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSuccess = () => {
    navigate(`/activities/${newEntryId}`);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <CalendarActivityForm activity={initialActivity || null} onFinalize={createActivity} />
    </SuccessRedirector>
  );
}
