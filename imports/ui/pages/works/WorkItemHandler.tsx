import React, { useEffect } from 'react';
import loadable from '@loadable/component';
import { useLoaderData, useSearchParams } from 'react-router';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { canCreateContentAtom, renderedAtom } from '/imports/state';
import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import WorkHybrid from '/imports/ui/entry/WorkHybrid';
const EditEntryHandler = loadable(() =>
  import('/imports/ui/forms/EditEntryHandler')
);

const WorkInteractionHandler = loadable(() =>
  import('./components/WorkInteractionHandler')
);
const EditWork = loadable(() => import('./EditWork'));

export const workAtom = atom(null);

export default function WorkItemHandler({ Host, pageTitles }) {
  const { documents, work } = useLoaderData();
  const setWork = useSetAtom(workAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const [searchParams] = useSearchParams();

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
        </>
      )}
    </>
  );
}
