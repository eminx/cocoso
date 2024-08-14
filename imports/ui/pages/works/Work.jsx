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
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentHost, currentUser } = useContext(StateContext);
  const { usernameSlug, workId } = useParams();
  const [empty, username] = usernameSlug.split('@');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getWork();
  }, []);

  const getWork = async () => {
    try {
      const response = await call('getWork', workId, username);
      setWork(response);
      const docs = await call('getDocumentsByAttachments', response._id);
      setDocuments(docs);
      setLoading(false);
    } catch (error) {
      message.error(error.reason);
      setLoading(false);
    }
  };

  if (!work || loading) {
    return null;
  }

  const isOwner = currentUser && currentUser.username === username;

  const tabs = [
    {
      title: tc('labels.info'),
      content: (
        <Box bg="white" className="text-content" p="6">
          {renderHTML(work.longDescription)}
        </Box>
      ),
      path: 'info',
    },
  ];

  if (work.additionalInfo?.length > 2) {
    tabs.push({
      title: tc('labels.extra'),
      content: (
        <Box p="4">
          <Text fontSize="lg">{work.additionalInfo}</Text>
        </Box>
      ),
      path: 'extra',
    });
  }

  if (documents && documents[0]) {
    tabs.push({
      title: tc('documents.label'),
      content: (
        <Box p="4">
          <DocumentsField contextType="works" contextId={work._id} />
        </Box>
      ),
      path: 'documents',
    });
  }

  if (work.contactInfo) {
    tabs.push({
      title: tc('labels.contact'),
      content: (
        <Box className="text-content" p="4" textAlign="center">
          {renderHTML(work.contactInfo)}
        </Box>
      ),
      path: 'contact',
    });
  }

  const adminMenu = {
    label: 'Admin',
    items: [
      {
        label: tc('actions.update'),
        link: 'edit',
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
