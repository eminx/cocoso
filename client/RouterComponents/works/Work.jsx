import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Button, Box, Heading, Text } from 'grommet';
import {
  Avatar,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { Visible, Hidden } from 'react-grid-system';
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import NiceSlider from '../../UIComponents/NiceSlider';
import Tag from '../../UIComponents/Tag';
import { message } from '../../UIComponents/message';
import { call } from '../../functions';

const Work = ({ history, match }) => {
  const [work, setWork] = useState(null);
  const [authorContactInfo, setAuthorContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(StateContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleOpenModal = async () => {
    onOpen();
    if (authorContactInfo) {
      return;
    }

    try {
      const info = await call('getUserContactInfo', work.authorUsername);
      setAuthorContactInfo(info);
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  const author =
    work.authorFirstName && work.authorLastName
      ? work.authorFirstName + ' ' + work.authorLastName
      : work.authorUsername;

  const isOwner = currentUser && currentUser.username === match.params.username;

  const AvatarHolder = (props) => (
    <Link to={`/@${work.authorUsername}`}>
      <Box alignSelf="end" align="center" {...props}>
        <Box>
          <Avatar
            elevation="medium"
            src={work.authorAvatar ? work.authorAvatar.src : null}
            name={work.authorUsername}
          />
        </Box>
        <Anchor href={`/@${work.authorUsername}`}>
          <Text size="small">{work.authorUsername}</Text>
        </Anchor>
      </Box>
    </Link>
  );

  return (
    <Fragment>
      <Template
        leftContent={
          <Box pad={{ top: 'medium', bottom: 'small', horizontal: 'medium' }}>
            <Box direction="row" align="start" justify="between">
              <Box pad={{ right: 'small' }}>
                <Text weight={600} margin={{ bottom: 'xsmall' }} size="large">
                  {work.title}
                </Text>
                {work.category && (
                  <Tag
                    label={work.category.label}
                    background={work.category.color}
                  />
                )}
                <Text margin={{ top: 'small' }}>{work.shortDescription}</Text>
              </Box>
              <Box flex={{ shrink: 0, grow: 0 }}>
                <Visible xs sm md lg>
                  <AvatarHolder />
                </Visible>
              </Box>
            </Box>
          </Box>
        }
        rightContent={
          <Box>
            <Box
              direction="row"
              pad="medium"
              justify="between"
              style={{ overflow: 'hidden' }}
              align="start"
            >
              <Box width="100%" pad={{ top: 'small' }}>
                <Hidden lg xl>
                  <Heading
                    level={4}
                    textAlign="center"
                    style={{ marginTop: 0 }}
                  >
                    {work.additionalInfo}
                  </Heading>
                </Hidden>
                <Visible lg xl>
                  <Heading level={4}>{work.additionalInfo}</Heading>
                </Visible>
              </Box>
              <Box flex={{ shrink: 0 }}>
                <Hidden xs sm md lg>
                  <AvatarHolder />
                </Hidden>
              </Box>
            </Box>

            <Button
              onClick={handleOpenModal}
              alignSelf="center"
              secondary
              size="small"
              label={`Contact ${work.authorUsername}`}
            />
          </Box>
        }
      >
        <Box margin={{ top: 'medium' }} background="white">
          <NiceSlider images={work.images} />
          <Box margin={{ top: 'medium' }} pad="medium">
            <div className="text-content">
              {renderHTML(work.longDescription)}{' '}
            </div>
          </Box>
        </Box>
      </Template>
      <Box
        margin={{ top: 'medium', bottom: 'large' }}
        direction="row"
        justify="center"
      >
        {isOwner && (
          <Link
            to={`/${currentUser.username}/edit-work/${match.params.workId}`}
          >
            <Anchor
              as="span"
              alignSelf="center"
              size="small"
              label="Edit this Work"
            />
          </Link>
        )}
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={handleOpenModal}
        size="sm"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{author}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className="text-content" margin={{ bottom: 'medium' }}>
              {authorContactInfo ? renderHTML(authorContactInfo) : 'Loading...'}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default Work;
