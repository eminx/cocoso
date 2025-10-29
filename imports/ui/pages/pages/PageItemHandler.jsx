import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import PageHybrid from '/imports/ui/entry/PageHybrid';

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

  return (
    <WrapperHybrid isEntryPage pageTitles={pageTitles} Host={Host}>
      {({ rendered }) => (
        <>
          <PageHybrid pages={pages} />
          {rendered && (
            <PageInteractionHandler pages={pages} />
            // <NewEntryHandler>
            //   <EditPage />
            // </NewEntryHandler>
          )}
        </>
      )}
    </WrapperHybrid>
  );
}
