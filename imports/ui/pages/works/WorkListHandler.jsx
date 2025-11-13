import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import WorksHybrid from '/imports/ui/listing/WorksHybrid';
import { canCreateContentAtom, renderedAtom } from '/imports/state';
const NewEntryHandler = lazy(() => import('../../forms/NewEntryHandler'));
const NewWork = lazy(() => import('./NewWork'));

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
