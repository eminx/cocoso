import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import WrapperSSR from '../../ui/layout/WrapperSSR';
import ActivityHybrid from '../../ui/entry/ActivityHybrid';
import GroupsHybrid from '../../ui/listing/GroupsHybrid';
import GroupHybrid from '../../ui/entry/GroupHybrid';
import ResourcesHybrid from '../../ui/listing/ResourcesHybrid';
import ResourceHybrid from '../../ui/entry/ResourceHybrid';
import WorksHybrid from '../../ui/listing/WorksHybrid';
import WorkHybrid from '../../ui/entry/WorkHybrid';
import UsersHybrid from '../../ui/listing/UsersHybrid';
import UserHybrid from '../../ui/entry/UserHybrid';
import PageHybrid from '../../ui/entry/PageHybrid';
import ActivitiesHybrid from '../../ui/listing/ActivitiesHybrid';
import CommunitiesHybrid from '../../ui/pages/hosts/CommunitiesHybrid';

function parsePreloadedState(item) {
  return `
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(item).replace(/</g, '\\u003c')};
    </script>
  `;
}

export function ActivityList({ host, sink }) {
  const [searchParams] = useSearchParams();
  const showPast = Boolean(searchParams.get('showPast') === 'true');

  const Host = Meteor.call('getHost', host);
  const activities = Host.isPortalHost
    ? Meteor.call('getAllPublicActivitiesFromAllHosts', Boolean(showPast))
    : Meteor.call('getAllPublicActivities', Boolean(showPast), host);

  sink.appendToBody(parsePreloadedState({ activities, Host }));

  if (!Host) {
    return null;
  }

  return (
    <WrapperSSR Host={Host} sink={sink}>
      <ActivitiesHybrid activities={activities} Host={Host} showPast={showPast} />
    </WrapperSSR>
  );
}

export function Activity({ host, sink }) {
  const { activityId } = useParams();
  const activity = Meteor.call('getActivityById', activityId);
  const Host = Meteor.call('getHost', host);

  sink.appendToBody(parsePreloadedState({ activity, Host }));

  if (!activity) {
    return null;
  }

  return (
    <WrapperSSR isEntryPage Host={Host}>
      <ActivityHybrid activity={activity} Host={Host} />
    </WrapperSSR>
  );
}

export function GroupList({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const groups = Meteor.call('getGroupsWithMeetings', Host?.isPortalHost, host);

  sink.appendToBody(parsePreloadedState({ groups, Host }));

  return (
    <WrapperSSR Host={Host}>
      <GroupsHybrid groups={groups} Host={Host} />
    </WrapperSSR>
  );
}

export function Group({ host, sink }) {
  const { groupId } = useParams();
  const group = Meteor.call('getGroupWithMeetings', groupId);
  const Host = Meteor.call('getHost', host);

  sink.appendToBody(parsePreloadedState({ group, Host }));

  if (!group) {
    return null;
  }

  return (
    <WrapperSSR isEntryPage Host={Host}>
      <GroupHybrid group={group} Host={Host} />
    </WrapperSSR>
  );
}

export function ResourceList({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const resources = Host.isPortalHost
    ? Meteor.call('getResourcesFromAllHosts')
    : Meteor.call('getResources', host);

  sink.appendToBody(parsePreloadedState({ resources, Host }));

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

  sink.appendToBody(parsePreloadedState({ documents, resource, Host }));

  if (!resource) {
    return null;
  }

  return (
    <WrapperSSR isEntryPage Host={Host}>
      <ResourceHybrid documents={documents} resource={resource} Host={Host} />
    </WrapperSSR>
  );
}

export function WorkList({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const works = Host.isPortalHost
    ? Meteor.call('getAllWorksFromAllHosts')
    : Meteor.call('getAllWorks', host);

  sink.appendToBody(parsePreloadedState({ works, Host }));

  return (
    <WrapperSSR Host={Host}>
      <WorksHybrid Host={Host} works={works} />
    </WrapperSSR>
  );
}

export function Work({ host, sink }) {
  const { workId, usernameSlug } = useParams();
  const [, username] = usernameSlug.split('@');
  const work = Meteor.call('getWork', workId, username);
  const documents = Meteor.call('getDocumentsByAttachments', workId);
  const Host = Meteor.call('getHost', host);

  if (!work) {
    return null;
  }

  sink.appendToBody(parsePreloadedState({ documents, work, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host}>
      <WorkHybrid documents={documents} work={work} Host={Host} />
    </WrapperSSR>
  );
}

export function Page({ host, sink }) {
  const pages = Meteor.call('getPages', host);
  const Host = Meteor.call('getHost', host);

  if (!pages) {
    return null;
  }

  sink.appendToBody(parsePreloadedState({ pages, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host}>
      <PageHybrid pages={pages} Host={Host} />
    </WrapperSSR>
  );
}

export function UserList({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const users = Host.isPortalHost
    ? Meteor.call('getAllMembersFromAllHosts')
    : Meteor.call('getHostMembers', host);

  const keywords = Meteor.call('getKeywords');

  sink.appendToBody(parsePreloadedState({ keywords, users, Host }));

  return (
    <WrapperSSR Host={Host}>
      <UsersHybrid Host={Host} keywords={keywords} users={users} />
    </WrapperSSR>
  );
}

export function User({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const { usernameSlug } = useParams();
  if (usernameSlug && usernameSlug[0] !== '@') {
    return null;
  }
  const [, username] = usernameSlug.split('@');
  const user = Meteor.call('getUserInfo', username, host);

  sink.appendToBody(parsePreloadedState({ user, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host}>
      <UserHybrid Host={Host} user={user} />
    </WrapperSSR>
  );
}

export function Communities({ host, sink }) {
  const Host = Meteor.call('getHost', host);
  const hosts = Meteor.call('getAllHosts');

  sink.appendToBody(parsePreloadedState({ hosts, Host }));

  return (
    <WrapperSSR Host={Host}>
      <CommunitiesHybrid Host={Host} hosts={hosts} />
    </WrapperSSR>
  );
}

export function Home(props) {
  const host = props?.host;
  const Host = Meteor.call('getHost', host);

  if (!Host) {
    return null;
  }

  const getComponentBasedOnFirstRoute = () => {
    const menuItems = Host.settings?.menu;
    const visibleMenu = menuItems.filter((item) => item.isVisible);
    const firstRoute = visibleMenu && visibleMenu[0].name;

    switch (firstRoute) {
      case 'activities':
        return <ActivityList {...props} />;
      case 'groups':
        return <GroupList {...props} />;
      case 'works':
        return <WorkList {...props} />;
      case 'resources':
        return <ResourceList {...props} />;
      case 'info':
        return <Page {...props} />;
      case 'calendar':
        return <div />;
      default:
        return <UserList {...props} />;
    }
  };

  const Component = getComponentBasedOnFirstRoute();

  return Component;
}
