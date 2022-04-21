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
import ListMenu from '../../components/ListMenu';
import Loader from '../../components/Loader';
import { Alert } from '../../components/message';
import { userMenu } from '../../utils/constants/general';

function Activities({ history }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, canCreateContent } = useContext(StateContext);

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

  // const myWorksWithActions = bookings.reverse().map((booking) => ({
  //   ...booking,
  //   actions: [
  //     {
  //       content: 'Remove',
  //       handleClick: () => this.removeWork(work._id),
  //     },
  //   ],
  // }));

  const pathname = history && history.location.pathname;

  return (
    <Template
      heading={t('members.label')}
      titleCentered
      leftContent={
        <Box p="2">
          <ListMenu pathname={pathname} list={userMenu} />
        </Box>
      }
    >
      {currentUser && canCreateContent && (
        <Center>
          <Button
            colorScheme="green"
            variant="outline"
            onClick={() => history.push('/new-activity')}
            mb="4"
            textTransform="uppercase"
          >
            {tc('actions.create')}
          </Button>
        </Center>
      )}

      {currentUser && activities ? (
        <Tabs>
          <Center>
            <TabList>
              <Tab>{t('members.tabs.all')}</Tab>
              <Tab>{t('members.tabs.public')}</Tab>
              <Tab>{t('members.tabs.private')}</Tab>
            </TabList>
          </Center>

          <TabPanels>
            <TabPanel>
              <NiceList actionsDisabled list={activities}>
                {(act) => (
                  <Link to={`/activity/${act._id}`}>
                    <ActivityItem act={act} />
                  </Link>
                )}
              </NiceList>
            </TabPanel>
            <TabPanel>
              <NiceList actionsDisabled list={activities.filter((act) => act.isPublicActivity)}>
                {(act) => (
                  <Link to={`/activity/${act._id}`}>
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
