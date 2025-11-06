import React from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';

import { renderedAtom } from '/imports/state';
import ActivitiesHybrid from '/imports/ui/listing/ActivitiesHybrid';
import NewEntryHandler from '/imports/ui/listing/NewEntryHandler';

import NewPublicActivity from './NewPublicActivity';

export default function ActivityListHandler({ Host, pageTitles }) {
  const { activities } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);
  const [searchParams] = useSearchParams();
  const showPast = Boolean(searchParams.get('showPast') === 'true');

  return (
    <>
      <ActivitiesHybrid
        activities={activities}
        Host={Host}
        showPast={showPast}
      />

      {rendered ? (
        <NewEntryHandler>
          <NewPublicActivity />
        </NewEntryHandler>
      ) : null}
    </>
  );
}
