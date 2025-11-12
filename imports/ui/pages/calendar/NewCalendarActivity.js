import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useSetAtom } from 'jotai';

import { call } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { initialLoader, loaderAtom } from '/imports/ui/listing/NewEntryHandler';
import { emptyDateAndTime } from '/imports/ui/forms/DatesAndTimes';

import CalendarActivityForm from './CalendarActivityForm';

export default function NewCalendarActivity({ resources }) {
  const [newEntryId, setNewEntryId] = useState(null);
  const [searchParams] = useSearchParams();
  const [initialActivity, setInitialActivity] = useState(null);
  const navigate = useNavigate();
  const setLoaders = useSetAtom(loaderAtom);

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
    setTimeout(() => {
      setLoaders({ ...initialLoader });
      navigate(`/calendar/${newEntryId}`);
    }, 1200);
  };

  return (
    <SuccessRedirector ping={newEntryId} onSuccess={handleSuccess}>
      <CalendarActivityForm
        activity={initialActivity || null}
        onFinalize={createActivity}
      />
    </SuccessRedirector>
  );
}
