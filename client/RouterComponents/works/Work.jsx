import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Avatar, Heading, Text } from 'grommet';
import { Visible, Hidden } from 'react-grid-system';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import NiceSlider from '../../UIComponents/NiceSlider';
import Tag from '../../UIComponents/Tag';
import { message } from '../../UIComponents/message';
import { call } from '../../functions';

const Work = ({ history, match }) => {
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(StateContext);

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

  const AvatarHolder = (props) => (
    <Box alignSelf="end" align="center" {...props}>
      <Avatar src={work.userAvatar} />
      <Text size="small">{work.authorUsername}</Text>
    </Box>
  );

  return (
    <Template
      leftContent={
        <Box pad="medium">
          <Heading level={2}>{work.title}</Heading>
          <Box direction="row" align="start" justify="between">
            <Box pad={{ right: 'small' }} width="220px">
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
        <Box
          direction="row"
          pad="medium"
          justify="between"
          style={{ overflow: 'hidden' }}
        >
          <Box width="100%">
            <Hidden lg xl>
              <Heading level={4} textAlign="center" style={{ marginTop: 0 }}>
                {work.additionalInfo}
              </Heading>
            </Hidden>
            <Visible lg xl>
              <Heading level={4}>{work.additionalInfo}</Heading>
            </Visible>
          </Box>
          <Hidden xs sm md lg>
            <AvatarHolder />
          </Hidden>
        </Box>
      }
    >
      <Box margin={{ top: 'medium' }} elevation="xsmall" background="white">
        <NiceSlider images={work.images} />
        <Box margin={{ top: 'medium' }} pad="medium">
          <div dangerouslySetInnerHTML={{ __html: work.longDescription }} />
        </Box>
      </Box>
      <Box pad="medium">
        {isOwner && (
          <Button
            alignSelf="center"
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
