import React, { lazy, useEffect } from 'react';
import { useLoaderData, useParams, useSearchParams } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import { renderedAtom, roleAtom } from '/imports/state';
import PageHybrid from '/imports/ui/entry/PageHybrid';
import { parseTitle } from '/imports/api/_utils/shared';
const NewEntryHandler = lazy(() => import('/imports/ui/forms/NewEntryHandler'));
const EditEntryHandler = lazy(() =>
  import('/imports/ui/forms/EditEntryHandler')
);

const PageInteractionHandler = lazy(() =>
  import('./components/PageInteractionHandler')
);
const NewPage = lazy(() => import('./NewPage'));
const EditPage = lazy(() => import('./EditPage'));

export const pagesAtom = atom(null);
export const currentPageAtom = atom(null);

export default function PageItemHandler({ Host, pageTitles }) {
  const { pages } = useLoaderData();
  useHydrateAtoms([[pagesAtom, pages]]);
  const rendered = useAtomValue(renderedAtom);
  const role = useAtomValue(roleAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { pageTitle } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!pageTitle || !pages) {
      return;
    }
    const currentPage = pages.find(
      (page) => parseTitle(page.title) === pageTitle
    );
    setCurrentPage(currentPage);
  }, [pageTitle, pages]);

  const isEdit = role === 'admin' && searchParams.get('edit') === 'true';

  return (
    <>
      <PageHybrid pages={pages} />

      {rendered && (
        <>
          <PageInteractionHandler pages={pages} />

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
