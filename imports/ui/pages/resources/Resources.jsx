import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { ContentLoader } from '../../components/SkeletonLoaders';
import ResourcesHybrid from '../../listing/ResourcesHybrid';

export default function Resources() {
  const initialResources = window?.__PRELOADED_STATE__?.resources || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [resources, setResources] = useState(initialResources);
  const [loading, setLoading] = useState(false);
  let { currentHost } = useContext(StateContext);

  if (!currentHost) {
    currentHost = Host;
  }

  useEffect(() => {
    getAllResources();
  }, [currentHost?.isPortalHost]);

  const isPortalHost = Boolean(currentHost?.isPortalHost);

  const getAllResources = async () => {
    try {
      if (isPortalHost) {
        setResources(await call('getResourcesFromAllHosts'));
      } else {
        setResources(await call('getResources'));
      }
    } catch (error) {
      message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !resources) {
    return <ContentLoader items={4} />;
  }

  return <ResourcesHybrid Host={Host} resources={resources} />;
}
