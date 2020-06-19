import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Avatar, Heading, Text } from 'grommet';

import { UserContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import NiceSlider from '../../UIComponents/NiceSlider';
import Tag from '../../UIComponents/Tag';
import { message } from '../../UIComponents/message';
import { call } from '../../functions';

const Work = ({ history, match }) => {
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    getWork();
  }, []);

  const getWork = async () => {
    const workId = match.params.workId;
    const username = match.params.username;

    try {
      const response = await call('getWork', workId, username);
      setWork(response);
      setLoading(false);
    } catch (error) {
      message.error(error.reason);
      setLoading(false);
    }
  };

  if (!work || loading) {
    return <Loader />;
  }

  const author =
    work.authorFirstName && work.authorLastName
      ? work.authorFirstName + ' ' + work.authorLastName
      : work.authorUsername;

  const isOwner = currentUser && currentUser.username === match.params.username;

  return (
    <Template
      leftContent={
        <Box pad={{ bottom: 'medium' }}>
          <Heading pad="small" level={2}>
            {work.title}
          </Heading>
          <Text>{work.shortDescription}</Text>
          {work.category && <Tag label={work.category} />}
        </Box>
      }
      rightContent={
        <Box>
          <Box
            round
            background="light-2"
            direction="row"
            justify="between"
            align="center"
          >
            <Text margin={{ left: 'medium' }} weight="bold">
              {work.authorUsername}
            </Text>
            <Avatar src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80" />
          </Box>
          <Box
            pad={{
              top: 'medium',
              bottom: 'small',
            }}
          >
            <Text>{work.additionalInfo}</Text>
          </Box>
        </Box>
      }
    >
      <NiceSlider images={work.images} />
      <Box pad={{ top: 'medium' }}>
        <div dangerouslySetInnerHTML={{ __html: work.longDescription }} />
      </Box>
      <Box margin={{ top: 'large', bottom: 'large' }} justify="end">
        {isOwner && (
          <Button
            size="small"
            onClick={() =>
              history.push(
                `/${currentUser.username}/edit-work/${match.params.workId}`
              )
            }
            label="Edit this work"
          />
        )}
      </Box>
    </Template>
  );
};

export default Work;
