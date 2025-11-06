import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { useHydrateAtoms } from 'jotai/utils';
import { atom, useAtomValue } from 'jotai';

import GroupHybrid from '/imports/ui/entry/GroupHybrid';
import { renderedAtom } from '/imports/state';

const GroupInteractionHandler = lazy(() =>
  import('./components/GroupInteractionHandler')
);
const EditGroup = lazy(() => import('./EditGroup'));
const NewEntryHandler = lazy(() =>
  import('/imports/ui/listing/NewEntryHandler')
);

export const groupAtom = atom(null);

export default function GroupItemHandler({ Host, pageTitles }) {
  const { group } = useLoaderData();
  useHydrateAtoms([[groupAtom, group]]);
  const rendered = useAtomValue(renderedAtom);

  return (
    <>
      <GroupHybrid group={group} Host={Host} />

      {rendered && (
        <>
          <GroupInteractionHandler group={group} />

          <NewEntryHandler>
            <EditGroup />
          </NewEntryHandler>
        </>
      )}
    </>
  );
}
