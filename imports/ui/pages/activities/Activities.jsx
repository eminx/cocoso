import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { StateContext } from '../../LayoutContainer';
import { call } from '../../utils/shared';
import { message } from '../../generic/message';
import ActivitiesHybrid from '../../listing/ActivitiesHybrid';
import NewPublicActivity from './NewPublicActivity';
import NewEntryHandler from '../../listing/NewEntryHandler';

export default function Activities() {
  const initialActivities = window?.__PRELOADED_STATE__?.activities || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [activities, setActivities] = useState(initialActivities);
  let { currentHost } = useContext(StateContext);
  const [searchParams] = useSearchParams();

  const showPast = searchParams.get('showPast') === 'true';

  if (!currentHost) {
    currentHost = Host;
  }

  const isPortalHost = Boolean(currentHost?.isPortalHost);

  const getActivities = async () => {
    try {
      if (isPortalHost) {
        const allActivities = await call('getAllPublicActivitiesFromAllHosts', showPast);
        setActivities(allActivities);
      } else {
        const allActivities = await call('getAllPublicActivities', showPast);
        setActivities(allActivities);
      }
    } catch (error) {
      message.error(error.reason);
    }
  };

  useEffect(() => {
    getActivities();
  }, [showPast]);

  if (!activities) {
    return null;
  }

  return (
    <>
      <ActivitiesHybrid activities={activities} Host={currentHost} showPast={showPast} />

      <NewEntryHandler title="Create a Public Event">
        <NewPublicActivity />
      </NewEntryHandler>
    </>
  );
}
