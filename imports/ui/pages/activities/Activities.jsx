import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { parse } from 'query-string';

import { StateContext } from '../../LayoutContainer';
import { ContentLoader } from '../../components/SkeletonLoaders';
import { call } from '../../utils/shared';
import ActivitiesHybrid from '../../listing/ActivitiesHybrid';

function Activities() {
  const initialActivities = window?.__PRELOADED_STATE__?.activities || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;
  const [activities, setActivities] = useState(initialActivities);
  const [loading, setLoading] = useState(false);
  let { currentHost } = useContext(StateContext);
  const location = useLocation();
  const { search } = location;
  const { showPast } = parse(search, { parseBooleans: true });

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
      console.log(error);
      // message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getActivities();
  }, [showPast]);

  if (loading) {
    return <ContentLoader />;
  }

  return <ActivitiesHybrid activities={activities} Host={currentHost} showPast={showPast} />;
}

export default Activities;
