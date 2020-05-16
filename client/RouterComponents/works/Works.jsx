import React, { useState, useEffect } from 'react';
import { message } from 'antd/lib';
import { Box, Heading } from 'grommet';
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';

function Works({}) {
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
        {work => (
          <Box key={work.title} pad="medium">
            <Heading level={4}>{work.title}</Heading>
          </Box>
        )}
      </NiceList>
    </Template>
  );
}

export default Works;
