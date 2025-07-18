import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Heading,
  HStack,
  Image,
  Loader,
  Tag,
  Text,
} from '/imports/ui/core';

import { StateContext } from '../../LayoutContainer';
import NiceList from '../../generic/NiceList';
import Template from '../../layout/Template';
import TablyRouter from '/imports/ui/generic/TablyRouter';

const focusStyle = {
  boxShadow: 'none',
};

function ActivityItem({ act }) {
  const [t] = useTranslation('activities');

  return (
    <HStack align="flex-start" bg="white" p="3" w="100%">
      {act.isPublicActivity && (
        <Box p="2">
          <Image
            fit="cover"
            w="xs"
            fill
            src={act.imageUrl || (act.images && act.images[0])}
          />
        </Box>
      )}
      <Box w="100%">
        <Heading mb="2" overflowWrap="anywhere" size="md">
          {act.title}
        </Heading>
        {act.resource && <Tag mb="2">{act.resource}</Tag>}
        <Text fontWeight="light">{act.subTitle}</Text>
        <Text fontStyle="italic" p="1" textAlign="right">
          {act.datesAndTimes.length} {t('members.occurences')}
        </Text>
      </Box>
    </HStack>
  );
}

export default function Activities({ history }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(StateContext);

  const [t] = useTranslation('activities');
  const [tm] = useTranslation('members');
  const [tc] = useTranslation('common');

  useEffect(() => {
    Meteor.call('getMyActivities', (error, respond) => {
      if (error) {
        setLoading(false);
        return;
      }
      setActivities(respond.reverse());
      setLoading(false);
    });
  }, []);

  const allActivities = activities;
  const publicActivities = activities.filter((act) => act.isPublicActivity);
  const privateActivities = activities.filter((act) => !act.isPublicActivity);

  const renderList = (activities) => {
    return (
      <NiceList list={activities}>
        {(act) => (
          <Link to={`/activities/${act._id}/info`}>
            <ActivityItem act={act} />
          </Link>
        )}
      </NiceList>
    );
  };

  if (loading || !activities) {
    return <Loader />;
  }

  const tabs = [
    {
      title: t('members.tabs.all'),
      path: '/activities',
      content: renderList(allActivities),
    },
    {
      title: t('members.tabs.public'),
      path: '/activities/public',
      content: renderList(publicActivities),
    },
    {
      title: t('members.tabs.private'),
      path: '/activities/private',
      content: renderList(privateActivities),
    },
  ];

  return (
    <>
      <Template heading={tc('menu.member.activities')}>
        {currentUser && activities ? (
          <TablyRouter tabs={tabs} />
        ) : (
          <Alert message={tm('message.guest')} />
        )}
      </Template>
    </>
  );
}
