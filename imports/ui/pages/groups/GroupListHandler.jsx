import React from 'react';
import loadable from '@loadable/component';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import { canCreateContentAtom, renderedAtom } from '/imports/state';
import GroupsHybrid from '/imports/ui/listing/GroupsHybrid';
const NewEntryHandler = loadable(() => import('../../forms/NewEntryHandler'));
const NewGroup = loadable(() => import('./NewGroup'));

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
