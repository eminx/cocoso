import React, { useEffect } from 'react';
import loadable from '@loadable/component';
import { useLoaderData, useSearchParams } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import GroupHybrid from '/imports/ui/entry/GroupHybrid';
import { canCreateContentAtom, renderedAtom } from '/imports/state';
const EditEntryHandler = loadable(() =>
  import('/imports/ui/forms/EditEntryHandler')
);

const GroupInteractionHandler = loadable(() =>
  import('./components/GroupInteractionHandler')
);
const EditGroup = loadable(() => import('./EditGroup'));

export const groupAtom = atom(null);

export default function GroupItemHandler({ Host, pageTitles }) {
  const { group, documents } = useLoaderData();
  const setGroup = useSetAtom(groupAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setGroup(group);
  }, [group]);

  return (
    <>
      <GroupHybrid group={group} documents={documents} Host={Host} />

      {rendered && (
        <>
          <GroupInteractionHandler />

          {canCreateContent && (
            <EditEntryHandler context="groups">
              <EditGroup />
            </EditEntryHandler>
          )}
        </>
      )}
    </>
  );
}
