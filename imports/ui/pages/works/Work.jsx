import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Text } from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import Tably from '../../components/Tably';
import Breadcrumb from '../../components/Breadcrumb';
import DocumentsField from '../resources/components/DocumentsField';

function Work() {
  const [work, setWork] = useState(null);
  const [authorContactInfo, setAuthorContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentHost, currentUser } = useContext(StateContext);
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

  const getUserContactInfo = async () => {
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

  const isOwner = currentUser && currentUser.username === username;

  const tabs = [
    {
      title: tc('labels.info'),
      content: (
        <Box
          bg="white"
          className="text-content"
          color="rgba(0,0,0, .85)"
          px="4"
          py="3"
          whiteSpace="pre-line"
        >
          {renderHTML(work.longDescription)}
        </Box>
      ),
      path: `/@${work.authorUsername}/works/${work._id}/info`,
    },
    {
      title: tc('labels.extra'),
      content: (
        <Box px="4">
          <Text fontSize="lg">{work.additionalInfo}</Text>
        </Box>
      ),
      path: `/@${work.authorUsername}/works/${work._id}/extra`,
    },
    {
      title: tc('documents.label'),
      content: <DocumentsField contextType="works" contextId={work?._id} />,
      path: `/@${work.authorUsername}/works/${work._id}/documents`,
    },
    {
      title: tc('labels.contact'),
      content: authorContactInfo ? (
        <Box className="text-content">{renderHTML(authorContactInfo)}</Box>
      ) : (
        <Loader />
      ),
      onClick: () => getUserContactInfo(),
      path: `/@${work.authorUsername}/works/${work._id}/contact`,
    },
  ];

  const adminMenu = {
    label: 'Admin',
    items: [
      {
        label: tc('actions.update'),
        link: `/@${work.authorUsername}/works/${work._id}/edit`,
      },
    ],
  };

  const tags = [work.category?.label];

  const worksInMenu = currentHost?.settings?.menu?.find((item) => item.name === 'works');
  const backLink = {
    value: '/works',
    label: worksInMenu?.label,
  };

  return (
    <>
      <Helmet>
        <title>{work.title}</title>
      </Helmet>
      <Tably
        adminMenu={isOwner ? adminMenu : null}
        author={{
          src: work.authorAvatar,
          username: work.authorUsername,
          link: `/@${work.authorUsername}`,
        }}
        backLink={backLink}
        images={work.images}
        subTitle={work.shortDescription}
        tabs={tabs}
        tags={tags}
        title={work.title}
      />
    </>
  );
}

export default Work;
