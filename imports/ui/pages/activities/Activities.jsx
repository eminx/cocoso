import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = location;
  const { showPast } = parse(search, { parseBooleans: true });

  if (!currentHost) {
    currentHost = Host;
  }

  useEffect(() => {
    getActivities();
  }, [showPast]);

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
      message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ContentLoader />;
  }

  return (
    <>
      <ActivitiesHybrid activities={activities} Host={currentHost} showPast={showPast} />
    </>
  );
}

export default Activities;
