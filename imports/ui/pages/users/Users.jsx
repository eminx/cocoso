import React, { useState, useEffect, useContext } from 'react';

import { StateContext } from '../../LayoutContainer';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { ContentLoader } from '../../components/SkeletonLoaders';
import UsersHybrid from '../../listing/UsersHybrid';

export default function Users() {
  const initialUsers = window?.__PRELOADED_STATE__?.users || [];
  const initialKeywords = window?.__PRELOADED_STATE__?.keywords || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [users, setUsers] = useState(initialUsers);
  const [keywords, setKeywords] = useState(initialKeywords);
  const [loading, setLoading] = useState(false);
  let { currentHost } = useContext(StateContext);

  if (!currentHost) {
    currentHost = Host;
  }

  useEffect(() => {
    getAllUsers();
    getKeywords();
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

  const getKeywords = async () => {
    try {
      const respond = await call('getKeywords');
      const selectedKeywords = respond.filter((k) =>
        users.some((m) => m?.keywords?.map((kw) => kw.keywordId).includes(k._id))
      );
      setKeywords(selectedKeywords.sort((a, b) => a.label.localeCompare(b.label)));
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  if (loading || !users) {
    return <ContentLoader items={4} />;
  }

  return <UsersHybrid Host={Host} keywords={keywords} users={users} />;
}
