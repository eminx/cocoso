import React from 'react';
import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';

import TablyCentered from '../components/TablyCentered';
import { DateJust } from '../components/FancyDate';
import { ChatButton } from '../chattery/ChatHandler';

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

export default function ActivityHybrid({ activity, currentUser, Host }) {
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');

  if (!activity) {
    return null;
  }

  const tabs = [
    {
      title: tc('labels.info'),
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
      title: t('public.labels.location'),
      content: (
        <Box bg="white" p="4">
          {activity?.place && (
            <Text fontWeight="bold" fontSize="lg" mb="2" textAlign="center">
              {activity?.place}
            </Text>
          )}
          {activity?.address && (
            <Text fontSize="lg">
              <b>{t('public.labels.address')}: </b>
              {activity.address}
            </Text>
          )}
        </Box>
      ),
      path: 'location',
    });
  }

  const activitiesInMenu = Host?.settings?.menu.find((item) => item.name === 'activities');

  const role = currentUser && currentUser.memberships?.find((m) => m.host === Host.host)?.role;
  const canCreateContent = role && ['admin', 'cocreator'].includes(role);

  return (
    <TablyCentered
      action={
        <Center>
          <Flex align="flex-start" justify="center" maxW="860px" w="100%">
            <Box px="12">
              <ActionDates activity={activity} />
            </Box>
            {canCreateContent ? (
              <Box>
                <ChatButton
                  context="activities"
                  currentUser={currentUser}
                  item={activity}
                  withInput
                />
              </Box>
            ) : null}
          </Flex>
        </Center>
      }
      adminMenu={null}
      backLink={{ value: '/activities', label: activitiesInMenu?.label }}
      images={activity?.isPublicActivity ? activity?.images || [activity?.imageUrl] : null}
      subTitle={activity?.subTitle}
      tabs={tabs}
      title={activity?.title}
    />
  );
}
