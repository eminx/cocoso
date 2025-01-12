import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Center, Heading, Img, Text, VStack, Wrap } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import parseHtml from 'html-react-parser';
import { parse } from 'query-string';

import WrapperSSR from '../../ui/layout/WrapperSSR';
import EntrySSR from '../../ui/entry/EntrySSR';
import Gridder from '../../ui/layout/Gridder';
import { parseTitle } from '../../ui/utils/shared';
import TablyCentered from '/imports/ui/components/TablyCentered';
import ActivityHybrid from '/imports/ui/entry/ActivityHybrid';
import ActivitiesHybrid from '/imports/ui/listing/ActivitiesHybrid';
import GroupsHybrid from '/imports/ui/listing/GroupsHybrid';

export function Home({ host }) {
  const Host = Meteor.call('getHost', host);
  const pageHeading = Host?.settings?.name;

  if (!Host) {
    return null;
  }

  return (
    <WrapperSSR
      Host={Host}
      imageUrl={Host.logo}
      subTitle={Host.settings?.address}
      title={pageHeading}
    />
  );
}

export function ActivitiesList({ host, sink }) {
  const location = useLocation();
  const { search } = location;
  const { showPast } = parse(search, { parseBooleans: true });

  const activities = Meteor.call('getAllPublicActivities', Boolean(showPast), host);
  const Host = Meteor.call('getHost', host);

  if (!Host) {
    return null;
  }

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ activities, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

  return (
    <WrapperSSR Host={Host}>
      <ActivitiesHybrid activities={activities} Host={Host} showPast={Boolean(showPast)} />
    </WrapperSSR>
  );
}

export function Activity({ host, sink }) {
  const { activityId } = useParams();
  const activity = Meteor.call('getActivityById', activityId);
  const Host = Meteor.call('getHost', host);

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ activity, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

  if (!activity) {
    return null;
  }

  return (
    <WrapperSSR isEntryPage={true} Host={Host}>
      <ActivityHybrid activity={activity} Host={Host} />
    </WrapperSSR>
  );
}

export function GroupsList({ host }) {
  const Host = Meteor.call('getHost', host);
  const groups = Meteor.call('getGroupsWithMeetings', Host.isPortalHost, host);

  const pageHeading = Host?.settings?.menu.find((item) => item.name === 'groups')?.label;
  const pageDescription = Host?.settings?.menu.find((item) => item.name === 'groups')?.description;
  const metaTitle = `${Host?.settings?.name} | ${pageHeading}`;

  return (
    <WrapperSSR Host={Host}>
      <GroupsHybrid groups={groups} Host={Host} />
    </WrapperSSR>
  );
}

export function Group({ host }) {
  const { groupId } = useParams();
  const group = Meteor.call('getGroup', groupId);
  const Host = Meteor.call('getHost', host);

  if (!group) {
    return null;
  }

  return (
    <WrapperSSR
      description={group.description}
      Host={Host}
      isEntryPage
      imageUrl={group.imageUrl}
      subTitle={group.readingMaterial}
      title={group.title}
    >
      <EntrySSR
        description={group.longDescription}
        imageUrl={group.imageUrl}
        subTitle={group.readingMaterial}
        title={group.title}
      />
    </WrapperSSR>
  );
}

export function ResourcesList({ host }) {
  const Host = Meteor.call('getHost', host);
  const resources = Meteor.call('getResources', host);

  const pageHeading = Host?.settings?.menu.find((item) => item.name === 'resources')?.label;
  const pageDescription = Host?.settings?.menu.find(
    (item) => item.name === 'resources'
  )?.description;
  const metaTitle = `${pageHeading} | ${Host.settings?.name}`;

  return (
    <WrapperSSR Host={Host} imageUrl={Host.logo} subTitle={pageDescription} title={metaTitle}>
      <PageHeading>{pageHeading}</PageHeading>
      <Gridder items={resources} />
    </WrapperSSR>
  );
}

export function Resource({ host }) {
  const { resourceId } = useParams();
  const resource = Meteor.call('getResourceById', resourceId);
  const Host = Meteor.call('getHost', host);

  if (!resource) {
    return null;
  }

  return (
    <WrapperSSR
      description={resource.description}
      Host={Host}
      isEntryPage
      imageUrl={resource.images && resource.images[0]}
      title={resource.label}
    >
      <EntrySSR
        description={resource.description}
        imageUrl={resource.images && resource.images[0]}
        title={resource.label}
      />
    </WrapperSSR>
  );
}

