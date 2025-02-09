import React, { useState, useEffect, useContext } from 'react';

import { StateContext } from '../../LayoutContainer';
import { message } from '../../generic/message';
import { call } from '../../utils/shared';
import WorksHybrid from '../../listing/WorksHybrid';
import NewEntryHandler from '../../listing/NewEntryHandler';
import NewWork from './NewWork';

export default function Works() {
  const initialWorks = window?.__PRELOADED_STATE__?.works || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [works, setWorks] = useState(initialWorks);
  let { currentHost } = useContext(StateContext);

  if (!currentHost) {
    currentHost = Host;
  }

  const isPortalHost = Boolean(currentHost?.isPortalHost);

  const getAllWorks = async () => {
    try {
      if (isPortalHost) {
        setWorks(await call('getAllWorksFromAllHosts'));
      } else {
        setWorks(await call('getAllWorks'));
      }
    } catch (error) {
      message.error(error.reason);
    }
  };

  useEffect(() => {
    getAllWorks();
  }, []);

  if (!works) {
    return null;
  }

  return (
    <>
      <WorksHybrid Host={currentHost} works={works} />
      <NewEntryHandler title="Create a Work">
        <NewWork />
      </NewEntryHandler>
    </>
  );
}
