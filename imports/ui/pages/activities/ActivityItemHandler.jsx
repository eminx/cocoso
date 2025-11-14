import React, { useEffect } from 'react';
import loadable from '@loadable/component';
import { Navigate, useLoaderData, useSearchParams } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import ActivityHybrid from '/imports/ui/entry/ActivityHybrid';
import { canCreateContentAtom, renderedAtom } from '/imports/state';

const EditEntryHandler = loadable(() =>
  import('/imports/ui/forms/EditEntryHandler')
);

const ActivityInteractionHandler = loadable(() =>
  import('./components/ActivityInteractionHandler')
);
const EditCalendarActivity = loadable(() =>
  import('../calendar/EditCalendarActivity')
);
const EditPublicActivity = loadable(() => import('./EditPublicActivity'));

export const activityAtom = atom(null);

export default function ActivityItemHandler({ Host }) {
  const { activity } = useLoaderData();
  const setActivity = useSetAtom(activityAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setActivity(activity);
  }, [activity]);

  const isGroupMeeting = activity?.isGroupMeeting;

  if (isGroupMeeting) {
    return <Navigate to={`/groups/${activity.groupId}`} />;
  }

  return (
    <>
      <ActivityHybrid activity={activity} Host={Host} />

      {rendered && (
        <>
          <ActivityInteractionHandler />

          {canCreateContent && (
            <EditEntryHandler
              context={activity.isPublicActivity ? 'activities' : 'calendar'}
            >
              {activity.isPublicActivity ? (
                <EditPublicActivity />
              ) : (
                <EditCalendarActivity />
              )}
            </EditEntryHandler>
          )}
        </>
      )}
    </>
  );
}
