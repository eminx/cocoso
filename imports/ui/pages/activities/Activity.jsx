import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { call } from '../../utils/shared';
import { message } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import ActivityHybrid from '../../entry/ActivityHybrid';

export default function Activity() {
  const initialActivity = window?.__PRELOADED_STATE__?.activity || null;
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [activity, setActivity] = useState(initialActivity);
  // const { canCreateContent, currentHost, currentUser, role } = useContext(StateContext);

  useEffect(() => {
    getActivityById();
  }, []);

  const getActivityById = async () => {
    try {
      setActivity(await call('getActivityById', activityId));
    } catch (error) {
      message(error.reason);
    }
  };

  // const addNewChatMessage = async (messageContent) => {
  //   const { activity } = this.props;

  //   if (!activity) {
  //     return;
  //   }

  //   const values = {
  //     context: 'activities',
  //     contextId: activity._id,
  //     message: messageContent,
  //   };

  //   try {
  //     await call('addChatMessage', values);
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  const isGroupMeeting = activity?.isGroupMeeting;

  if (isGroupMeeting) {
    return <Navigate to={`/groups/${activity?.groupId}/info`} />;
  }

  // const adminMenu = {
  //   label: 'Admin',
  //   items: [
  //     {
  //       label: tc('actions.update'),
  //       link: 'edit',
  //     },
  //   ],
  // };

  // const isAdmin = currentUser && (currentUser._id === activity?.authorId || role === 'admin');

  return <ActivityHybrid activity={activity} Host={Host} />;
}
