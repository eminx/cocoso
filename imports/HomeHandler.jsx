import React, { lazy } from 'react';

const ActivityListHandler = lazy(() =>
  import('/imports/ui/pages/activities/ActivityListHandler')
);
const GroupListHandler = lazy(() =>
  import('/imports/ui/pages/groups/GroupListHandler')
);
const ResourceListHandler = lazy(() =>
  import('/imports/ui/pages/resources/ResourceListHandler')
);
const WorkListHandler = lazy(() =>
  import('/imports/ui/pages/works/WorkListHandler')
);
const PageItemHandler = lazy(() =>
  import('/imports/ui/pages/pages/PageItemHandler')
);
const CalendarHandler = lazy(() =>
  import('/imports/ui/pages/calendar/CalendarHandler')
);
const UserListHandler = lazy(() =>
  import('/imports/ui/pages/profile/UserListHandler')
);
const ComposablePageHandler = lazy(() =>
  import('/imports/ui/pages/composablepages/ComposablePageHandler')
);

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
