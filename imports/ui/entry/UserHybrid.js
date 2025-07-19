import React from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import HTMLReactParser from 'html-react-parser';
import { Helmet } from 'react-helmet';

import { Box, Center, Flex } from '/imports/ui/core';
import MemberAvatarEtc from '../generic/MemberAvatarEtc';
import MemberWorks from '../pages/works/MemberWorks';
import MemberActivities from '../pages/activities/MemberActivities';
import MemberGroups from '../pages/groups/MemberGroups';
import Tabs from '../core/Tabs';
import BackLink from './BackLink';
import { stripHtml, getFullName } from '/imports/ui/utils/shared';

export function Bio({ user }) {
  if (!user || !user.bio) {
    return null;
  }

  return (
    <Flex justifyContent="center" mb="4">
      <Box
        bg="white"
        borderLeft="4px solid"
        borderColor="theme.500"
        className="text-content"
        maxW="480px"
        p="4"
        w="100%"
      >
        {HTMLReactParser(user.bio)}
      </Box>
    </Flex>
  );
}

export default function UserHybrid({ user, Host }) {
  const location = useLocation();
  const { usernameSlug } = useParams();

  if (usernameSlug[0] !== '@') {
    return null;
  }

  if (!user) {
    return null;
  }

  const { menu } = Host?.settings;

  const tabs = [];

  menu
    ?.filter(
      (item) =>
        ['activities', 'groups', 'works'].includes(item.name) && item.isVisible
    )
    ?.forEach((item) => {
      tabs.push({
        path: `${item.name}`,
        title: item.label,
      });
    });

  const pathnameLastPart = location.pathname.split('/').pop();
  const tabIndex = tabs.findIndex((tab) => tab.path === pathnameLastPart);
  const isPortalHost = Host?.isPortalHost;
  const members = menu?.find((item) => item.name === 'people');
  const title = `${getFullName(user)} | ${user.username} | ${
    Host?.settings?.name
  }`;
  const url = `https://${Host.host}/@${user.username}`;
  const imageUrl = user?.avatar?.src || user?.avatar || Host.logo;
  const tags = user.keywords?.map((k) => k.keywordLabel);
  const description = user.bio && stripHtml(user.bio)?.substring(0, 150);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="tags" content={tags?.join(',')} />
        <meta property="og:title" content={title?.substring(0, 40)} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={imageUrl} />
        <meta
          property="og:description"
          content={description?.substring(0, 150)}
        />
        <meta property="og:type" content="article" />
      </Helmet>

      <Box p="2">
        <BackLink backLink={{ label: members?.label, value: '/people' }} />
      </Box>

      <Center>
        <Box maxW="600px">
          <Center>
            <MemberAvatarEtc isThumb={false} user={user} />
          </Center>
          <Center>
            <Bio user={user} />
          </Center>
        </Box>
      </Center>

      <Center>
        <Box maxW="600px">
          <Tabs align="center" index={tabIndex} tabs={tabs} />

          <Box pt="4">
            <Routes>
              <Route
                path="activities"
                element={
                  <MemberActivities
                    currentHost={Host}
                    isPortalHost={isPortalHost}
                    user={user}
                  />
                }
              />
              <Route
                path="groups"
                element={
                  <MemberGroups
                    currentHost={Host}
                    isPortalHost={isPortalHost}
                    user={user}
                  />
                }
              />
              <Route
                path="works"
                element={
                  <MemberWorks
                    currentHost={Host}
                    isPortalHost={isPortalHost}
                    user={user}
                  />
                }
              />
            </Routes>
          </Box>
        </Box>
      </Center>
    </>
  );
}
