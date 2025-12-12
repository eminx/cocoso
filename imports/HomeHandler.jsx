import React, { Suspense } from 'react';
import loadable from '@loadable/component';

import { Skeleton } from '/imports/ui/core';

// Keep main public listing pages eager for SSR
import ActivityListHandler from '/imports/ui/pages/activities/ActivityListHandler';
import GroupListHandler from '/imports/ui/pages/groups/GroupListHandler';
import ResourceListHandler from '/imports/ui/pages/resources/ResourceListHandler';
import WorkListHandler from '/imports/ui/pages/works/WorkListHandler';
import PageItemHandler from '/imports/ui/pages/pages/PageItemHandler';
import UserListHandler from '/imports/ui/pages/profile/UserListHandler';
import ComposablePageHandler from '/imports/ui/pages/composablepages/ComposablePageHandler';

// Lazy load only heavy/less-common handlers
const CalendarHandler = loadable(
  () => import('/imports/ui/pages/calendar/CalendarHandler'),
  {
    fallback: <Skeleton isEntry />,
  }
);

export default function HomeHandler(props) {
  const Host = props?.Host;
  const menuItems = Host?.settings?.menu;
  const visibleMenu = menuItems?.filter((item) => item.isVisible);
  const firstRoute = visibleMenu?.[0]?.name;

  // Lazy load only the handler needed based on first route
  switch (firstRoute) {
    case 'activities':
      return <ActivityListHandler {...props} />;
    case 'groups':
      return <GroupListHandler {...props} />;
    case 'resources':
      return <ResourceListHandler {...props} />;
    case 'works':
      return <WorkListHandler {...props} />;
    case 'info':
      return <PageItemHandler {...props} />;
    case 'calendar':
      return (
        <Suspense fallback={<Skeleton isEntry />}>
          <CalendarHandler {...props} />
        </Suspense>
      );
    case 'people':
      return <UserListHandler {...props} />;
    default:
      return <ComposablePageHandler {...props} />;
  }
}
