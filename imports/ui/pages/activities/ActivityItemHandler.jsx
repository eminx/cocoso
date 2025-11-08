import React, { lazy, useEffect } from 'react';
import {
  Navigate,
  useLoaderData,
  useParams,
  useSearchParams,
} from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import ActivityHybrid from '/imports/ui/entry/ActivityHybrid';
import { canCreateContentAtom, renderedAtom } from '/imports/state';

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

export default function ActivityItemHandler({ Host }) {
  const { activity } = useLoaderData();
  useHydrateAtoms([[activityAtom, activity]]);
  const setActivity = useSetAtom(activityAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);

  useEffect(() => {
    setActivity(activity);
  }, [activity]);

  const isGroupMeeting = activity?.isGroupMeeting;

  if (isGroupMeeting) {
    return <Navigate to={`/groups/${activity.groupId}/info`} />;
  }

  return (
    <>
      <ActivityHybrid activity={activity} Host={Host} />

      {rendered && (
        <>
          <ActivityInteractionHandler activity={activity} />
          {canCreateContent && (
            <NewEntryHandler>
              {activity.isPublicActivity ? (
                <EditPublicActivity />
              ) : (
                <EditCalendarActivity />
              )}
            </NewEntryHandler>
          )}
        </>
      )}
    </>
  );
}
