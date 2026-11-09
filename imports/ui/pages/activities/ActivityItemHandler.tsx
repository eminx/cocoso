import React, { useEffect } from 'react';
// @ts-expect-error: @loadable/component does not provide declarations in this project.
import loadable from '@loadable/component';
import { useLoaderData, useNavigate } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import ActivityHybrid from '/imports/ui/entry/ActivityHybrid';
import { canCreateContentAtom, renderedAtom } from '/imports/state';
import EditEntryHandler from '/imports/ui/forms/EditEntryHandler.loadable';
import type { Host } from '/imports/ui/types';

const ActivityInteractionHandler = loadable(
  () => import('./components/ActivityInteractionHandler')
);
const EditCalendarActivity = loadable(
  () => import('../calendar/EditCalendarActivity')
);
const EditPublicActivity = loadable(() => import('./EditPublicActivity'));

export const activityAtom = atom(null);

export default function ActivityItemHandler({ Host }: { Host: Host }) {
  const { activity, documents } = useLoaderData();
  const navigate = useNavigate();
  const setActivity = useSetAtom(activityAtom);
  const rendered = useAtomValue(renderedAtom);
  const canCreateContent = useAtomValue(canCreateContentAtom);

  useEffect(() => {
    if (activity?.isGroupMeeting) {
      navigate(`/groups/${activity.groupId}`);
      return;
    }
    setActivity(activity);
  }, [activity]);

  return (
    <>
      <ActivityHybrid activity={activity} documents={documents} Host={Host} />

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
