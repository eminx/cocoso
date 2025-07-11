import React from 'react';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';

import { Box, Center, Tag, Text } from '/imports/ui/core';
import TablyCentered from './TablyCentered';
import FancyDate from './FancyDate';
import { accordionProps } from '../utils/constants/general';
import ActionDates from './ActionDates';

const { buttonProps } = accordionProps;

export default function ActivityHybrid({ activity, Host }) {
  if (!activity) {
    return null;
  }

  const tabs = [
    {
      title: <Trans i18nKey="common:labels.info">Info</Trans>,
      content: (
        <Box bg="white" className="text-content" p="6">
          {activity?.longDescription &&
            HTMLReactParser(activity?.longDescription)}
        </Box>
      ),
      path: 'info',
    },
  ];

  if (activity?.isPublicActivity) {
    tabs.push({
      title: (
        <Trans i18nKey="activities:public.labels.location">
          Location
        </Trans>
      ),
      content: (
        <Box bg="white" p="6">
          {activity?.place && (
            <Text
              mb="2"
              css={{
                fontWeight: 'bold',
                fontSize: 'lg',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              {activity?.place}
            </Text>
          )}
          {activity.resource && (
            <Center mb="2">
              <Tag>{activity.resource}</Tag>
            </Center>
          )}
          {activity?.address && (
            <Text css={{ textAlign: 'center' }}>
              <b>
                <Trans i18nKey="activities:public.labels.address">
                  Address
                </Trans>
                :{' '}
              </b>
              {activity.address}
            </Text>
          )}
        </Box>
      ),
      path: 'location',
    });
  }

  if (!activity.isPublicActivity) {
    tabs.push({
      title: (
        <Trans i18nKey="activities:public.labels.dates">
          See Dates
        </Trans>
      ),
      content: (
        <Box p="6">
          {activity.datesAndTimes?.map((occurrence) => (
            <Box
              key={occurrence.startDate + occurrence.startTime}
              {...buttonProps}
              p="2"
              mb="4"
            >
              <FancyDate occurrence={occurrence} />
            </Box>
          ))}
        </Box>
      ),
      path: 'dates',
    });
  }

  const activitiesInMenu = Host?.settings?.menu.find(
    (item) => item.name === 'activities'
  );
  const calendarInMenu = Host?.settings?.menu.find(
    (item) => item.name === 'calendar'
  );
  const { isPublicActivity } = activity;
  const backLink = {
    value: isPublicActivity ? '/activities' : '/calendar',
    label: isPublicActivity
      ? activitiesInMenu?.label
      : calendarInMenu?.label,
  };

  const url = `https://${activity.host}/activities/${activity._id}`;

  return (
    <TablyCentered
      action={
        <Center>
          <ActionDates activity={activity} />
        </Center>
      }
      backLink={backLink}
      images={
        activity?.isPublicActivity
          ? activity?.images || [activity?.imageUrl]
          : null
      }
      subTitle={activity?.subTitle}
      tabs={tabs}
      title={activity?.title}
      url={url}
    />
  );
}
