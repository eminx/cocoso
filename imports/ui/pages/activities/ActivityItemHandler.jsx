import React, { lazy } from 'react';
import {
  Navigate,
  useLoaderData,
  useParams,
  useSearchParams,
} from 'react-router';
import { atom, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import ActivityHybrid from '/imports/ui/entry/ActivityHybrid';
import { renderedAtom } from '/imports/state';

const ActivityInteractionHandler = lazy(() =>
  import('./components/ActivityInteractionHandler')
);
// const EditCalendarActivity = lazy(() =>
//   import('../calendar/EditCalendarActivity')
// );
// const EditPublicActivity = lazy(() => import('./EditPublicActivity'));
// const NewEntryHandler = lazy(() =>
//   import('/imports/ui/listing/NewEntryHandler')
// );

export const activityAtom = atom(null);

export default function ActivityItemHandler({ Host, pageTitles }) {
  const { activity } = useLoaderData();
  useHydrateAtoms([[activityAtom, activity]]);
  const rendered = useAtomValue(renderedAtom);

  return (
    <>
      <ActivityHybrid activity={activity} Host={Host} />

      {rendered ? <ActivityInteractionHandler activity={activity} /> : null}

      {/* <NewEntryHandler>
        {activity.isPublicActivity ? (
          <EditPublicActivity />
        ) : (
          <EditCalendarActivity />
        )}
      </NewEntryHandler> */}
    </>
  );
}

// const isGroupMeeting = activity?.isGroupMeeting;

// if (isGroupMeeting) {
//   return <Navigate to={`/groups/${activity.groupId}/info`} />;
// }
