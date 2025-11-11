import React, { lazy } from 'react';

import ActivityListHandler from '/imports/ui/pages/activities/ActivityListHandler';
import GroupListHandler from '/imports/ui/pages/groups/GroupListHandler';
import ResourceListHandler from '/imports/ui/pages/resources/ResourceListHandler';
import WorkListHandler from '/imports/ui/pages/works/WorkListHandler';
import PageItemHandler from '/imports/ui/pages/pages/PageItemHandler';
import CalendarHandler from '/imports/ui/pages/calendar/CalendarHandler';
import UserListHandler from '/imports/ui/pages/profile/UserListHandler';
import ComposablePageHandler from '/imports/ui/pages/composablepages/ComposablePageHandler';

export default function HomeHandler(props) {
  const Host = props?.Host;
  const menuItems = Host.settings?.menu;
  const visibleMenu = menuItems?.filter((item) => item.isVisible);
  const firstRoute = visibleMenu && visibleMenu[0].name;

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
      return <CalendarHandler {...props} />;
    case 'people':
      return <UserListHandler {...props} />;
    default:
      return <ComposablePageHandler {...props} />;
  }
}
