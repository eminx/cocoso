import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { ContentLoader } from '../../components/SkeletonLoaders';
import UsersHybrid from '../../listing/UsersHybrid';

export default function Users() {
  const initialUsers = window?.__PRELOADED_STATE__?.users || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  let { currentHost } = useContext(StateContext);

  if (!currentHost) {
    currentHost = Host;
  }

  useEffect(() => {
    getAllUsers();
  }, [currentHost?.isPortalHost]);

  const isPortalHost = Boolean(currentHost?.isPortalHost);

  const getAllUsers = async () => {
    try {
      if (isPortalHost) {
        setUsers(await call('getAllMembersFromAllHosts'));
      } else {
        setUsers(await call('getHostMembers'));
      }
    } catch (error) {
      message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !users) {
    return <ContentLoader items={4} />;
  }

  return <UsersHybrid Host={Host} users={users} />;
}
