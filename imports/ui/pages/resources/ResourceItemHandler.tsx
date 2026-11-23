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
import EntryReporter from '/imports/ui/entry/EntryReporter';
import ResourceHybrid from '/imports/ui/entry/ResourceHybrid';
import EditEntryHandler from '/imports/ui/forms/EditEntryHandler.loadable';
import type { Host } from '/imports/ui/types';

const ResourceInteractionHandler = loadable(
  () => import('./components/ResourceInteractionHandler')
);
const EditResource = loadable(() => import('./EditResource'));

export const resourceAtom = atom(null);

export default function ResourceItemHandler({ Host }: { Host: Host }) {
  const { documents, resource } = useLoaderData();
  const setResource = useSetAtom(resourceAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const currentUser = useAtomValue(currentUserAtom);

  useEffect(() => {
    setResource(resource);
  }, [resource]);

  return (
    <>
      <ResourceHybrid documents={documents} resource={resource} Host={Host} />

      {rendered && (
        <>
          <ResourceInteractionHandler />

          {canCreateContent && (
            <EditEntryHandler context="resources">
              <EditResource />
            </EditEntryHandler>
          )}

          {currentUser && (
            <EntryReporter
              contentId={resource._id}
              contentType="resources"
              reportedUserId={resource.userId}
              reportedTitle={resource.label}
            />
          )}
        </>
      )}
    </>
  );
}
