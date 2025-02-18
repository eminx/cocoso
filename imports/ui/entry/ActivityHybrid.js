import React from 'react';
import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import parseHtml from 'html-react-parser';

import TablyCentered from './TablyCentered';
import { DateJust } from './FancyDate';

function ActionDates({ activity }) {
  return (
    <Flex justify="center" wrap="wrap">
      {activity?.datesAndTimes.map(
        (occurence, occurenceIndex) =>
          occurence && (
            <Flex
              key={occurence.startDate + occurence.startTime}
              color="gray.700"
              mx="1"
              ml={occurenceIndex === 0 && '0'}
              textShadow="1px 1px 1px #fff"
            >
              <Box>
                <DateJust>{occurence.startDate}</DateJust>
              </Box>
              {occurence.startDate !== occurence.endDate && (
                <Flex>
                  {'-'}
                  <DateJust>{occurence.endDate}</DateJust>
                </Flex>
              )}
            </Flex>
          )
      )}
    </Flex>
  );
}

export default function ActivityHybrid({ activity, Host }) {
  if (!activity) {
    return null;
  }

  const tabs = [
    {
      title: <Trans i18nKey="common:labels.info">Info</Trans>,
      content: (
        <Box bg="white" className="text-content" p="6">
          {activity?.longDescription && parseHtml(activity?.longDescription)}
        </Box>
      ),
      path: 'info',
    },
  ];

  if (activity?.isPublicActivity) {
    tabs.push({
      title: <Trans i18nKey="activities:public.labels.location">Location</Trans>,
      content: (
        <Box bg="white" p="6">
          {activity?.place && (
            <Text fontWeight="bold" fontSize="lg" mb="2" textAlign="center">
              {activity?.place}
            </Text>
          )}
          {activity?.address && (
            <Text fontSize="lg">
              <b>
                <Trans i18nKey="activities:public.labels.address">Address</Trans>:{' '}
              </b>
              {activity.address}
            </Text>
          )}
        </Box>
      ),
      path: 'location',
    });
  }

  const activitiesInMenu = Host?.settings?.menu.find((item) => item.name === 'activities');
  const calendarInMenu = Host?.settings?.menu.find((item) => item.name === 'calendar');
  const { isPublicActivity } = activity;
  const backLink = {
    value: isPublicActivity ? '/activities' : '/calendar',
    label: isPublicActivity ? activitiesInMenu?.label : calendarInMenu?.label,
  };

  return (
    <TablyCentered
      action={
        <Center>
          <ActionDates activity={activity} />
        </Center>
      }
      backLink={backLink}
      images={activity?.isPublicActivity ? activity?.images || [activity?.imageUrl] : null}
      subTitle={activity?.subTitle}
      tabs={tabs}
      title={activity?.title}
    />
  );
}
