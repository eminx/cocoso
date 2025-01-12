import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';

import WrapperSSR from '../layout/WrapperSSR';
import TablyCentered from '../components/TablyCentered';

export default function ActivityHybrid({ activity, Host }) {
  const { t } = useTranslation('activities');
  const { tc } = useTranslation('common');

  if (!activity) {
    return null;
  }

  const tabs = [
    {
      title: t('public.labels.info'),
      content: (
        <Box bg="white" className="text-content" p="6">
          {activity?.longDescription && parseHtml(activity?.longDescription)}
        </Box>
      ),
      path: 'info',
    },
    {
      title: t('public.labels.dates'),
      content: <div>Dates</div>,
      path: 'dates',
    },
  ];

  if (activity?.isPublicActivity) {
    tabs.push({
      title: t('public.labels.location'),
      content: (
        <Box px="4">
          {activity?.place && (
            <Text fontWeight="bold" fontSize="lg" mb="2" textAlign="center">
              {activity?.place}
            </Text>
          )}
          {activity?.address && <Text fontSize="lg">{'Address: ' + activity.address}</Text>}
        </Box>
      ),
      path: 'location',
    });
  }

  // if (canCreateContent) {
  //   tabs.push({
  //     title: tc('labels.discussion'),
  //     content: (
  //       <>
  //         <Text mb="2" px="2" textAlign="center">
  //           {t('public.chat.heading')}
  //         </Text>
  //         <Chattery
  //           isMember
  //           messages={discussion}
  //           onNewMessage={this.addNewChatMessage}
  //           removeNotification={this.removeNotification}
  //         />
  //       </>
  //     ),
  //     path: 'discussion',
  //   });
  // }

  return (
    <TablyCentered
      action={null}
      adminMenu={null}
      backLink={{ value: '/activities', label: 'Activities' }}
      images={activity?.isPublicActivity ? activity?.images || [activity?.imageUrl] : null}
      subTitle={activity?.subTitle}
      tabs={tabs}
      title={activity?.title}
    />
  );
}
