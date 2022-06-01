import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import { call } from '../utils/shared';
import Drawer from './Drawer';
import { message } from './message';
import 'react-table/react-table.css';

function UsageReport({ user, isOpen, onClose }) {
  const [activities, setActivities] = useState(null);

  useEffect(() => {
    getActivitiesbyUserId();
  }, [user]);

  const getActivitiesbyUserId = async () => {
    if (!user) {
      return;
    }
    try {
      const response = await call('getActivitiesbyUserId', user.id);
      setActivities(response);
    } catch (error) {
      message.error();
    }
  };

  if (!user || !activities) {
    return null;
  }

  return (
    <Drawer title={user.username} isOpen={isOpen} onClose={onClose} size="lg">
      <ReactTable
        data={activities}
        columns={[
          {
            // Header: t('public.register.form.name.first'),
            Header: 'Title',
            accessor: 'title',
          },
          {
            // Header: t('public.register.form.name.last'),
            Header: 'username',
            accessor: 'username',
          },
        ]}
      />
    </Drawer>
  );
}

export default UsageReport;
