import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { Button } from '@chakra-ui/react';
import moment from 'moment';
import 'react-table/react-table.css';

import Drawer from './Drawer';
import Modal from './Modal';
import { call } from '../utils/shared';
import { message } from './message';

function UsageReport({ user, isOpen, onClose }) {
  const [activities, setActivities] = useState(null);
  const [activityDetails, setActivityDetails] = useState(null);

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

  const parsedActivities = activities.map((activity, index) => {
    let consumption = 0;
    activity.datesAndTimes.forEach((d, i) => {
      console.log(consumption);
      consumption += moment(d.endDate + ' ' + d.endTime).diff(
        moment(d.startDate + ' ' + d.startTime),
        'minutes'
      );
    });
    return {
      ...activity,
      title: (
        <Link target="_blank" to={`/activity/${activity._id}`}>
          <Button colorScheme="blue" variant="link" as="span">
            {activity.title}
          </Button>
        </Link>
      ),
      consumption,
      occurences: (
        <Button colorScheme="blue" variant="link" onClick={() => setActivityDetails(activity)}>
          {activity.datesAndTimes.length}
        </Button>
      ),
    };
  });

  return (
    <Drawer title={user.username} isOpen={isOpen} onClose={onClose} size="xl">
      <ReactTable
        data={parsedActivities}
        columns={[
          {
            // Header: t('public.register.form.name.first'),
            Header: 'Title',
            accessor: 'title',
          },
          {
            // Header: t('public.register.form.name.last'),
            Header: 'Resource',
            accessor: 'resource',
          },
          {
            // Header: t('public.register.form.name.last'),
            Header: 'Consumption (min)',
            accessor: 'consumption',
          },
          {
            // Header: t('public.register.form.name.last'),
            Header: 'Occurences',
            accessor: 'occurences',
          },
        ]}
      />

      <Modal isOpen={Boolean(activityDetails)} onClose={() => setActivityDetails(null)}>
        <ReactTable
          data={activityDetails?.datesAndTimes}
          columns={[
            {
              Header: 'Start Date',
              accessor: 'startDate',
            },
            {
              Header: 'Start Time',
              accessor: 'startTime',
            },
            {
              Header: 'End Date',
              accessor: 'endDate',
            },
            {
              Header: 'End Time',
              accessor: 'endTime',
            },
          ]}
        />
      </Modal>
    </Drawer>
  );
}

export default UsageReport;
