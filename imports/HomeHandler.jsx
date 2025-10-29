import React from 'react';

import ActivityListHandler from '/imports/ui/pages/activities/ActivityListHandler';
import GroupListHandler from '/imports/ui/pages/groups/GroupListHandler';
import ResourceListHandler from '/imports/ui/pages/resources/ResourceListHandler';
import WorkListHandler from '/imports/ui/pages/works/WorkListHandler';

export default function HomeHandler(props) {
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
