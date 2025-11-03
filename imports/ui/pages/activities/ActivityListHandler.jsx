import React from 'react';
import { useLoaderData, useSearchParams } from 'react-router';

import ActivitiesHybrid from '/imports/ui/listing/ActivitiesHybrid';
// import NewPublicActivity from './NewPublicActivity';
// import NewEntryHandler from '/imports/ui/listing/NewEntryHandler';

export default function ActivityListHandler({ Host, pageTitles, rendered }) {
  const { activities } = useLoaderData();
  const [searchParams] = useSearchParams();
  const showPast = Boolean(searchParams.get('showPast') === 'true');

  return (
    <>
      <ActivitiesHybrid
        activities={activities}
        Host={Host}
        showPast={showPast}
      />

      {/* {rendered ? (
            <NewEntryHandler>
              <NewPublicActivity />
            </NewEntryHandler>
          ) : null} */}
    </>
  );
}
