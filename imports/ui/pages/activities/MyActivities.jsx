import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tag,
  TagLabel,
  Text,
} from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import NiceList from '../../components/NiceList';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ListMenu from '../../components/ListMenu';
import Loader from '../../components/Loader';
import { Alert } from '../../components/message';
import { userMenu } from '../../utils/constants/general';

const focusStyle = {
  boxShadow: 'none',
};

function Activities({ history }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentHost, currentUser, canCreateContent } = useContext(StateContext);

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

  if (loading || !activities) {
    return <Loader />;
  }

  const membersInMenu = currentHost?.settings?.menu?.find((item) => item.name === 'members');

  const furtherBreadcrumbLinks = [
    {
      label: membersInMenu?.label,
      link: '/members',
    },
    {
      label: currentUser.username,
      link: `/@${currentUser.username}`,
    },
    {
      label: tc('domains.activities'),
      link: null,
    },
  ];

  return (
    <>
      <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
      <Template heading={tc('menu.member.activities')}>
        {currentUser && activities ? (
          <Tabs>
            <Box p="4">
              <TabList>
                <Tab _focus={focusStyle}>{t('members.tabs.all')}</Tab>
                <Tab _focus={focusStyle}>{t('members.tabs.public')}</Tab>
                <Tab _focus={focusStyle}>{t('members.tabs.private')}</Tab>
              </TabList>
            </Box>

            <TabPanels>
              <TabPanel>
                <NiceList actionsDisabled list={activities}>
                  {(act) => (
                    <Link to={`/activities/${act._id}`}>
                      <ActivityItem act={act} />
                    </Link>
                  )}
                </NiceList>
              </TabPanel>
              <TabPanel>
                <NiceList actionsDisabled list={activities.filter((act) => act.isPublicActivity)}>
                  {(act) => (
                    <Link to={`/activities/${act._id}`}>
                      <ActivityItem act={act} history={history} />
                    </Link>
                  )}
                </NiceList>
              </TabPanel>
              <TabPanel>
                <NiceList actionsDisabled list={activities.filter((act) => !act.isPublicActivity)}>
                  {(act) => <ActivityItem act={act} history={history} />}
                </NiceList>
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <Alert margin="medium" message={tm('message.guest')} />
        )}
      </Template>
    </>
  );
}

const ActivityItem = ({ act }) => {
  const [t] = useTranslation('activities');

  return (
    <HStack align="flex-start" bg="white" p="3" w="100%">
      {act.isPublicActivity && (
        <Box p="2">
          <Image fit="cover" w="xs" fill src={act.imageUrl} />
        </Box>
      )}
      <Box w="100%">
        <Heading mb="2" overflowWrap="anywhere" size="md">
          {act.title}
        </Heading>
        <Tag>
          <TagLabel>{act.resource}</TagLabel>
        </Tag>
        <Text fontWeight="light">{act.subTitle}</Text>
        <Text fontStyle="italic" p="1" textAlign="right">
          {act.datesAndTimes.length} {t('members.occurences')}
        </Text>
      </Box>
    </HStack>
  );
};

export default Activities;
