import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';

import { call } from '../../utils/shared';
import { message } from '../../generic/message';
import { currentHostAtom } from '../../LayoutContainer';
import Loader from '../../core/Loader';
import ResourceHybrid from '../../entry/ResourceHybrid';
import ResourceInteractionHandler from './components/ResourceInteractionHandler';
import NewEntryHandler from '../../listing/NewEntryHandler';
import EditResource from './EditResource';

export const ResourceContext = createContext(null);

export default function Resource() {
  const initialResource = window?.__PRELOADED_STATE__?.resource || null;
  const initialDocuments = window?.__PRELOADED_STATE__?.documents || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  let currentHost = useAtomValue(currentHostAtom);
  const [resource, setResource] = useState(initialResource);
  const [documents, setDocuments] = useState(initialDocuments);
  const [rendered, setRendered] = useState(false);
  const { resourceId } = useParams();

  if (!currentHost) {
    currentHost = Host;
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  const getResourceById = async () => {
    try {
      const response = await call('getResourceById', resourceId);
      setResource(response);
      const docs = await call('getDocumentsByAttachments', response._id);
      setDocuments(docs);
    } catch (error) {
      message.error(error.reason);
    }
  };

  useEffect(() => {
    getResourceById();
  }, [resourceId]);

  if (!resource) {
    return <Loader />;
  }

  const contextValue = {
    resource,
    getResourceById,
  };

  return (
    <>
      <ResourceHybrid
        documents={documents}
        resource={resource}
        Host={currentHost}
      />
      {rendered && (
        <ResourceContext.Provider value={contextValue}>
          <ResourceInteractionHandler slideStart={rendered} />

          <NewEntryHandler>
            <EditResource />
          </NewEntryHandler>
        </ResourceContext.Provider>
      )}
    </>
  );
}
