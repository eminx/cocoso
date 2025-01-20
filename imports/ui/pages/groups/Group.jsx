import React, { createContext, useState, useEffect, useContext, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';

import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import { ContentLoader } from '../../components/SkeletonLoaders';
import GroupHybrid from '../../entry/GroupHybrid';
import GroupInteractionHandler from './components/GroupInteractionHandler';

export const GroupContext = createContext(null);

export default function Group() {
  const initialGroup = window?.__PRELOADED_STATE__?.group || null;
  const Host = window?.__PRELOADED_STATE__?.Host || null;
  const user = window?.__PRELOADED_STATE__?.currentUser || null;

  const [group, setGroup] = useState(initialGroup);
  const [rendered, setRendered] = useState(false);
  const { groupId } = useParams();
  let { currentHost, currentUser } = useContext(StateContext);

  if (!currentHost) {
    currentHost = Host;
  }
  if (!currentUser) {
    currentUser = user;
  }

  const getGroupById = async () => {
    try {
      const response = await call('getGroupWithMeetings', groupId);
      setGroup(response);
    } catch (error) {
      // console.log(error);
      // message.error(error.reason);
    }
  };

  useEffect(() => {
    getGroupById();
  }, []);

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  if (!group) {
    return <ContentLoader />;
  }

  const contextValue = {
    group,
    getGroupById,
  };

  return (
    <>
      <GroupHybrid currentUser={currentUser} group={group} Host={currentHost} />
      {rendered && (
        <GroupContext.Provider value={contextValue}>
          <GroupInteractionHandler currentUser={currentUser} group={group} slideStart={rendered} />
        </GroupContext.Provider>
      )}
    </>
  );
}
