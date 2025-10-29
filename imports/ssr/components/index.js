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
