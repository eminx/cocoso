import React, { lazy } from 'react';
import {
  Navigate,
  useLoaderData,
  useParams,
  useSearchParams,
} from 'react-router';
import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import ActivityHybrid from '/imports/ui/entry/ActivityHybrid';

const ActivityInteractionHandler = lazy(() =>
  import('./components/ActivityInteractionHandler')
);
const EditCalendarActivity = lazy(() =>
  import('../calendar/EditCalendarActivity')
);
const EditPublicActivity = lazy(() => import('./EditPublicActivity'));
const NewEntryHandler = lazy(() =>
  import('/imports/ui/listing/NewEntryHandler')
);

export const activityAtom = atom(null);

export default function ActivityItemHandler({ Host, pageTitles }) {
  const { activity } = useLoaderData();
  useHydrateAtoms([[activityAtom, activity]]);

  return (
    <WrapperHybrid isEntryPage pageTitles={pageTitles} Host={Host}>
      {({ rendered }) => (
        <>
          <ActivityHybrid activity={activity} Host={Host} />
          {rendered && <ActivityInteractionHandler activity={activity} />}
          <NewEntryHandler>
            {activity.isPublicActivity ? (
              <EditPublicActivity />
            ) : (
              <EditCalendarActivity />
            )}
          </NewEntryHandler>
        </>
      )}
    </WrapperHybrid>
  );
}

// const isGroupMeeting = activity?.isGroupMeeting;

// if (isGroupMeeting) {
//   return <Navigate to={`/groups/${activity.groupId}/info`} />;
// }
