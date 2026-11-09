import React, { useEffect } from 'react';
import loadable from '@loadable/component';
import { useLoaderData, useParams, useSearchParams } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import { renderedAtom, roleAtom } from '/imports/state';
import PageHybrid from '/imports/ui/entry/PageHybrid';
import { parseTitle } from '/imports/api/_utils/shared';
import EditEntryHandler from '/imports/ui/forms/EditEntryHandler.loadable';
import NewEntryHandler from '/imports/ui/forms/NewEntryHandler.loadable';
import NotFoundPage from '/imports/ui/pages/NotFoundPage';

const PageInteractionHandler = loadable(
  () => import('./components/PageInteractionHandler')
);
const NewPage = loadable(() => import('./NewPage'));
const EditPage = loadable(() => import('./EditPage'));

export const pagesAtom = atom(null);
export const currentPageAtom = atom(null);

export default function PageItemHandler({ Host }) {
  const { page } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);
  const role = useAtomValue(roleAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!page) {
      return;
    }
    setCurrentPage(page);
  }, [page]);

  const isEdit = role === 'admin' && searchParams.get('edit') === 'true';

  if (!page) {
    return <NotFoundPage />;
  }

  return (
    <>
      <PageHybrid currentPage={page} Host={Host} />

      {rendered && (
        <>
          <PageInteractionHandler />

          {isEdit ? (
            <EditEntryHandler context="info">
              <EditPage />
            </EditEntryHandler>
          ) : (
            <NewEntryHandler context="info">
              <NewPage />
            </NewEntryHandler>
          )}
        </>
      )}
    </>
  );
}
