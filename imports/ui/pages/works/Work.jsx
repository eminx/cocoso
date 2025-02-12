import React, { createContext, useContext, useLayoutEffect, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../generic/Loader';
import { call } from '../../utils/shared';
import WorkHybrid from '../../entry/WorkHybrid';
import NewEntryHandler from '../../listing/NewEntryHandler';
import WorkInteractionHandler from './components/WorkInteractionHandler';
import EditWork from './EditWork';
import { message } from '../../generic/message';

export const WorkContext = createContext(null);

export default function Work() {
  const initialWork = window?.__PRELOADED_STATE__?.work || null;
  const initialDocuments = window?.__PRELOADED_STATE__?.documents || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [work, setWork] = useState(initialWork);
  const [documents, setDocuments] = useState(initialDocuments);
  const [rendered, setRendered] = useState(false);

  let { currentHost } = useContext(StateContext);
  const { usernameSlug, workId } = useParams();
  const [, username] = usernameSlug.split('@');

  if (!currentHost) {
    currentHost = Host;
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  const getWorkById = async () => {
    try {
      const response = await call('getWork', workId, username);
      setWork(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const getDocuments = async () => {
    try {
      const docs = await call('getDocumentsByAttachments', workId);
      setDocuments(docs);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getWorkById();
    getDocuments();
  }, []);

  if (!work) {
    return <Loader />;
  }

  const contextValue = {
    work,
    getWorkById,
  };

  return (
    <>
      <WorkHybrid documents={documents} work={work} Host={currentHost} />

      {rendered && (
        <WorkContext.Provider value={contextValue}>
          <WorkInteractionHandler slideStart={rendered} />

          <NewEntryHandler title="Edit Work">
            <EditWork />
          </NewEntryHandler>
        </WorkContext.Provider>
      )}
    </>
  );
}
