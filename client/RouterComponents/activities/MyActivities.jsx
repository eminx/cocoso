import React, { useState, useEffect, useContext } from 'react';
import { Anchor, Box, Button, Heading, Image, Tab, Tabs, Text } from 'grommet';

import { StateContext } from '../../LayoutContainer';
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import Loader from '../../UIComponents/Loader';
import { message, Alert } from '../../UIComponents/message';
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
        <Box pad="medium">
          <ListMenu list={userMenu}>
            {(datum) => (
              <Anchor
                onClick={() => history.push(datum.value)}
                key={datum.value}
                label={
                  <Text weight={pathname === datum.value ? 'bold' : 'normal'}>
                    {datum.label}
                  </Text>
                }
              />
            )}
          </ListMenu>
        </Box>
      }
    >
      {currentUser && canCreateContent && (
        <Box pad="small" direction="row" justify="center">
          <Button
            primary
            label="NEW"
            onClick={() => history.push('/new-activity')}
          />
        </Box>
      )}

      {currentUser && activities ? (
        <Tabs>
          <Tab title="All">
            <Box pad="medium">
              <NiceList list={activities} actionsDisabled>
                {(act) => <ActivityItem act={act} history={history} />}
              </NiceList>
            </Box>
          </Tab>
          <Tab title="Public">
            <Box pad="medium">
              <NiceList
                list={activities.filter((act) => act.isPublicActivity)}
                actionsDisabled
              >
                {(act) => <ActivityItem act={act} history={history} />}
              </NiceList>
            </Box>
          </Tab>
          <Tab title="Private">
            <Box pad="medium">
              <NiceList
                list={activities.filter((act) => !act.isPublicActivity)}
                actionsDisabled
              >
                {(act) => <ActivityItem act={act} history={history} />}
              </NiceList>
            </Box>
          </Tab>
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

const ActivityItem = ({ act, history }) => (
  <Box
    width="100%"
    onClick={() => history.push(`/activity/${act._id}`)}
    hoverIndicator="light-1"
    pad="small"
    direction="row"
    margin={{ bottom: 'medium' }}
    background="white"
  >
    {act.isPublicActivity && (
      <Box width="small" height="small" margin={{ right: 'small' }}>
        <Image fit="cover" fill src={act.imageUrl} />
      </Box>
    )}
    <Box width="100%" justify="between">
      <Heading
        level={3}
        style={{ overflowWrap: 'anywhere' }}
        margin={{ bottom: 'small' }}
      >
        {act.title}
      </Heading>
      <Text weight={300}>{act.subTitle}</Text>
      <Box pad={{ vertical: 'medium' }}>
        <Text>{act.datesAndTimes.length} occurences</Text>
      </Box>
    </Box>
  </Box>
);

export default Activities;
