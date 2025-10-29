import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';

import PageHybrid from '../../entry/PageHybrid';
import { currentHostAtom, role, roleAtom } from '../../../state';
import { message } from '../../generic/message';
import { call, parseTitle } from '../../utils/shared';
import NewPage from './NewPage';
import EditPage from './EditPage';
import NewEntryHandler from '../../listing/NewEntryHandler';
import PageInteractionHandler from './components/PageInteractionHandler';

export const PageContext = createContext(null);

function Page() {
  const initialPages = window?.__PRELOADED_STATE__?.pages || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  let currentHost = useAtomValue(currentHostAtom);
  const role = useAtomValue(roleAtom);
  const [pages, setPages] = useState(initialPages);
  const [rendered, setRendered] = useState(false);
  const { pageTitle } = useParams();
  const [searchParams] = useSearchParams();
  const forNew = searchParams.get('new') === 'true';
  const forEdit = searchParams.get('edit') === 'true';

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  const getPages = async () => {
    try {
      const response = await call('getPages');
      setPages(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getPages();
  }, []);

  if (!currentHost) {
    currentHost = Host;
  }

  const currentPage = useMemo(() => {
    return pages?.find((page) => parseTitle(page.title) === pageTitle);
  }, [pageTitle, pages]);

  const contextValue = {
    currentPage,
    pages,
    getPages,
  };

  const isAdmin = role === 'admin';

  return (
    <>
      <PageHybrid pages={pages} Host={currentHost} />

      {rendered && isAdmin && (
        <PageContext.Provider value={contextValue}>
          <PageInteractionHandler slideStart={rendered} />

          <NewEntryHandler>
            {forEdit ? <EditPage /> : null}
            {forNew ? <NewPage /> : null}
          </NewEntryHandler>
        </PageContext.Provider>
      )}
    </>
  );
}

export default Page;
