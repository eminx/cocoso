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
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Template from '../../components/Template';
import NiceSlider from '../../components/NiceSlider';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import Tably from '../../components/Tably';

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
        setAuthorContactInfo(tm('message.contact.empty', { username: work.authorUsername }));
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
      ? `${work.authorFirstName} ${work.authorLastName}`
      : work.authorUsername;

  const isOwner = currentUser && currentUser.username === username;

  const AvatarHolder = (props) => (
    <Link to={`/@${work.authorUsername}`}>
      <VStack justify="center" {...props}>
        <Avatar elevation="medium" src={work.authorAvatar} name={work.authorUsername} />
        <Button as="span" variant="link" href={`/@${work.authorUsername}`}>
          <Text fontSize="sm">{work.authorUsername}</Text>
        </Button>
      </VStack>
    </Link>
  );

  const tabs = [
    {
      title: tc('labels.info'),
      content: (
        <Box>
          <div
            style={{
              whiteSpace: 'pre-line',
              color: 'rgba(0,0,0, .85)',
            }}
            className="text-content"
          >
            {renderHTML(work.longDescription)}
          </div>
        </Box>
      ),
      path: `/@${work.authorUsername}/works/${work._id}/info`,
    },
    {
      title: tc('labels.extra'),
      content: (
        <Box>
          <Flex
            align="center"
            direction="row"
            justify="space-between"
            p="2"
            style={{ overflow: 'hidden' }}
          >
            <Box w="100%" pt="1">
              <Text fontSize="lg">{work.additionalInfo}</Text>
            </Box>
            <Box>
              <AvatarHolder />
            </Box>
          </Flex>
        </Box>
      ),
      path: `/@${work.authorUsername}/works/${work._id}/extra`,
    },
    {
      title: tc('labels.contact'),
      content: (
        <Box className="text-content" mb="2" p="4">
          {authorContactInfo
            ? renderHTML(authorContactInfo)
            : tc('message.loading', { something: '' })}
        </Box>
      ),
      onClick: () => handleOpenModal(),
      path: `/@${work.authorUsername}/works/${work._id}/contact`,
    },
  ];

  const tabNav = {
    path: '/works',
    label: 'Works',
  };

  return (
    <>
      <Tably
        images={work.images}
        nav={tabNav}
        subTitle={work.subTitle}
        tabs={tabs}
        title={work.title}
      />
      <Center my="2">
        {isOwner && (
          <Link to={`/@${currentUser.username}/works/${workId}/edit`}>
            <Button variant="ghost">{tc('actions.update')}</Button>
          </Link>
        )}
      </Center>
    </>
  );
}

export default Work;
