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
import { getCategoriesAssignedToWorks, parseTitle } from '../../ui/utils/shared';
import TablyCentered from '/imports/ui/components/TablyCentered';

import ActivitiesHybrid from '/imports/ui/listing/ActivitiesHybrid';
import ActivityHybrid from '/imports/ui/entry/ActivityHybrid';
import GroupsHybrid from '/imports/ui/listing/GroupsHybrid';
import ResourcesHybrid from '/imports/ui/listing/ResourcesHybrid';
import ResourceHybrid from '/imports/ui/entry/ResourceHybrid';
import WorksHybrid from '/imports/ui/listing/WorksHybrid';
import WorkHybrid from '/imports/ui/entry/WorkHybrid';
import UsersHybrid from '/imports/ui/listing/UsersHybrid';

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

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ activities, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

  if (!Host) {
    return null;
  }

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
    <WrapperSSR isEntryPage Host={Host}>
      <ActivityHybrid activity={activity} Host={Host} />
    </WrapperSSR>
  );
}

export function GroupsList({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const groups = Meteor.call('getGroupsWithMeetings', Host.isPortalHost, host);

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ groups, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

  const pageHeading = Host?.settings?.menu.find((item) => item.name === 'groups')?.label;
  const pageDescription = Host?.settings?.menu.find((item) => item.name === 'groups')?.description;
  const metaTitle = `${Host?.settings?.name} | ${pageHeading}`;

  return (
    <WrapperSSR Host={Host}>
      <GroupsHybrid groups={groups} Host={Host} />
    </WrapperSSR>
  );
}

export function Group({ host, sink }) {
  const { groupId } = useParams();
  const group = Meteor.call('getGroup', groupId);
  const Host = Meteor.call('getHost', host);

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ group, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

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

export function ResourcesList({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const resources = Meteor.call('getResources', host);

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ resources, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

  return (
    <WrapperSSR Host={Host}>
      <ResourcesHybrid Host={Host} resources={resources} />
    </WrapperSSR>
  );
}

export function Resource({ host, sink }) {
  const { resourceId } = useParams();
  const resource = Meteor.call('getResourceById', resourceId);
  const documents = Meteor.call('getDocumentsByAttachments', resourceId);
  const Host = Meteor.call('getHost', host);

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ documents, resource, Host }).replace(
        /</g,
        '\\u003c'
      )}
    </script>
  `);

  if (!resource) {
    return null;
  }

  return (
    <WrapperSSR isEntryPage Host={Host}>
      <ResourceHybrid documents={documents} resource={resource} Host={Host} />
    </WrapperSSR>
  );
}

export function WorksList({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const works = Meteor.call('getAllWorks', host);

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ works, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

  return (
    <WrapperSSR Host={Host}>
      <WorksHybrid Host={Host} works={works} />
    </WrapperSSR>
  );
}

export function Work({ host, sink }) {
  const { workId, usernameSlug } = useParams();
  const [empty, username] = usernameSlug.split('@');
  const work = Meteor.call('getWork', workId, username);
  const documents = Meteor.call('getDocumentsByAttachments', workId);
  const Host = Meteor.call('getHost', host);

  if (!work) {
    return null;
  }

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ work, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

  return (
    <WrapperSSR isEntryPage Host={Host}>
      <WorkHybrid documents={documents} work={work} Host={Host} />
    </WrapperSSR>
  );
}

export function Page({ host, sink }) {
  const { pageTitle } = useParams();
  const pages = Meteor.call('getPages', host);
  const page = pages.find((page) => parseTitle(page.title) === pageTitle);
  const Host = Meteor.call('getHost', host);

  if (!page) {
    return null;
  }

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ pages, page, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

  return (
    <WrapperSSR isEntryPage Host={Host}>
      <PageHybrid pages={pages} page={page} Host={Host} />
    </WrapperSSR>
  );
}

export function UsersList({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const users = Meteor.call('getHostMembers', host);
  const keywords = Meteor.call('getKeywords');

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ keywords, users, Host }).replace(
        /</g,
        '\\u003c'
      )}
    </script>
  `);

  return (
    <WrapperSSR Host={Host}>
      <UsersHybrid Host={Host} keywords={keywords} users={users} />
    </WrapperSSR>
  );
}

export function User({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const { usernameSlug } = useParams();
  if (usernameSlug[0] !== '@') {
    return null;
  }
  const [empty, username] = usernameSlug.split('@');
  const user = Meteor.call('getUserInfo', username, host);

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ user, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

  return (
    <WrapperSSR isEntryPage Host={Host}>
      <UsersHybrid Host={Host} user={user} />
    </WrapperSSR>
  );
}

export function Communities({ host, sink }) {
  const allHosts = Meteor.call('getAllHosts');
  const Host = Meteor.call('getHost', host);

  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({ allHosts, Host }).replace(/</g, '\\u003c')}
    </script>
  `);

  return (
    <WrapperSSR Host={Host}>
      <CommunitiesHybrid Host={Host} allHosts={allHosts} />
    </WrapperSSR>
  );
}
