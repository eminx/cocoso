import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import { call } from '../utils/shared';
import { message } from './message';

function UsageReport({ userId }) {
  const [activities, setActivities] = useState(null);

  useEffect(() => {
    getActivitiesbyUserId();
  }, []);

  const getActivitiesbyUserId = async () => {
    try {
      const response = await call('getActivitiesbyUserId', userId);
      setActivities(response);
    } catch (error) {
      message.error();
    }
  };

  return (
    <ReactTable
      data={attendees}
      columns={[
        {
          Header: t('public.register.form.name.first'),
          accessor: 'firstName',
        },
        {
          Header: t('public.register.form.name.first'),
          accessor: 'lastName',
        },
        {
          Header: t('public.register.form.people.label'),
          accessor: 'numberOfPeople',
        },
        {
          Header: t('public.register.form.email'),
          accessor: 'email',
        },
      ]}
    />
  );
}

export default UsageReport;
