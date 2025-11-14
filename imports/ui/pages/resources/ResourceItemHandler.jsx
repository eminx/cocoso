import React, { useEffect } from 'react';
import loadable from '@loadable/component';
import { useLoaderData, useSearchParams } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import ResourceHybrid from '/imports/ui/entry/ResourceHybrid';
import { canCreateContentAtom, renderedAtom } from '/imports/state';
const EditEntryHandler = loadable(() =>
  import('/imports/ui/forms/EditEntryHandler')
);

const ResourceInteractionHandler = loadable(() =>
  import('./components/ResourceInteractionHandler')
);
const EditResource = loadable(() => import('./EditResource'));

export const resourceAtom = atom(null);

export default function ResourceItemHandler({ Host, pageTitles }) {
  const { documents, resource } = useLoaderData();
  const setResource = useSetAtom(resourceAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const [searchParams] = useSearchParams();

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
        </>
      )}
    </>
  );
}
