import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Button,
  Center,
  Link as CLink,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import Tably from '../../components/Tably';
import Tag from '../../components/Tag';

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

  const AvatarHolder = () => (
    <Link to={`/@${work.authorUsername}`}>
      <VStack justify="center">
        <Avatar elevation="medium" src={work.authorAvatar} name={work.authorUsername} size="lg" />
        <Link to={`/@${work.authorUsername}`}>
          <CLink as="span">{work.authorUsername}</CLink>
        </Link>
      </VStack>
    </Link>
  );

  const tabs = [
    {
      title: tc('labels.info'),
      content: (
        <Box>
          <Tag label={work.category.label} mb="4" />
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
          <Text fontSize="lg">{work.additionalInfo}</Text>
        </Box>
      ),
      path: `/@${work.authorUsername}/works/${work._id}/extra`,
    },
    {
      title: tc('labels.contact'),
      content: authorContactInfo ? (
        <Box className="text-content">{renderHTML(authorContactInfo)}</Box>
      ) : (
        <Loader />
      ),
      onClick: () => handleOpenModal(),
      path: `/@${work.authorUsername}/works/${work._id}/contact`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{work.title}</title>
      </Helmet>
      <Tably
        images={work.images}
        navPath="works"
        subTitle={work.subTitle}
        tabs={tabs}
        title={work.title}
        author={{
          src: work.authorAvatar,
          username: work.authorUsername,
          link: `/@${work.authorUsername}`,
        }}
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
