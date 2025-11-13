import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import { canCreateContentAtom, renderedAtom } from '/imports/state';
import GroupsHybrid from '/imports/ui/listing/GroupsHybrid';
const NewEntryHandler = lazy(() => import('../../forms/NewEntryHandler'));
const NewGroup = lazy(() => import('./NewGroup'));

export default function GroupListHandler({ Host }) {
  const { groups } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);

  return (
    <>
      <GroupsHybrid groups={groups} Host={Host} />

      {rendered && canCreateContent ? (
        <NewEntryHandler context="groups">
          <NewGroup />
        </NewEntryHandler>
      ) : null}
    </>
  );
}
