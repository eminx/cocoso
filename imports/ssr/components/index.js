import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useHref, useParams, useSearchParams } from 'react-router-dom';

import WrapperSSR from '../../ui/layout/WrapperSSR';
import ActivityHybrid from '../../ui/entry/ActivityHybrid';
import ComposablePageHybrid from '/imports/ui/entry/ComposablePageHybrid';
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
      window.__PRELOADED_STATE__ = ${JSON.stringify(item).replace(
        /</g,
        '\\u003c'
      )};
    </script>
  `;
}

export function ActivityList({ data, Host, pageTitles, sink }) {
  const [searchParams] = useSearchParams();
  const showPast = Boolean(searchParams.get('showPast') === 'true');
  const activities = [...data?.activities];
  sink.appendToBody(parsePreloadedState({ activities, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles} sink={sink}>
      <ActivitiesHybrid
        activities={activities}
        Host={Host}
        showPast={showPast}
      />
    </WrapperSSR>
  );
}

export function Activity({ data, Host, pageTitles, sink }) {
  const activity = { ...data?.activity };
  sink.appendToBody(parsePreloadedState({ activity, Host }));

  return (
    <WrapperSSR isEntryPage pageTitles={pageTitles} Host={Host}>
      <ActivityHybrid activity={activity} Host={Host} />
    </WrapperSSR>
  );
}

export function Calendar({ Host, pageTitles, sink }) {
  sink.appendToBody(parsePreloadedState({ Host }));

  return <WrapperSSR Host={Host} pageTitles={pageTitles} sink={sink} />;
}

export function ComposablePage({ data, Host, pageTitles, sink }) {
  const composablePage = { ...data?.composablePage };

  // if (href === '/' && !composablePageId) {
  //   composablePageId = Host?.settings?.menu[0]?.name;
  // }

  sink.appendToBody(parsePreloadedState({ Host }));

  if (!composablePage || !composablePage.isPublished) {
    return null;
  }

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <ComposablePageHybrid composablePage={composablePage} Host={Host} />
    </WrapperSSR>
  );
}

export function GroupList({ data, Host, pageTitles, sink }) {
  const groups = [...data?.groups];
  sink.appendToBody(parsePreloadedState({ groups, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <GroupsHybrid groups={groups} Host={Host} />
    </WrapperSSR>
  );
}

export function Group({ data, Host, pageTitles, sink }) {
  const group = { ...data?.group };
  const documents = data?.documents;
  sink.appendToBody(parsePreloadedState({ group, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <GroupHybrid group={group} Host={Host} />
    </WrapperSSR>
  );
}

export function ResourceList({ data, Host, pageTitles, sink }) {
  const resources = [...data?.resources];
  sink.appendToBody(parsePreloadedState({ resources, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <ResourcesHybrid Host={Host} resources={resources} />
    </WrapperSSR>
  );
}

export function Resource({ data, Host, pageTitles, sink }) {
  const resource = { ...data?.resource };
  const documents = data?.documents;
  sink.appendToBody(parsePreloadedState({ documents, resource, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <ResourceHybrid documents={documents} resource={resource} Host={Host} />
    </WrapperSSR>
  );
}

export function WorkList({ data, Host, pageTitles, sink }) {
  const works = [...data?.works];
  sink.appendToBody(parsePreloadedState({ works, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <WorksHybrid Host={Host} works={works} />
    </WrapperSSR>
  );
}

export function Work({ data, Host, pageTitles, sink }) {
  const work = { ...data?.work };
  const documents = data?.documents;
  sink.appendToBody(parsePreloadedState({ documents, work, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <WorkHybrid documents={documents} work={work} Host={Host} />
    </WrapperSSR>
  );
}

export function Page({ data, Host, pageTitles, sink }) {
  const pages = [...data?.pages];
  sink.appendToBody(parsePreloadedState({ pages, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <PageHybrid Host={Host} pages={pages} />
    </WrapperSSR>
  );
}

export function UserList({ data, Host, pageTitles, sink }) {
  const users = [...data?.users];
  const keywords = [...data?.keywords];
  sink.appendToBody(parsePreloadedState({ keywords, users, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <UsersHybrid Host={Host} keywords={keywords} users={users} />
    </WrapperSSR>
  );
}

export function User({ data, Host, pageTitles, sink }) {
  const user = { ...data?.user };
  sink.appendToBody(parsePreloadedState({ user, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <UserHybrid Host={Host} user={user} />
    </WrapperSSR>
  );
}

export function Communities({ data, Host, pageTitles, sink }) {
  const hosts = [...data?.hosts];
  sink.appendToBody(parsePreloadedState({ hosts, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
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
    const visibleMenu = menuItems?.filter((item) => item.isVisible);
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
        return <Calendar {...props} />;
      case 'people':
        return <UserList {...props} />;
      default:
        return <ComposablePage {...props} />;
    }
  };

  const Component = getComponentBasedOnFirstRoute();

  return Component;
}
