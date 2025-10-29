import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import WorkHybrid from '/imports/ui/entry/WorkHybrid';

const WorkInteractionHandler = lazy(() =>
  import('./components/WorkInteractionHandler')
);
// const EditWork = lazy(() => import('./EditWork'));
// const NewEntryHandler = lazy(() =>
//   import('/imports/ui/listing/NewEntryHandler')
// );

export const workAtom = atom(null);

export default function WorkItemHandler({ Host, pageTitles }) {
  const { work } = useLoaderData();
  useHydrateAtoms([[workAtom, work]]);

  return (
    <WrapperHybrid isEntryPage pageTitles={pageTitles} Host={Host}>
      {({ rendered }) => (
        <>
          <WorkHybrid work={work} Host={Host} />
          {rendered && (
            <WorkInteractionHandler work={work} />
            // <NewEntryHandler>
            //   <EditWork />
            // </NewEntryHandler>
          )}
        </>
      )}
    </WrapperHybrid>
  );
}
