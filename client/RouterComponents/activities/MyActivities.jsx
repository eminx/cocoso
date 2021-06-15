import React, { useState, useEffect, useContext } from 'react';
import { Heading, Anchor, Box, Button, Image, Text } from 'grommet';

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
  const { currentUser } = useContext(StateContext);

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
      rightContent={
        currentUser && (
          <Box pad="small" direction="row" justify="center">
            <Button
              primary
              label="New Activity"
              onClick={() => history.push('/new-activity')}
            />
          </Box>
        )
      }
    >
      {currentUser && activities ? (
        <NiceList list={activities} actionsDisabled>
          {(act) => <ActivityItem act={act} history={history} />}
        </NiceList>
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
    onClick={() => history.push(`/${act.authorUsername}/work/${act._id}`)}
    hoverIndicator="light-1"
    pad="small"
    direction="row"
    margin={{ bottom: 'medium' }}
    background="white"
  >
    <Box width="small" height="small" margin={{ right: 'small' }}>
      <Image fit="cover" fill src={act.images && act.images[0]} />
    </Box>
    <Box width="100%" justify="between">
      <Heading
        level={3}
        style={{ overflowWrap: 'anywhere' }}
        margin={{ bottom: 'small' }}
      >
        {act.title}
      </Heading>
      <Text weight={300}>{act.shortDescription}</Text>
      <Box>
        <Text size="small" color="dark-3" textAlign="end">
          {act.authorUsername}
        </Text>
      </Box>
    </Box>
  </Box>
);

export default Activities;
