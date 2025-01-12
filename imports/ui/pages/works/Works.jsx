import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { ContentLoader } from '../../components/SkeletonLoaders';
import WorksHybrid from '../../listing/WorksHybrid';

function Works() {
  const initialWorks = window?.__PRELOADED_STATE__?.works || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [works, setWorks] = useState(initialWorks);
  const [loading, setLoading] = useState(false);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('members');
  const { currentHost } = useContext(StateContext);

  if (!currentHost) {
    currentHost = Host;
  }

  useEffect(() => {
    getAllWorks();
  }, [currentHost?.isPortalHost]);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading || !works) {
    return <ContentLoader items={4} />;
  }

  return <WorksHybrid Host={Host} works={works} />;
}

export default Works;
