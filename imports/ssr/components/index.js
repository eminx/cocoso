import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import { useHydrateAtoms } from 'jotai/utils';

import WrapperHybrid from '../../ui/layout/WrapperHybrid';

import ComposablePageHybrid from '/imports/ui/entry/ComposablePageHybrid';
import UsersHybrid from '../../ui/listing/UsersHybrid';
import UserHybrid from '../../ui/entry/UserHybrid';
import PageHybrid from '../../ui/entry/PageHybrid';
import CommunitiesHybrid from '../../ui/pages/hosts/CommunitiesHybrid';

export function Calendar({ Host, pageTitles }) {
  return <WrapperHybrid Host={Host} pageTitles={pageTitles} />;
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
    <WrapperHybrid Host={Host} pageTitles={pageTitles}>
      {() => (
        <ComposablePageHybrid composablePage={composablePage} Host={Host} />
      )}
    </WrapperHybrid>
  );
}

export function Group({ Host, pageTitles }) {
  const { documents, group } = useLoaderData();

  return (
    <WrapperHybrid isEntryPage Host={Host} pageTitles={pageTitles}>
      {(rendered) => (
        <>
          <GroupHybrid group={group} Host={Host} />
        </>
      )}
    </WrapperHybrid>
  );
}

export function Work({ Host, pageTitles }) {
  const { documents, work } = useLoaderData();

  return (
    <WrapperHybrid isEntryPage Host={Host} pageTitles={pageTitles}>
      <WorkHybrid documents={documents} work={work} Host={Host} />
    </WrapperHybrid>
  );
}

export function Page({ Host, pageTitles }) {
  const { pages } = useLoaderData();

  return (
    <WrapperHybrid Host={Host} pageTitles={pageTitles}>
      <PageHybrid Host={Host} pages={pages} />
    </WrapperHybrid>
  );
}

export function UserList({ Host, pageTitles }) {
  const { keywords, users } = useLoaderData();

  return (
    <WrapperHybrid Host={Host} pageTitles={pageTitles}>
      <UsersHybrid Host={Host} keywords={keywords} users={users} />
    </WrapperHybrid>
  );
}

export function User({ Host, pageTitles }) {
  const { user } = useLoaderData();

  return (
    <WrapperHybrid isEntryPage Host={Host} pageTitles={pageTitles}>
      <UserHybrid Host={Host} user={user} />
    </WrapperHybrid>
  );
}

export function Communities({ Host, pageTitles }) {
  const { hosts } = useLoaderData();

  return (
    <WrapperHybrid Host={Host} pageTitles={pageTitles}>
      <CommunitiesHybrid Host={Host} hosts={hosts} />
    </WrapperHybrid>
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
      return <ActivityListHandler {...props} />;
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
