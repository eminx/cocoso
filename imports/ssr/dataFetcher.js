import queryString from 'query-string';
import { call } from '/imports/ui/utils/shared';

export default async function dataFetcher({
  host,
  isPortalHost = false,
  menu,
  pathname,
  search,
}) {
  const homeRouteName = menu && menu[0]?.name;
  const homeRoute = `/${homeRouteName}`;
  const isHomePage = pathname === '/null';

  if (
    pathname === '/activities' ||
    (isHomePage && homeRoute === '/activities')
  ) {
    const showPastValue = queryString.parse(search)?.showPast;
    const showPast = showPastValue === 'true' || false;
    if (isPortalHost) {
      return {
        activities: await call('getAllPublicActivitiesFromAllHosts', showPast),
      };
    }
    return {
      activities: await call('getAllPublicActivities', showPast, host),
    };
  }

  if (pathname === '/groups') {
    return {
      groups: await call('getGroupsWithMeetings', isPortalHost, host),
    };
  }

  if (pathname === '/resources') {
    if (isPortalHost) {
      return {
        resources: await call('getResourcesFromAllHosts'),
      };
    }
    return {
      resources: await call('getResources', host),
    };
  }

  if (pathname === '/works') {
    if (isPortalHost) {
      return {
        works: await call('getAllWorksFromAllHosts'),
      };
    }
    return {
      works: await call('getAllWorks', host),
    };
  }

  if (pathname === '/people') {
    const data = {};
    const keywords = await call('getKeywords');
    data.keywords = keywords;
    if (isPortalHost) {
      const users = await call('getAllMembersFromAllHosts');
      data.users = users;
      return data;
    }
    const users = await call('getHostMembers', host);
    data.users = users;
    return data;
  }

  const param = pathname.split('/')[2];

  if (pathname.includes('/info/')) {
    return {
      pages: await call('getPages', host),
    };
  }

  if (pathname.includes('/activities/') && param?.length > 10) {
    return {
      activity: await call('getActivityById', param),
    };
  }

  if (pathname.includes('/cp/') && param?.length > 10) {
    return {
      composablePage: await call('getComposablePageById', param),
    };
  }

  if (pathname.includes('/groups/') && param?.length > 10) {
    return {
      group: await call('getGroupWithMeetings', param),
      documents: await call('getDocumentsByAttachments', param),
    };
  }

  if (pathname.includes('/resources/') && param?.length > 10) {
    return {
      resource: await call('getResourceById', param, host),
      documents: await call('getDocumentsByAttachments', param),
    };
  }

  const workParam = pathname.split('/')[3];
  if (pathname.includes('/works/') && workParam?.length > 10) {
    const username = pathname.split('/')[1]?.replace('@', '');
    return {
      work: await call('getActivityById', param, username),
      documents: await call('getDocumentsByAttachments', param),
    };
  }

  const userParam = pathname.split('/')[1];
  const username = userParam.substring(1, userParam.length);
  return {
    user: await call('getUserInfo', username, host),
  };
}
