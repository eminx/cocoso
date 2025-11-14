import React, { useEffect } from 'react';
import loadable from '@loadable/component';
import { useLoaderData, useParams, useSearchParams } from 'react-router';
import { atom, useAtomValue, useAtom, useSetAtom } from 'jotai';

import { renderedAtom, roleAtom } from '/imports/state';
import PageHybrid from '/imports/ui/entry/PageHybrid';
import { parseTitle } from '/imports/api/_utils/shared';
const NewEntryHandler = loadable(() =>
  import('/imports/ui/forms/NewEntryHandler')
);
const EditEntryHandler = loadable(() =>
  import('/imports/ui/forms/EditEntryHandler')
);

const PageInteractionHandler = loadable(() =>
  import('./components/PageInteractionHandler')
);
const NewPage = loadable(() => import('./NewPage'));
const EditPage = loadable(() => import('./EditPage'));

export const pagesAtom = atom(null);
export const currentPageAtom = atom(null);

export default function PageItemHandler({ Host, pageTitles }) {
  const { pages } = useLoaderData();
  const setPages = useSetAtom(pagesAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const rendered = useAtomValue(renderedAtom);
  const role = useAtomValue(roleAtom);
  const { pageTitle } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setPages(pages);
    if (!pages) return;
    setCurrentPage(
      pages.find((page) => parseTitle(page.title) === pageTitle) || pages[0]
    );
  }, pages);

  const isEdit = role === 'admin' && searchParams.get('edit') === 'true';

  if (!pages) {
    return;
  }

  let currentPage = pages.find((page) => parseTitle(page.title) === pageTitle);
  if (!currentPage) {
    currentPage = pages[0];
  }

  return (
    <>
      <PageHybrid currentPage={currentPage} />

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
