import React from 'react';
import loadable from '@loadable/component';
import { useLoaderData, useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';

import { canCreateContentAtom, renderedAtom } from '/imports/state';
import ActivitiesHybrid from '/imports/ui/listing/ActivitiesHybrid';
const NewEntryHandler = loadable(() =>
  import('/imports/ui/forms/NewEntryHandler')
);

const NewPublicActivity = loadable(() => import('./NewPublicActivity'));

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
        <NewEntryHandler context="activities">
          <NewPublicActivity />
        </NewEntryHandler>
      ) : null}
    </>
  );
}
