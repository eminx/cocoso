import React, { useEffect } from 'react';
// @ts-expect-error: @loadable/component does not provide declarations in this project.
import loadable from '@loadable/component';
import { useLoaderData } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import {
  canCreateContentAtom,
  currentUserAtom,
  renderedAtom,
} from '/imports/state';
import { Host } from '/imports/ui/types';
import EntryReporter from '/imports/ui/entry/EntryReporter';
import WorkHybrid from '/imports/ui/entry/WorkHybrid';
import EditEntryHandler from '/imports/ui/forms/EditEntryHandler.loadable';

const WorkInteractionHandler = loadable(
  () => import('./components/WorkInteractionHandler')
);
const EditWork = loadable(() => import('./EditWork'));

export const workAtom = atom(null);

export default function WorkItemHandler({ Host }: { Host: Host }) {
  const { documents, work } = useLoaderData();
  const setWork = useSetAtom(workAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const currentUser = useAtomValue(currentUserAtom);

  useEffect(() => {
    setWork(work);
  }, [work]);

  return (
    <>
      <WorkHybrid Host={Host} documents={documents} work={work} />

      {rendered && (
        <>
          <WorkInteractionHandler />

          {canCreateContent && (
            <EditEntryHandler context="works">
              <EditWork />
            </EditEntryHandler>
          )}

          {currentUser && (
            <EntryReporter
              contentId={work._id}
              contentType="works"
              reportedUserId={work.authorId}
              reportedTitle={work.title}
            />
          )}
        </>
      )}
    </>
  );
}
