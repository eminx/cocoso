import React, { useState, useEffect } from 'react';
import { message } from 'antd/lib';
import { Heading, Box, Image, Text } from 'grommet';
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';

function Works({ history }) {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    Meteor.call('getMyWorks', (error, respond) => {
      if (error) {
        message.error(error.reason);
        return;
      }
      setWorks(respond);
    });
  }, []);

  if (!works) {
    return null;
  }

  const myWorksWithActions = works.map(work => ({
    ...work,
    actions: [
      {
        content: 'Remove',
        handleClick: () => this.removeWork(work._id)
      }
    ]
  }));

  return (
    <Template heading="My Works">
      <NiceList list={myWorksWithActions} actionsDisabled>
        {work => <WorkItem work={work} history={history} />}
      </NiceList>
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
