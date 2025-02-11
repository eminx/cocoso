import React from 'react';
import { useNavigate } from 'react-router-dom';

import CalendarActivityForm from './CalendarActivityForm';
import { call } from '../../utils/shared';

export default function NewCalendarActivity() {
  const navigate = useNavigate();

  const createActivity = async (newActivity) => {
    try {
      const newEntryId = await call('createActivity', newActivity);
      // message.success(t('form.success'));
      navigate(`/activities/${newEntryId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CalendarActivityForm onFinalize={createActivity} />
    </>
  );
}
