import React from 'react';
import loadable from '@loadable/component';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import { canCreateContentAtom, renderedAtom } from '/imports/state';
import WorksHybrid from '/imports/ui/listing/WorksHybrid';
const NewEntryHandler = loadable(() =>
  import('/imports/ui/forms/NewEntryHandler')
);

const NewWork = loadable(() => import('./NewWork'));

export default function WorkListHandler({ Host }) {
  const { documents, works } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);

  return (
    <>
      <WorksHybrid Host={Host} documents={documents} works={works} />

      {rendered && canCreateContent ? (
        <NewEntryHandler context="works">
          <NewWork />
        </NewEntryHandler>
      ) : null}
    </>
  );
}
