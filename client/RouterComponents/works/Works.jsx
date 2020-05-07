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

  return (
    <Template heading="My Works">
      <NiceList list={works} actionsDisabled>
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
