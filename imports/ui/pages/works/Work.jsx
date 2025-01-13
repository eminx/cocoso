import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Text } from '@chakra-ui/react';
import parseHtml from 'html-react-parser';
import { Helmet } from 'react-helmet';

import { StateContext } from '../../LayoutContainer';
import { ContentLoader } from '../../components/SkeletonLoaders';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import TablyCentered from '../../components/TablyCentered';
import DocumentsField from '../resources/components/DocumentsField';
import WorkHybrid from '../../entry/WorkHybrid';

function Work() {
  const initialWork = window?.__PRELOADED_STATE__?.work || null;
  const initialDocuments = window?.__PRELOADED_STATE__?.documents || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;
  const [work, setWork] = useState(initialWork);
  const [documents, setDocuments] = useState(initialDocuments);
  const [loading, setLoading] = useState(false);
  let { currentHost, currentUser } = useContext(StateContext);
  const { usernameSlug, workId } = useParams();
  const [empty, username] = usernameSlug.split('@');
  const [tc] = useTranslation('common');

  if (!currentHost) {
    currentHost = Host;
  }

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

  if (!work) {
    return <ContentLoader />;
  }

  const tags = work && [work.category?.label];

  const worksInMenu = currentHost?.settings?.menu?.find((item) => item.name === 'works');
  const backLink = {
    value: '/works',
    label: worksInMenu?.label,
  };

  return <WorkHybrid documents={documents} work={work} Host={Host} />;
}

export default Work;
