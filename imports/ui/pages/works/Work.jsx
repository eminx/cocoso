import React, {
  createContext,
  useLayoutEffect,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';

import { currentHostAtom } from '../../LayoutContainer';
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

  const currentHost = useAtomValue(currentHostAtom);
  const [work, setWork] = useState(initialWork);
  const [documents, setDocuments] = useState(initialDocuments);
  const [rendered, setRendered] = useState(false);
  const { usernameSlug, workId } = useParams();
  const [, username] = usernameSlug.split('@');

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  const getWorkById = async () => {
    try {
      const response = await call('getWorkById', workId, username);
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
  }, [workId]);

  const contextValue = {
    work,
    getWorkById,
  };

  if (!work) {
    return null;
  }
  return (
    <>
      <WorkHybrid
        documents={documents}
        work={work}
        Host={currentHost || Host}
      />

      {rendered && (
        <WorkContext.Provider value={contextValue}>
          <WorkInteractionHandler slideStart={rendered} />

          <NewEntryHandler>
            <EditWork />
          </NewEntryHandler>
        </WorkContext.Provider>
      )}
    </>
  );
}
