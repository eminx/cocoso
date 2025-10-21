import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import NewEntryHandler from '/imports/ui/listing/NewEntryHandler';
import ActivitiesHybrid from '/imports/ui/listing/ActivitiesHybrid';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

import NewPublicActivity from './NewPublicActivity';

export default function Activities() {
  const initialActivities = window?.__PRELOADED_STATE__?.activities || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [activities, setActivities] = useState(initialActivities);
  let { currentHost } = useContext(StateContext);
  const [searchParams] = useSearchParams();

  const showPast = Boolean(searchParams.get('showPast') === 'true');

  if (!currentHost) {
    currentHost = Host;
  }

  const isPortalHost = Boolean(currentHost?.isPortalHost);

  const getActivities = async () => {
    try {
      if (isPortalHost) {
        const allActivities = await call(
          'getAllPublicActivitiesFromAllHosts',
          showPast
        );
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
      <ActivitiesHybrid
        activities={activities}
        Host={currentHost}
        showPast={showPast}
      />

      <NewEntryHandler>
        <NewPublicActivity />
      </NewEntryHandler>
    </>
  );
}
