import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import GroupHybrid from '/imports/ui/entry/GroupHybrid';

const GroupInteractionHandler = lazy(() =>
  import('./components/GroupInteractionHandler')
);
// const EditGroup = lazy(() => import('./EditGroup'));
// const NewEntryHandler = lazy(() =>
//   import('/imports/ui/listing/NewEntryHandler')
// );

export const groupAtom = atom(null);

export default function GroupItemHandler({ Host, pageTitles }) {
  const { group } = useLoaderData();
  useHydrateAtoms([[groupAtom, group]]);

  return (
    <WrapperHybrid isEntryPage pageTitles={pageTitles} Host={Host}>
      {({ rendered }) => (
        <>
          <GroupHybrid group={group} Host={Host} />
          {rendered && (
            <GroupInteractionHandler currentUser={null} group={group} />
            // <NewEntryHandler>
            //   <EditGroup />
            // </NewEntryHandler>
          )}
        </>
      )}
    </WrapperHybrid>
  );
}
