import React, { useState, useEffect, useContext } from 'react';
import { Heading, Anchor, Box, Button, Image, Text } from 'grommet';

import { StateContext } from '../../LayoutContainer';
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import Loader from '../../UIComponents/Loader';
import { message, Alert } from '../../UIComponents/message';
import { userMenu } from '../../constants/general';

function Works({ history }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(StateContext);

  useEffect(() => {
    Meteor.call('getMyWorks', (error, respond) => {
      if (error) {
        setLoading(false);
        return;
      }
      setWorks(respond);
      setLoading(false);
    });
  }, []);

  if (loading || !works) {
    return <Loader />;
  }

  const myWorksWithActions = works.reverse().map((work) => ({
    ...work,
    actions: [
      {
        content: 'Remove',
        handleClick: () => this.removeWork(work._id),
      },
    ],
  }));

  const pathname = history && history.location.pathname;

  return (
    <Template
      heading="My Works"
      titleCentered
      leftContent={
        <Box pad="medium">
          <ListMenu pathname={pathname} list={userMenu} />
        </Box>
      }
      rightContent={
        currentUser && (
          <Box pad="small" direction="row" justify="center">
            <Button
              primary
              label="New Work"
              onClick={() => history.push('/new-work')}
            />
          </Box>
        )
      }
    >
      {currentUser && works ? (
        <NiceList list={myWorksWithActions} actionsDisabled>
          {(work) => <WorkItem work={work} history={history} />}
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

const WorkItem = ({ work, history }) => (
  <Box
    width="100%"
    onClick={() => history.push(`/${work.authorUsername}/work/${work._id}`)}
    hoverIndicator="light-1"
    pad="small"
    direction="row"
    margin={{ bottom: 'medium' }}
    background="white"
  >
    <Box width="small" height="small" margin={{ right: 'small' }}>
      <Image fit="cover" fill src={work.images && work.images[0]} />
    </Box>
    <Box width="100%" justify="between">
      <Heading
        level={3}
        style={{ overflowWrap: 'anywhere' }}
        margin={{ bottom: 'small' }}
      >
        {work.title}
      </Heading>
      <Text weight={300}>{work.shortDescription}</Text>
      <Box>
        <Text size="small" color="dark-3" textAlign="end">
          {work.authorUsername}
        </Text>
      </Box>
    </Box>
  </Box>
);

export default Works;
