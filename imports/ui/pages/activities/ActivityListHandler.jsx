import React, { lazy } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';

import { canCreateContentAtom, renderedAtom } from '/imports/state';
import ActivitiesHybrid from '/imports/ui/listing/ActivitiesHybrid';
const NewEntryHandler = lazy(() =>
  import('/imports/ui/listing/NewEntryHandler')
);
const NewPublicActivity = lazy(() => import('./NewPublicActivity'));

export default function ActivityListHandler({ Host }) {
  const { activities } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const [searchParams] = useSearchParams();
  const showPast = Boolean(searchParams.get('showPast') === 'true');

  return (
    <>
      <ActivitiesHybrid
        activities={activities}
        Host={Host}
        showPast={showPast}
      />

      {rendered && canCreateContent ? (
        <NewEntryHandler>
          <NewPublicActivity />
        </NewEntryHandler>
      ) : null}
    </>
  );
}
