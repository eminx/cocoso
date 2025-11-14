import React from 'react';
import loadable from '@loadable/component';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import { canCreateContentAtom, renderedAtom } from '/imports/state';
import ResourcesHybrid from '/imports/ui/listing/ResourcesHybrid';
const NewEntryHandler = loadable(() =>
  import('/imports/ui/forms/NewEntryHandler')
);

const NewResource = loadable(() => import('./NewResource'));

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
        <NewEntryHandler context="resources">
          <NewResource />
        </NewEntryHandler>
      ) : null}
    </>
  );
}
