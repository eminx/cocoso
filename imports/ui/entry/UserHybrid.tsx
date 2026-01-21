import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { Helmet } from 'react-helmet';
import { Trans } from 'react-i18next';

import { Alert, Box, Center, Flex, Tabs } from '/imports/ui/core';
import { stripHtml, getFullName } from '/imports/api/_utils/shared';
import NotFoundPage from '/imports/ui/pages/NotFoundPage';
import MemberAvatarEtc from '/imports/ui/generic/MemberAvatarEtc';
import type { Host } from '/imports/ui/types';

import BackLink from './BackLink';

interface UserBio {
  bio?: string;
}

interface BioProps {
  user?: UserBio | null;
}

export function Bio({ user }: BioProps) {
  if (!user || !user.bio) {
    return null;
  }

  return (
    <Flex justify="center" mb="4">
      <Box
        bg="white"
        className="text-content"
        p="4"
        w="100%"
        css={{
          borderColor: 'var(--cocoso-colors-theme-500)',
          borderLeft: '4px solid',
          maxWidth: '480px',
        }}
      >
        {HTMLReactParser(DOMPurify.sanitize(user.bio))}
      </Box>
    </Flex>
  );
}

interface User {
  username?: string;
  bio?: string;
  avatar?: { src?: string } | string;
  keywords?: Array<{ keywordLabel?: string }>;
}

export interface UserHybridProps {
  user: User | null;
  Host: Host;
}

export default function UserHybrid({ user, Host }: UserHybridProps) {
  const { usernameSlug, workId } = useParams<{ usernameSlug: string; workId?: string }>();
  const location = useLocation();

  if (usernameSlug && usernameSlug[0] !== '@') {
    return <NotFoundPage />;
  }

  if (!user) {
    return (
      <Center p="8">
        <Alert
          message={
            <Trans i18nKey="accounts:profile.message.notfound">
              User with this username within this organization not found, or
              chose to hide their profile
            </Trans>
          }
        />
      </Center>
    );
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

  const pathname = location?.pathname;
  let tabIndex = tabs?.findIndex((tab) => pathname.includes(tab.path));
  tabIndex === -1 ? (tabIndex = 0) : null;

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

      {workId ? (
        <Outlet />
      ) : (
        <>
          <Box p="2">
            <BackLink backLink={{ label: members?.label, value: '/people' }} />
          </Box>

          <Center>
            <Box css={{ maxWidth: '600px' }}>
              <Center>
                <MemberAvatarEtc isThumb={false} user={user} />
              </Center>
              <Center>
                <Bio user={user} />
              </Center>
            </Box>
          </Center>

          <Center>
            <Box>
              <Center>
                <Tabs align="center" index={tabIndex} tabs={tabs} />
              </Center>

              <Box css={{ maxWidth: '600px' }} pt="4" mb="24">
                <Outlet />
              </Box>
            </Box>
          </Center>
        </>
      )}
    </>
  );
}
