import React, { lazy, Suspense, useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import GroupHybrid from '/imports/ui/entry/GroupHybrid';
import { canCreateContentAtom, renderedAtom } from '/imports/state';
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
  const setGroup = useSetAtom(groupAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);

  useEffect(() => {
    setGroup(group);
  }, [group]);

  return (
    <>
      <GroupHybrid group={group} documents={documents} Host={Host} />

      {rendered && (
        <Suspense fallback={<Loader />}>
          <GroupInteractionHandler />

          {canCreateContent && (
            <NewEntryHandler>
              <EditGroup />
            </NewEntryHandler>
          )}
        </Suspense>
      )}
    </>
  );
}
