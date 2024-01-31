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
import TablyCentered from '../../components/TablyCentered';
import DocumentsField from '../resources/components/DocumentsField';

function Work() {
  const [work, setWork] = useState(null);
  const [authorContactInfo, setAuthorContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentHost, currentUser, isDesktop } = useContext(StateContext);
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
        <Box className="text-content" p="4">
          {renderHTML(work.longDescription)}
        </Box>
      ),
      path: `/@${work.authorUsername}/works/${work._id}/info`,
    },
  ];

  if (work.additionalInfo?.length > 2) {
    tabs.push({
      title: tc('labels.extra'),
      content: (
        <Box>
          <Text fontSize="lg">{work.additionalInfo}</Text>
        </Box>
      ),
      path: `/@${work.authorUsername}/works/${work._id}/extra`,
    });
  }

  tabs.push({
    title: tc('documents.label'),
    content: (
      <DocumentsField
        contextType="works"
        contextId={work?._id}
        isAllowed={work?.authorId === currentUser?._id}
      />
    ),
    path: `/@${work.authorUsername}/works/${work._id}/documents`,
  });

  tabs.push({
    title: tc('labels.contact'),
    content: authorContactInfo ? (
      <Box className="text-content" textAlign="center">
        {renderHTML(authorContactInfo)}
      </Box>
    ) : (
      <Loader />
    ),
    onClick: () => getUserContactInfo(),
    path: `/@${work.authorUsername}/works/${work._id}/contact`,
  });

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
      <TablyCentered
        adminMenu={isOwner ? adminMenu : null}
        author={
          work.showAvatar && {
            src: work.authorAvatar,
            username: work.authorUsername,
            link: `/@${work.authorUsername}`,
          }
        }
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
