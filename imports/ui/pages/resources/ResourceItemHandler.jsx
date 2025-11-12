import React, { lazy, useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import ResourceHybrid from '/imports/ui/entry/ResourceHybrid';
import { canCreateContentAtom, renderedAtom } from '/imports/state';

const ResourceInteractionHandler = lazy(() =>
  import('./components/ResourceInteractionHandler')
);
const EditResource = lazy(() => import('./EditResource'));
const NewEntryHandler = lazy(() =>
  import('/imports/ui/listing/NewEntryHandler')
);

export const resourceAtom = atom(null);

export default function ResourceItemHandler({ Host, pageTitles }) {
  const { documents, resource } = useLoaderData();
  const setResource = useSetAtom(resourceAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);

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
            <NewEntryHandler>
              <EditResource />
            </NewEntryHandler>
          )}
        </>
      )}
    </>
  );
}
