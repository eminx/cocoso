import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

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
  Text,
} from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import Loader from '../../UIComponents/Loader';
import { Alert } from '../../UIComponents/message';
import Tag from '../../UIComponents/Tag';
import { userMenu } from '../../constants/general';

function Activities({ history }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, canCreateContent } = useContext(StateContext);

  useEffect(() => {
    Meteor.call('getMyActivities', (error, respond) => {
      if (error) {
        setLoading(false);
        return;
      }
      setActivities(respond);
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
      heading="My Activities"
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
          >
            NEW
          </Button>
        </Center>
      )}

      {currentUser && activities ? (
        <Tabs>
          <Center>
            <TabList>
              <Tab>All</Tab>
              <Tab>Public</Tab>
              <Tab>Private</Tab>
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
              <NiceList
                actionsDisabled
                list={activities.filter((act) => act.isPublicActivity)}
              >
                {(act) => (
                  <Link to={`/activity/${act._id}`}>
                    <ActivityItem act={act} history={history} />
                  </Link>
                )}
              </NiceList>
            </TabPanel>
            <TabPanel>
              <NiceList
                actionsDisabled
                list={activities.filter((act) => !act.isPublicActivity)}
              >
                {(act) => <ActivityItem act={act} history={history} />}
              </NiceList>
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <Alert
          margin="medium"
          message="You have to create an account to launch your market"
        />
      )}
    </Template>
  );
}

const ActivityItem = ({ act }) => (
  <HStack bg="white" m="2" p="3" w="100%">
    {act.isPublicActivity && (
      <Box width="small" height="small" margin={{ right: 'small' }}>
        <Image fit="cover" w="xs" fill src={act.imageUrl} />
      </Box>
    )}
    <Box w="100%">
      <Heading size="lg" style={{ overflowWrap: 'anywhere' }} mb="1">
        {act.title}
      </Heading>
      <Tag label={act.resource} />
      <Text fontWeight="light">{act.subTitle}</Text>
      <Text fontStyle="italic" p="1" textAlign="right">
        {act.datesAndTimes.length} occurences
      </Text>
    </Box>
  </HStack>
);

export default Activities;
