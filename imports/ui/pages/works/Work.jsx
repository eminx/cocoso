import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { StateContext } from '../../LayoutContainer';
import { ContentLoader } from '../../components/SkeletonLoaders';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import TablyCentered from '../../components/TablyCentered';
import WorkHybrid from '../../entry/WorkHybrid';

export default function Work() {
  const initialWork = window?.__PRELOADED_STATE__?.work || null;
  const initialDocuments = window?.__PRELOADED_STATE__?.documents || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [work, setWork] = useState(initialWork);
  const [documents, setDocuments] = useState(initialDocuments);

  let { currentHost, currentUser } = useContext(StateContext);
  const { usernameSlug, workId } = useParams();
  const [empty, username] = usernameSlug.split('@');

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

  return <WorkHybrid documents={documents} work={work} Host={Host} />;
}
