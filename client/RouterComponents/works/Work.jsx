import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Avatar, Heading, Text } from 'grommet';
import { Visible, Hidden } from 'react-grid-system';

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

  const AvatarHolder = () => (
    <Box alignSelf="end" align="center" flex={{ grow: 0 }}>
      <Avatar src={work.userAvatar} />
      <Text size="small">{work.authorUsername}</Text>
    </Box>
  );

  return (
    <Template
      leftContent={
        <Box pad={{ bottom: 'medium', right: 'small' }}>
          <Heading pad="small" level={2}>
            {work.title}
          </Heading>
          <Box direction="row" align="start">
            <Box flex={{ grow: 1 }}>
              {work.category && (
                <Tag
                  label={work.category.label}
                  background={work.category.color}
                />
              )}
              <Text margin={{ top: 'medium' }}>{work.shortDescription}</Text>
            </Box>
            <Visible xs sm md lg>
              <AvatarHolder />
            </Visible>
          </Box>
        </Box>
      }
      rightContent={
        <Box direction="row" pad="small" style={{ overflow: 'hidden' }}>
          <Box pad={{ left: 'small', right: 'small' }} flex={{ grow: 1 }}>
            <Heading level={4}>{work.additionalInfo}</Heading>
          </Box>
          <Hidden xs sm md lg>
            <AvatarHolder />
          </Hidden>
        </Box>
      }
    >
      <Box pad="medium" elevation="small" background="white">
        <NiceSlider images={work.images} />
        <Box margin={{ top: 'medium' }}>
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
      </Box>
    </Template>
  );
};

export default Work;
