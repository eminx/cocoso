import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { call } from '../../utils/shared';
import ActivityHybrid from '../../entry/ActivityHybrid';
import ActivityInteractionHandler from './components/ActivityInteractionHandler';
import { StateContext } from '../../LayoutContainer';
import Loader from '../../core/Loader';
import NewEntryHandler from '../../listing/NewEntryHandler';
import EditPublicActivity from './EditPublicActivity';
import EditCalendarActivity from '../calendar/EditCalendarActivity';
import { message } from '../../generic/message';

export const ActivityContext = createContext(null);

export default function Activity() {
  const initialActivity = window?.__PRELOADED_STATE__?.activity || null;
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [activity, setActivity] = useState(initialActivity);
  const [rendered, setRendered] = useState(false);
  const { activityId } = useParams();
  const { currentHost } = useContext(StateContext);

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  const getActivityById = async () => {
    try {
      setActivity(await call('getActivityById', activityId));
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getActivityById();
  }, [activityId]);

  if (!activity) {
    return <Loader />;
  }

  const isGroupMeeting = activity.isGroupMeeting;

  if (isGroupMeeting) {
    return <Navigate to={`/groups/${activity.groupId}/info`} />;
  }

  const contextValue = {
    activity,
    getActivityById,
  };

  return (
    <>
      <ActivityHybrid activity={activity} Host={currentHost || Host} />

      {rendered && (
        <ActivityContext.Provider value={contextValue}>
          <ActivityInteractionHandler slideStart={rendered} />

          <NewEntryHandler>
            {activity.isPublicActivity ? (
              <EditPublicActivity />
            ) : (
              <EditCalendarActivity />
            )}
          </NewEntryHandler>
        </ActivityContext.Provider>
      )}
    </>
  );
}
