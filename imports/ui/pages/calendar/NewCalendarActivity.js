import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import CalendarActivityForm from './CalendarActivityForm';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { emptyDateAndTime } from '../../forms/DatesAndTimes';
import { message } from '../../generic/message';

export default function NewCalendarActivity({ resources }) {
  const [newEntryId, setNewEntryId] = useState(null);
  const [searchParams] = useSearchParams();
  const [initialActivity, setInitialActivity] = useState(null);
  const navigate = useNavigate();

  const setInitialValuesWithQueryParams = () => {
    const params = {
      startDate: searchParams.get('startDate') || emptyDateAndTime.startDate,
      endDate: searchParams.get('endDate') || emptyDateAndTime.endDate,
      startTime: searchParams.get('startTime') || emptyDateAndTime.startTime,
      endTime: searchParams.get('endTime') || emptyDateAndTime.endTime,
    };

    const parsedActivity = {
      datesAndTimes: [
        {
          ...params,
          isRange: params?.startDate !== params?.endDate,
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
      message.error(error.reason || error.error);
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
