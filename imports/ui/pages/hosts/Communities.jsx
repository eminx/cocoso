import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { currentHostAtom, currentUserAtom } from '../../LayoutContainer';
import { call } from '../../utils/shared';
import { message } from '../../generic/message';
import CommunitiesHybrid from './CommunitiesHybrid';

function Communities() {
  const initialHosts = window?.__PRELOADED_STATE__?.hosts || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  let currentHost = useAtomValue(currentHostAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const [hosts, setHosts] = useState(initialHosts);
  const [rendered, setRendered] = useState(false);

  if (!currentHost) {
    currentHost = Host;
  }

  const getHosts = async () => {
    try {
      const allHosts = await call('getAllHosts');
      setHosts(allHosts);
    } catch (error) {
      message.error(error.reason);
    }
  };

  useEffect(() => {
    getHosts();
  }, []);

  useLayoutEffect(() => {
    setRendered(true);
  }, []);

  if (!hosts) {
    return null;
  }

  return (
    <CommunitiesHybrid
      currentUser={rendered ? currentUser : null}
      hosts={hosts}
      Host={currentHost}
    />
  );
}

export default Communities;
