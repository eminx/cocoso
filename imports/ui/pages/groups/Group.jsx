import React, { createContext, useState, useEffect, useContext, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';

import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import Loader from '../../generic/Loader';
import { message } from '../../generic/message';
import GroupHybrid from '../../entry/GroupHybrid';
import GroupInteractionHandler from './components/GroupInteractionHandler';
import NewEntryHandler from '../../listing/NewEntryHandler';
import EditGroup from './EditGroup';

export const GroupContext = createContext(null);

export default function Group() {
  const initialGroup = window?.__PRELOADED_STATE__?.group || null;
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [group, setGroup] = useState(initialGroup);
  const [rendered, setRendered] = useState(false);
  const { groupId } = useParams();
  const { currentHost, currentUser } = useContext(StateContext);

  const getGroupById = async () => {
    try {
      const response = await call('getGroupWithMeetings', groupId);
      setGroup(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getGroupById();
  }, [groupId]);

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  if (!group) {
    return <Loader />;
  }

  const contextValue = {
    group,
    getGroupById,
  };

  return (
    <>
      <GroupHybrid group={group} Host={currentHost || Host} />
      {rendered && (
        <GroupContext.Provider value={contextValue}>
          <GroupInteractionHandler currentUser={currentUser} group={group} slideStart={rendered} />

          <NewEntryHandler>
            <EditGroup />
          </NewEntryHandler>
        </GroupContext.Provider>
      )}
    </>
  );
}
