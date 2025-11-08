import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import ResourcesHybrid from '/imports/ui/listing/ResourcesHybrid';
import { canCreateContentAtom, renderedAtom } from '/imports/state';
const NewEntryHandler = lazy(() =>
  import('/imports/ui/listing/NewEntryHandler')
);
const NewResource = lazy(() => import('./NewResource'));

export default function ResourceListHandler({ Host }) {
  const { documents, resources } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);

  return (
    <>
      <ResourcesHybrid
        documents={documents}
        resources={resources}
        Host={Host}
      />

      {rendered && canCreateContent ? (
        <NewEntryHandler>
          <NewResource />
        </NewEntryHandler>
      ) : null}
    </>
  );
}
