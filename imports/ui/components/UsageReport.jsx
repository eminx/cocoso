import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { Box, Button, Heading } from '@chakra-ui/react';
import moment from 'moment';
import 'react-table/react-table.css';

import Drawer from './Drawer';
import Modal from './Modal';
import { call } from '../utils/shared';
import { message } from './message';

function compareDatesForSort(a, b) {
  const dateA = new Date(`${a.startDate}T${a.startTime}:00Z`);
  const dateB = new Date(`${b.startDate}T${b.startTime}:00Z`);
  return dateB - dateA;
}

function UsageReport({ user, onClose }) {
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
      parseActivities(response);
    } catch (error) {
      console.log(error);
      message.error(error);
    }
  };

  const parseActivities = (activities) => {
    const allParsedActivities = [];
    activities.forEach((a, index) => {
      a.datesAndTimes.forEach((d, i) => {
        allParsedActivities.push({
          ...d,
          title: (
            <Link target="_blank" to={`/activity/${a._id}`}>
              <Button colorScheme="blue" variant="link" as="span">
                {a.title}
              </Button>
            </Link>
          ),
          start: d.startDate + ' ' + d.startTime,
          end: d.endDate + ' ' + d.endTime,
          resource: a.resource,
          resourceId: a.resourceId,
          consumption: moment(d.endDate + ' ' + d.endTime).diff(
            moment(d.startDate + ' ' + d.startTime),
            'hours',
            true
          ),
        });
      });
    });

    const allParsedActivitiesSorted = allParsedActivities.sort(compareDatesForSort);

    const allParsedActivitiesSortedInMonths = [[]];
    let monthCounter = 0;
    allParsedActivitiesSorted.forEach((a, i) => {
      const previous = i > 0 && allParsedActivitiesSorted[i - 1];
      if (a?.startDate?.substring(0, 7) === previous?.startDate?.substring(0, 7)) {
        allParsedActivitiesSortedInMonths[monthCounter].push(a);
      } else {
        allParsedActivitiesSortedInMonths.push([a]);
        monthCounter += 1;
      }
    });

    setActivities(allParsedActivitiesSortedInMonths);
  };

  if (!user || !activities) {
    return null;
  }

  // const parsedActivities = activities.map((activity, index) => {
  //   let consumption = 0;
  //   activity.datesAndTimes.forEach((d, i) => {
  //     consumption += moment(d.endDate + ' ' + d.endTime).diff(
  //       moment(d.startDate + ' ' + d.startTime),
  //       'minutes'
  //     );
  //   });
  //   return {
  //     ...activity,
  //     title: (
  //       <Link target="_blank" to={`/activity/${activity._id}`}>
  //         <Button colorScheme="blue" variant="link" as="span">
  //           {activity.title}
  //         </Button>
  //       </Link>
  //     ),
  //     consumption,
  //     occurences: (
  //       <Button colorScheme="blue" variant="link" onClick={() => setActivityDetails(activity)}>
  //         {activity.datesAndTimes.length}
  //       </Button>
  //     ),
  //   };
  // });

  return (
    <Drawer
      title={`Consumption Report for ${user.username}`}
      isOpen={Boolean(activities)}
      onClose={onClose}
      size="xl"
    >
      {activities.map(
        (activitiesPerMonth, index) =>
          index !== 0 && (
            <Box key={activitiesPerMonth[0]?.startDate} my="8">
              <Heading size="md" mb="2">
                {moment(activitiesPerMonth[0]?.startDate).format('MMMM YYYY')}
              </Heading>
              <ReactTable
                size="sm"
                data={activitiesPerMonth}
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
                    Header: 'Start',
                    accessor: 'start',
                  },
                  {
                    Header: 'End',
                    accessor: 'end',
                  },
                  {
                    // Header: t('public.register.form.name.last'),
                    Header: 'Consumption (h)',
                    accessor: 'consumption',
                  },
                  // {
                  //   // Header: t('public.register.form.name.last'),
                  //   Header: 'Occurences',
                  //   accessor: 'occurences',
                  // },
                ]}
              />
            </Box>
          )
      )}

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
