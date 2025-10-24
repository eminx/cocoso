import { Meteor } from 'meteor/meteor';
import React from 'react';
import {
  useHref,
  useLoaderData,
  useParams,
  useSearchParams,
} from 'react-router';

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

export function ActivityList({ Host, pageTitles, sink }) {
  console.log('activitilist');
  const { activities } = useLoaderData();
  const [searchParams] = useSearchParams();
  const showPast = Boolean(searchParams.get('showPast') === 'true');
  sink && sink.appendToBody(parsePreloadedState({ activities, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <ActivitiesHybrid
        activities={activities}
        Host={Host}
        showPast={showPast}
      />
    </WrapperSSR>
  );
}

export function Activity({ Host, pageTitles, sink }) {
  const { activity } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ activity, Host }));

  return (
    <WrapperSSR isEntryPage pageTitles={pageTitles} Host={Host}>
      <ActivityHybrid activity={activity} Host={Host} />
    </WrapperSSR>
  );
}

export function Calendar({ Host, pageTitles, sink }) {
  sink && sink.appendToBody(parsePreloadedState({ Host }));

  return <WrapperSSR Host={Host} pageTitles={pageTitles} />;
}

export function ComposablePage({ Host, pageTitles, sink }) {
  const { composablePage } = useLoaderData();
  // if (href === '/' && !composablePageId) {
  //   composablePageId = Host?.settings?.menu[0]?.name;
  // }

  sink && sink.appendToBody(parsePreloadedState({ composablePage, Host }));

  if (!composablePage || !composablePage.isPublished) {
    return null;
  }

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <ComposablePageHybrid composablePage={composablePage} Host={Host} />
    </WrapperSSR>
  );
}

export function GroupList({ Host, pageTitles, sink }) {
  const { groups } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ groups, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <GroupsHybrid groups={groups} Host={Host} />
    </WrapperSSR>
  );
}

export function Group({ Host, pageTitles, sink }) {
  const { documents, group } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ documents, group, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <GroupHybrid group={group} Host={Host} />
    </WrapperSSR>
  );
}

export function ResourceList({ Host, pageTitles, sink }) {
  const { resources } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ resources, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <ResourcesHybrid Host={Host} resources={resources} />
    </WrapperSSR>
  );
}

export function Resource({ Host, pageTitles, sink }) {
  const { documents, resource } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ documents, resource, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <ResourceHybrid documents={documents} resource={resource} Host={Host} />
    </WrapperSSR>
  );
}

export function WorkList({ Host, pageTitles, sink }) {
  const { works } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ works, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <WorksHybrid Host={Host} works={works} />
    </WrapperSSR>
  );
}

export function Work({ Host, pageTitles, sink }) {
  const { documents, work } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ documents, work, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <WorkHybrid documents={documents} work={work} Host={Host} />
    </WrapperSSR>
  );
}

export function Page({ Host, pageTitles, sink }) {
  const { pages } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ pages, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <PageHybrid Host={Host} pages={pages} />
    </WrapperSSR>
  );
}

export function UserList({ Host, pageTitles, sink }) {
  const { keywords, users } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ keywords, users, Host }));

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <UsersHybrid Host={Host} keywords={keywords} users={users} />
    </WrapperSSR>
  );
}

export function User({ Host, pageTitles, sink }) {
  const { user } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ user, Host }));

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <UserHybrid Host={Host} user={user} />
    </WrapperSSR>
  );
}

export function Communities({ Host, pageTitles, sink }) {
  const { hosts } = useLoaderData();
  sink && sink.appendToBody(parsePreloadedState({ hosts, Host }));

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
