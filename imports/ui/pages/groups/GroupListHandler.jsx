import React from 'react';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import { renderedAtom } from '/imports/state';
import GroupsHybrid from '/imports/ui/listing/GroupsHybrid';
import NewEntryHandler from '/imports/ui/listing/NewEntryHandler';

import NewGroup from './NewGroup';

export default function GroupListHandler({ Host, pageTitles }) {
  const { groups } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);

  return (
    <>
      <GroupsHybrid groups={groups} Host={Host} />

      {rendered ? (
        <NewEntryHandler>
          <NewGroup />
        </NewEntryHandler>
      ) : null}
    </>
  );
}
