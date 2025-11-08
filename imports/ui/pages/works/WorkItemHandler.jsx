import React, { lazy, useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import WorkHybrid from '/imports/ui/entry/WorkHybrid';
import { canCreateContentAtom, renderedAtom } from '/imports/state';

const WorkInteractionHandler = lazy(() =>
  import('./components/WorkInteractionHandler')
);
const EditWork = lazy(() => import('./EditWork'));
const NewEntryHandler = lazy(() =>
  import('/imports/ui/listing/NewEntryHandler')
);

export const workAtom = atom(null);

export default function WorkItemHandler({ Host, pageTitles }) {
  const { documents, work } = useLoaderData();
  useHydrateAtoms([[workAtom, work]]);
  const setWork = useSetAtom(workAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);

  useEffect(() => {
    setWork(work);
  }, [work]);

  return (
    <>
      <WorkHybrid Host={Host} documents={documents} work={work} />

      {rendered && (
        <>
          <WorkInteractionHandler work={work} />
          {canCreateContent && (
            <NewEntryHandler>
              <EditWork />
            </NewEntryHandler>
          )}
        </>
      )}
    </>
  );
}
