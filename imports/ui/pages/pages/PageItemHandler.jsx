import React, { lazy, useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import PageHybrid from '/imports/ui/entry/PageHybrid';
import { renderedAtom } from '/imports/state';
import { parseTitle } from '../../../api/_utils/shared';

const PageInteractionHandler = lazy(() =>
  import('./components/PageInteractionHandler')
);
const EditPage = lazy(() => import('./EditPage'));
const NewEntryHandler = lazy(() =>
  import('/imports/ui/listing/NewEntryHandler')
);

export const pagesAtom = atom(null);
export const currentPageAtom = atom(null);

export default function PageItemHandler({ Host, pageTitles }) {
  const { pages } = useLoaderData();
  useHydrateAtoms([[pagesAtom, pages]]);
  const rendered = useAtomValue(renderedAtom);
  const { pageTitle } = useParams();
  const setCurrentPage = useSetAtom(currentPageAtom);

  useEffect(() => {
    if (!pageTitle || !pages) {
      return;
    }
    const currentPage = pages.find(
      (page) => parseTitle(page.title) === pageTitle
    );
    setCurrentPage(currentPage);
  }, [pageTitle, pages]);

  return (
    <>
      <PageHybrid pages={pages} />

      {rendered && (
        <>
          <PageInteractionHandler pages={pages} />
          <NewEntryHandler>
            <EditPage />
          </NewEntryHandler>
        </>
      )}
    </>
  );
}
