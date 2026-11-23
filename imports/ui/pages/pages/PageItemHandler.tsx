import React, { useEffect } from 'react';
// @ts-expect-error: @loadable/component does not provide declarations in this project.
import loadable from '@loadable/component';
import { useLoaderData, useSearchParams } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import { currentUserAtom, renderedAtom, roleAtom } from '/imports/state';
import PageHybrid from '/imports/ui/entry/PageHybrid';

import EditEntryHandler from '/imports/ui/forms/EditEntryHandler.loadable';
import NewEntryHandler from '/imports/ui/forms/NewEntryHandler.loadable';
import NotFoundPage from '/imports/ui/pages/NotFoundPage';
import EntryReporter from '/imports/ui/entry/EntryReporter';
import type { Host } from '/imports/ui/types';

const PageInteractionHandler = loadable(
  () => import('./components/PageInteractionHandler')
);
const NewPage = loadable(() => import('./NewPage'));
const EditPage = loadable(() => import('./EditPage'));

export const currentPageAtom = atom(null);

export default function PageItemHandler({ Host }: { Host: Host }) {
  const { page } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);
  const role = useAtomValue(roleAtom);
  const currentUser = useAtomValue(currentUserAtom);
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

          {currentUser && (
            <EntryReporter
              contentId={page._id}
              contentType="info"
              reportedUserId={page.authorId}
              reportedTitle={page.title}
            />
          )}
        </>
      )}
    </>
  );
}
