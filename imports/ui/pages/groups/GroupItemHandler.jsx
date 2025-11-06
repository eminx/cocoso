import React, { lazy, Suspense } from 'react';
import { useLoaderData } from 'react-router';
import { useHydrateAtoms } from 'jotai/utils';
import { atom, useAtomValue } from 'jotai';

import GroupHybrid from '/imports/ui/entry/GroupHybrid';
import { renderedAtom } from '/imports/state';
import { Loader } from '/imports/ui/core';

const GroupInteractionHandler = lazy(() =>
  import('./components/GroupInteractionHandler')
);
const EditGroup = lazy(() => import('./EditGroup'));
const NewEntryHandler = lazy(() =>
  import('/imports/ui/listing/NewEntryHandler')
);

export const groupAtom = atom(null);

export default function GroupItemHandler({ Host, pageTitles }) {
  const { group, documents } = useLoaderData();
  useHydrateAtoms([[groupAtom, group]]);
  const rendered = useAtomValue(renderedAtom);

  return (
    <>
      <GroupHybrid group={group} documents={documents} Host={Host} />

      {rendered && (
        <Suspense fallback={<Loader />}>
          <GroupInteractionHandler group={group} />

          <NewEntryHandler>
            <EditGroup />
          </NewEntryHandler>
        </Suspense>
      )}
    </>
  );
}
