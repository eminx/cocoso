import React, { useEffect } from 'react';
// @ts-expect-error: @loadable/component does not provide declarations in this project.
import loadable from '@loadable/component';
import { useLoaderData } from 'react-router';
import { atom, useAtomValue, useAtom } from 'jotai';

import GroupHybrid from '/imports/ui/entry/GroupHybrid';
import {
  canCreateContentAtom,
  currentUserAtom,
  renderedAtom,
} from '/imports/state';
import EntryReporter from '/imports/ui/entry/EntryReporter';
import EditEntryHandler from '/imports/ui/forms/EditEntryHandler.loadable';
import type { Host } from '/imports/ui/types';

const GroupInteractionHandler = loadable(
  () => import('./components/GroupInteractionHandler')
);
const EditGroup = loadable(() => import('./EditGroup'));

export const groupAtom = atom(null);

export default function GroupItemHandler({ Host }: { Host: Host }) {
  const { group, documents } = useLoaderData();
  const [groupItem, setGroup] = useAtom(groupAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const currentUser = useAtomValue(currentUserAtom);

  useEffect(() => {
    setGroup(group);
  }, [group, documents]);

  return (
    <>
      <GroupHybrid
        group={groupItem || group}
        documents={documents}
        Host={Host}
      />

      {rendered && (
        <>
          <GroupInteractionHandler />

          {canCreateContent && (
            <EditEntryHandler context="groups">
              <EditGroup />
            </EditEntryHandler>
          )}

          {currentUser && (
            <EntryReporter
              contentId={group._id}
              contentType="groups"
              reportedUserId={group.authorId}
              reportedTitle={group.title}
            />
          )}
        </>
      )}
    </>
  );
}
