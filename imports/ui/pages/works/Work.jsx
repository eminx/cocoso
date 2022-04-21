import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Visible, Hidden } from 'react-grid-system';
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Template from '../../components/Template';
import NiceSlider from '../../components/NiceSlider';
import { message } from '../../components/message';
import { call } from '../../utils/shared';

function Work() {
  const [work, setWork] = useState(null);
  const [authorContactInfo, setAuthorContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(StateContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { username, workId } = useParams();

  const [tc] = useTranslation('common');
  const [tm] = useTranslation('members');

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
        setAuthorContactInfo(tm('message.contect.empty'));
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
      <VStack justify="center" {...props}>
        <Avatar
          elevation="medium"
          src={work.authorAvatar ? work.authorAvatar.src : null}
          name={work.authorUsername}
        />
        <Button as="span" variant="link" href={`/@${work.authorUsername}`}>
          <Text fontSize="sm">{work.authorUsername}</Text>
        </Button>
      </VStack>
    </Link>
  );

  return (
    <Fragment>
      <Template
        leftContent={
          <Box pt="2" pb="1" px="2">
            <Flex justify="space-between">
              <Box>
                <Heading as="h2" size="lg" mb={1}>
                  {work.title}
                </Heading>
                <Text mb="4">{work.shortDescription}</Text>
                {work.category && (
                  <Badge variant="outline" color="gray.800" fontSize="md">
                    {work.category.label}
                  </Badge>
                )}
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
              <Button onClick={handleOpenModal} variant="ghost">
                {`${tc('labels.contact')} ${work.authorUsername}`}
              </Button>
            </Center>
          </Box>
        }
      >
        <Box mt="2" bg="white">
          <NiceSlider images={work.images} />
          <Box mt="2" p="4">
            <div className="text-content">
              {renderHTML(work.longDescription)}{' '}
            </div>
          </Box>
        </Box>
      </Template>

      <Center my="2">
        {isOwner && (
          <Link to={`/${currentUser.username}/edit-work/${workId}`}>
            <Button size="sm" variant="ghost">
              {tc('actions.update')}
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
