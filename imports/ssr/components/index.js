import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import {
  useHref,
  useLoaderData,
  useParams,
  useSearchParams,
} from 'react-router';

import LayoutContainer from '/imports/ui/LayoutContainer';
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

// import ActivityInteractionHandler from '/imports/ui/pages/activities/components/ActivityInteractionHandler';

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

const isClient = Meteor?.isClient;

export function ActivityList({ Host, pageTitles }) {
  const { activities } = useLoaderData();
  const [searchParams] = useSearchParams();
  const showPast = Boolean(searchParams.get('showPast') === 'true');

  return (
    <>
      <WrapperSSR Host={Host} pageTitles={pageTitles}>
        <ActivitiesHybrid
          activities={activities}
          Host={Host}
          showPast={showPast}
        />
      </WrapperSSR>
    </>
  );
}

export function Activity({ Host, pageTitles }) {
  const [rendered, setRendered] = useState(false);
  const { activity } = useLoaderData();

  useEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  return (
    <WrapperSSR isEntryPage pageTitles={pageTitles} Host={Host}>
      <ActivityHybrid activity={activity} Host={Host} />
    </WrapperSSR>
  );
}

export function Calendar({ Host, pageTitles }) {
  return <WrapperSSR Host={Host} pageTitles={pageTitles} />;
}

export function ComposablePage({ Host, pageTitles }) {
  const { composablePage } = useLoaderData();
  // if (href === '/' && !composablePageId) {
  //   composablePageId = Host?.settings?.menu[0]?.name;
  // }

  if (!composablePage || !composablePage.isPublished) {
    return null;
  }

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <ComposablePageHybrid composablePage={composablePage} Host={Host} />
    </WrapperSSR>
  );
}

export function GroupList({ Host, pageTitles }) {
  const { groups } = useLoaderData();

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <GroupsHybrid groups={groups} Host={Host} />
    </WrapperSSR>
  );
}

export function Group({ Host, pageTitles }) {
  const { documents, group } = useLoaderData();

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <GroupHybrid group={group} Host={Host} />
    </WrapperSSR>
  );
}

export function ResourceList({ Host, pageTitles }) {
  const { resources } = useLoaderData();

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <ResourcesHybrid Host={Host} resources={resources} />
    </WrapperSSR>
  );
}

export function Resource({ Host, pageTitles }) {
  const { documents, resource } = useLoaderData();

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <ResourceHybrid documents={documents} resource={resource} Host={Host} />
    </WrapperSSR>
  );
}

export function WorkList({ Host, pageTitles }) {
  const { works } = useLoaderData();

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <WorksHybrid Host={Host} works={works} />
    </WrapperSSR>
  );
}

export function Work({ Host, pageTitles }) {
  const { documents, work } = useLoaderData();

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <WorkHybrid documents={documents} work={work} Host={Host} />
    </WrapperSSR>
  );
}

export function Page({ Host, pageTitles }) {
  const { pages } = useLoaderData();

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <PageHybrid Host={Host} pages={pages} />
    </WrapperSSR>
  );
}

export function UserList({ Host, pageTitles }) {
  const { keywords, users } = useLoaderData();

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <UsersHybrid Host={Host} keywords={keywords} users={users} />
    </WrapperSSR>
  );
}

export function User({ Host, pageTitles }) {
  const { user } = useLoaderData();

  return (
    <WrapperSSR isEntryPage Host={Host} pageTitles={pageTitles}>
      <UserHybrid Host={Host} user={user} />
    </WrapperSSR>
  );
}

export function Communities({ Host, pageTitles }) {
  const { hosts } = useLoaderData();

  return (
    <WrapperSSR Host={Host} pageTitles={pageTitles}>
      <CommunitiesHybrid Host={Host} hosts={hosts} />
    </WrapperSSR>
  );
}

export function Home(props) {
  const Host = props?.Host;
  const host = Host?.host;
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
}
