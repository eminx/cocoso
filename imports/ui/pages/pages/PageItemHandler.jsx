import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { atom, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import PageHybrid from '/imports/ui/entry/PageHybrid';
import { renderedAtom } from '/imports/state';

const PageInteractionHandler = lazy(() =>
  import('./components/PageInteractionHandler')
);
// const EditPage = lazy(() => import('./EditPage'));
// const NewEntryHandler = lazy(() =>
//   import('/imports/ui/listing/NewEntryHandler')
// );

export const pagesAtom = atom(null);

export default function PageItemHandler({ Host, pageTitles }) {
  const { pages } = useLoaderData();
  useHydrateAtoms([[pagesAtom, pages]]);
  const rendered = useAtomValue(renderedAtom);

  return (
    <>
      <PageHybrid pages={pages} />
      {rendered && (
        <PageInteractionHandler pages={pages} />
        // <NewEntryHandler>
        //   <EditPage />
        // </NewEntryHandler>
      )}
    </>
  );
}
