import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  Text,
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

function Work() {
  const [work, setWork] = useState(null);
  const [authorContactInfo, setAuthorContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(StateContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { username, workId } = useParams();

  useEffect(() => {
    getWork();
  }, []);

  const getWork = async () => {
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
      if (!info) {
        setAuthorContactInfo('No contact info registered for this user');
        return;
      }
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

  const isOwner = currentUser && currentUser.username === username;

  const AvatarHolder = (props) => (
    <Link to={`/@${work.authorUsername}`}>
      <Box {...props}>
        <Box>
          <Avatar
            elevation="medium"
            src={work.authorAvatar ? work.authorAvatar.src : null}
            name={work.authorUsername}
          />
        </Box>
        <Button
          as="span"
          variant="link"
          colorScheme="gray.800"
          href={`/@${work.authorUsername}`}
        >
          <Text fontSize="sm">{work.authorUsername}</Text>
        </Button>
      </Box>
    </Link>
  );

  return (
    <Fragment>
      <Template
        leftContent={
          <Box pt="2" pb="1" px="2">
            <Flex justify="space-between">
              <Box>
                <Heading as="h3" size="lg" mb={2}>
                  {work.title}
                </Heading>
                {work.category && (
                  <Badge fontSize="md">{work.category.label}</Badge>
                )}
                <Text>{work.shortDescription}</Text>
              </Box>
              <Box>
                <Visible xs sm md>
                  <AvatarHolder />
                </Visible>
              </Box>
            </Flex>
          </Box>
        }
        rightContent={
          <Box>
            <Flex
              align="center"
              direction="row"
              justify="space-between"
              p="2"
              style={{ overflow: 'hidden' }}
            >
              <Box w="100%" pt="1">
                <Hidden lg xl>
                  <Text fontSize="lg" textAlign="center" ml="2">
                    {work.additionalInfo}
                  </Text>
                </Hidden>
                <Visible lg xl>
                  <Text fontSize="lg">{work.additionalInfo}</Text>
                </Visible>
              </Box>
              <Box>
                <Hidden xs sm md>
                  <AvatarHolder />
                </Hidden>
              </Box>
            </Flex>
            <Center p="2" mt="4">
              <Button onClick={handleOpenModal} variant="outline">
                {`Contact ${work.authorUsername}`}
              </Button>
            </Center>
          </Box>
        }
      >
        <Box mt="2" bg="white">
          <NiceSlider images={work.images} />
          <Box mt="2" p="2">
            <div className="text-content">
              {renderHTML(work.longDescription)}{' '}
            </div>
          </Box>
        </Box>
      </Template>

      <Center my="2" margin={{ top: 'medium', bottom: 'large' }}>
        {isOwner && (
          <Link to={`/${currentUser.username}/edit-work/${workId}`}>
            <Button size="sm" variant="ghost">
              Edit
            </Button>
          </Link>
        )}
      </Center>

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
            <Box className="text-content" mb="2">
              {authorContactInfo ? renderHTML(authorContactInfo) : 'Loading...'}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}

export default Work;
