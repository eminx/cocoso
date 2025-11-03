import { call } from '/imports/ui/utils/shared';

export async function getHomeLoader({ Host, params, request }) {
  const host = Host?.host;
  const isPortalHost = Boolean(Host?.isPortalHost);
  const menu = Host?.settings?.menu;
  const homeRouteName = menu && menu[0]?.name;
  // const homeRoute = `/${homeRouteName}`;

  switch (homeRouteName) {
    case 'activities':
      return await getActivities({ host, isPortalHost, request });
    case 'groups':
      return await getGroups({ host, isPortalHost });
    case 'resources':
      return await getResources({ host, isPortalHost });
    case 'works':
      return await getWorks({ host, isPortalHost });
    case 'users':
      return await getPeople({ host, isPortalHost });
    default:
      return await getComposablePage({ params });
  }
}

export async function getActivities({ host, isPortalHost, request }) {
  const url = new URL(request?.url);
  const showPast = url?.searchParams?.get('showPast') === 'true' || false;

  const activities = isPortalHost
    ? await call('getAllPublicActivitiesFromAllHosts', showPast)
    : await call('getAllPublicActivities', showPast, host);

  return {
    activities,
    showPast,
  };
}

export async function getActivity({ params }) {
  if (!params) {
    return null;
  }

  const { activityId } = params;

  const activity = await call('getActivityById', activityId);

  return {
    activity,
  };
}

export async function getCalendarEntries({ host, isPortalHost }) {
  const activities = isPortalHost
    ? await call('getAllActivitiesFromAllHosts')
    : await call('getAllActivities', host);

  const resources = isPortalHost
    ? await call('getResourcesFromAllHosts')
    : await call('getResources', host);

  return {
    activities,
    resources,
  };
}

export async function getGroups({ host, isPortalHost }) {
  const groups = await call('getGroupsWithMeetings', isPortalHost, host);

  return {
    groups,
  };
}

export async function getGroup({ params }) {
  if (!params) {
    return null;
  }
  const { groupId } = params;
  const group = await call('getGroupWithMeetings', groupId);
  const documents = await call('getDocumentsByAttachments', groupId);

  return {
    documents,
    group,
  };
}

export async function getPages({ host }) {
  const pages = await call('getPages', host);

  return {
    pages,
  };
}

export async function getPeople({ host, isPortalHost }) {
  const keywords = await call('getKeywords');
  const users = isPortalHost
    ? await call('getAllMembersFromAllHosts')
    : await call('getHostMembers', host);

  return {
    keywords,
    users,
  };
}

export async function getResources({ host, isPortalHost }) {
  const resources = isPortalHost
    ? await call('getResourcesFromAllHosts')
    : await call('getResources', host);

  return {
    resources,
  };
}

export async function getResource({ params }) {
  if (!params) {
    return null;
  }

  const { resourceId } = params;
  const resource = await call('getResourceById', resourceId);
  const documents = await call('getDocumentsByAttachments', resourceId);

  return {
    documents,
    resource,
  };
}

export async function getUser({ host, params }) {
  if (!params) {
    return null;
  }

  const { usernameSlug } = params;
  const username = usernameSlug?.replace('@', '');
  const user = await call('getUserInfo', username, host);

  return {
    user,
  };
}

export async function getWorks({ host, isPortalHost }) {
  const works = isPortalHost
    ? await call('getAllWorksFromAllHosts')
    : await call('getAllWorks', host);

  return {
    works,
  };
}

export async function getWork({ params }) {
  if (!params) {
    return null;
  }

  const { usernameSlug, workId } = params;
  const username = usernameSlug?.replace('@', '');
  const work = await call('getWorkById', workId, username);
  const documents = await call('getDocumentsByAttachments', workId);

  return {
    documents,
    username,
    work,
  };
}

export async function getComposablePage({ params }) {
  if (!params) {
    return null;
  }

  const { composablePageId } = params;
  const composablePage = await call('getComposablePageById', composablePageId);

  return {
    composablePage,
  };
}

export async function getCommunities() {
  const hosts = await call('getAllHosts');

  return {
    hosts,
  };
}

export async function getHostMembersForAdmin() {
  const members = await call('getHostMembersForAdmin');

  return {
    members,
  };
}

export async function getEmails() {
  const emails = await call('getEmails');

  return {
    emails,
  };
}

export async function getComposablePageTitles() {
  const composablePageTitles = await call('getComposablePageTitles');

  return {
    composablePageTitles,
  };
}