export function WorksList({ host }) {
  const Host = Meteor.call('getHost', host);
  const works = Meteor.call('getAllWorks', host);

  const pageHeading = Host.settings?.menu.find((item) => item.name === 'works')?.label;
  const pageDescription = Host.settings?.menu.find((item) => item.name === 'works')?.description;
  const metaTitle = `${Host.settings?.name} | ${pageHeading}`;

  return (
    <WrapperSSR Host={Host} imageUrl={Host.logo} subTitle={pageDescription} title={metaTitle}>
      <PageHeading>{pageHeading}</PageHeading>
      <Gridder items={works} />
    </WrapperSSR>
  );
}

export function Work({ host }) {
  const { workId, usernameSlug } = useParams();
  const [empty, username] = usernameSlug.split('@');
  const work = Meteor.call('getWork', workId, username);
  const Host = Meteor.call('getHost', host);

  if (!work) {
    return null;
  }

  return (
    <WrapperSSR
      description={work.longDescription}
      Host={Host}
      isEntryPage
      imageUrl={work.images && work.images[0]}
      subTitle={work.shortDescription}
      title={work.title}
    >
      <EntrySSR
        description={work.longDescription}
        imageUrl={work.images && work.images[0]}
        subTitle={work.shortDescription}
        title={work.title}
      />
    </WrapperSSR>
  );
}

export function Page({ host }) {
  const { pageTitle } = useParams();
  const pages = Meteor.call('getPages', host);
  const page = pages.find((page) => parseTitle(page.title) === pageTitle);
  const Host = Meteor.call('getHost', host);

  if (!page) {
    return null;
  }

  return (
    <WrapperSSR
      description={page.longDescription}
      Host={Host}
      imageUrl={page.images && page.images[0]}
      title={page.title}
    >
      <EntrySSR
        description={page.longDescription}
        imageUrl={page.images && page.images[0]}
        title={page.title}
      />
    </WrapperSSR>
  );
}

export function UsersList({ host }) {
  const Host = Meteor.call('getHost', host);
  const users = Meteor.call('getHostMembers', host);

  const pageHeading = Host.settings?.menu.find((item) => item.name === 'people')?.label;
  const pageDescription = Host.settings?.menu.find((item) => item.name === 'people')?.description;
  const metaTitle = `${Host.settings?.name} | ${pageHeading}`;

  return (
    <WrapperSSR Host={Host} imageUrl={Host.logo} subTitle={pageDescription} title={metaTitle}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{metaTitle}</title>
        <meta name="title" content={metaTitle} />
        <meta property="og:title" content={metaTitle?.substring(0, 30)} />
        <meta property="og:description" content={pageDescription?.substring(0, 60)} />
        <meta property="og:image" content={users.find((u) => u.avatar?.src)?.avatar?.src} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={host.host} />
      </Helmet>

      <PageHeading>{pageHeading}</PageHeading>

      <Center>
        <Wrap justify="center">
          {users.map((user) => (
            <VStack key={user._id}>
              <Img w={240} h={240} objectFit="cover" src={user.avatar?.src} />
              <Heading fontSize={22}>{user.username}</Heading>
            </VStack>
          ))}
        </Wrap>
      </Center>
    </WrapperSSR>
  );
}

export function User({ host }) {
  const Host = Meteor.call('getHost', host);
  const { usernameSlug } = useParams();
  if (usernameSlug[0] !== '@') {
    return null;
  }
  const [empty, username] = usernameSlug.split('@');
  const user = Meteor.call('getUserInfo', username, host);

  return (
    <WrapperSSR
      description={user.bio}
      Host={Host}
      isEntryPage
      imageUrl={user.avatar?.src}
      subTitle={user.firstName ? `${user.firstName} ${user.lastName}` : null}
      title={user.username}
    >
      <EntrySSR
        description={user.bio}
        imageUrl={user.avatar?.src}
        subTitle={user.firstName ? `${user.firstName} ${user.lastName}` : null}
        title={user.username}
      />
    </WrapperSSR>
  );
}

export function Communities({ host }) {
  const allHosts = Meteor.call('getAllHosts');
  const Host = Meteor.call('getHost', host);
  const pageHeading = 'Communities';
  const metaTitle = `${Host?.settings?.name} | ${pageHeading}`;

  return (
    <WrapperSSR Host={Host} imageUrl={Host.logo} title={metaTitle}>
      <PageHeading>{pageHeading}</PageHeading>
      <Gridder items={allHosts} />
    </WrapperSSR>
  );
}

export function PageHeading({ children }) {
  return (
    <Center mb="8">
      <Heading fontFamily="'Arial', 'sans-serif" textAlign="center">
        {children}
      </Heading>
    </Center>
  );
}
