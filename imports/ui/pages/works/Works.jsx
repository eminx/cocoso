import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';

import { currentHostAtom } from '../../LayoutContainer';
import { message } from '../../generic/message';
import { call } from '../../utils/shared';
import WorksHybrid from '../../listing/WorksHybrid';
import NewEntryHandler from '../../listing/NewEntryHandler';
import NewWork from './NewWork';

export default function Works() {
  const initialWorks = window?.__PRELOADED_STATE__?.works || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  let currentHost = useAtomValue(currentHostAtom);
  const [works, setWorks] = useState(initialWorks);

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
      <NewEntryHandler>
        <NewWork />
      </NewEntryHandler>
    </>
  );
}
