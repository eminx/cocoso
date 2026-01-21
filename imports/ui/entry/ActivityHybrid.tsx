import React from 'react';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

import { Box, Center, Tag, Text } from '/imports/ui/core';
import type { Host } from '/imports/ui/types';

import ActionDates from './ActionDates';
import FancyDate from './FancyDate';
import TablyCentered from './TablyCentered';
import { DateOccurrence } from './ActionDates';

interface Activity {
  _id: string;
  title?: string;
  subTitle?: string;
  host?: string;
  authorUsername?: string;
  authorAvatar?: string;
  shortDescription?: string;
  longDescription?: string;
  imageUrl?: string;
  images?: string[];
  isPublicActivity?: boolean;
  place?: string;
  resource?: string;
  address?: string;
  internalMeetingPlace?: string;
  datesAndTimes?: DateOccurrence[];
  isActivitiesDisabled?: boolean;
  category?: {
    label?: string;
  };
}

export interface ActivityHybridProps {
  activity: Activity;
  Host: Host;
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: 'var(--cocoso-colors-theme-100)',
  borderRadius: 'var(--cocoso-border-radius)',
  color: 'var(--cocoso-colors-gray-900)',
  margin: '0.5rem 0',
  padding: '1rem',
  width: '100%',
};

export default function ActivityHybrid({ activity, Host }: ActivityHybridProps) {
  if (!activity) {
    return null;
  }

  const tabs = [
    {
      key: 'info',
      title: <Trans i18nKey="common:labels.info">Info</Trans>,
      content: (
        <Box bg="white" className="text-content" p="6">
          {activity?.longDescription &&
            HTMLReactParser(DOMPurify.sanitize(activity?.longDescription))}
        </Box>
      ),
      path: 'info',
    },
  ];

  if (activity?.isPublicActivity) {
    tabs.push({
      key: 'location',
      title: (
        <Trans i18nKey="activities:public.labels.location">Location</Trans>
      ),
      content: (
        <Box bg="white" p="6">
          {activity?.place && (
            <Center mb="4">
              <Text
                css={{
                  fontWeight: 'bold',
                  fontSize: 'lg',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                {activity?.place}
              </Text>
            </Center>
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
      key: 'dates',
      title: <Trans i18nKey="activities:public.labels.dates">See Dates</Trans>,
      content: (
        <Box>
          {activity.datesAndTimes?.map((occurrence) => (
            <Box
              key={occurrence.startDate + occurrence.startTime}
              p="2"
              mb="4"
              style={buttonStyle}
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
    label: isPublicActivity ? activitiesInMenu?.label : calendarInMenu?.label,
  };

  const url = `https://${activity.host}/activities/${activity._id}`;

  return (
    <TablyCentered
      action={
        !isPublicActivity &&
        activity?.resource && (
          <Center>
            <Tag>{activity?.resource}</Tag>
          </Center>
        )
      }
      dates={<ActionDates activity={activity} />}
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
