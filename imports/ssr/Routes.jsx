import { call } from '/imports/ui/utils/shared';
import {
  ActivityList,
  Activity,
  Communities,
  ComposablePage,
  Home,
  GroupList,
  Group,
  Page,
  ResourceList,
  Resource,
  WorkList,
  Work,
  UserList,
  User,
} from './components';
import NotFoundPage from '/imports/ui/pages/NotFoundPage';

export const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
    fetch: async ({ host }) => {
      const Host = await call('getHost', host);
      return { Host };
    },
  },
  {
    path: '/activities',
    exact: true,
    component: ActivityList,
    fetch: async ({ host, search, isPortalHost }) => {
      const showPast = search?.get('showPast') === 'true';
      return isPortalHost
        ? await call('getAllPublicActivitiesFromAllHosts', showPast)
        : await call('getAllPublicActivities', showPast, host);
    },
  },
  {
    path: '/activities/:activityId',
    component: Activity,
    fetch: async ({ params, host }) => {
      const activity = await call('getActivityById', params.activityId);
      const Host = await call('getHost', host);
      return { activity, Host };
    },
  },
  {
    path: '/groups',
    exact: true,
    component: GroupList,
    fetch: async ({ host, isPortalHost }) =>
      await call('getGroupsWithMeetings', isPortalHost, host),
  },
  {
    path: '/groups/:groupId',
    component: Group,
    fetch: async ({ params, host }) => {
      const group = await call('getGroupWithMeetings', params.groupId);
      const Host = await call('getHost', host);
      return { group, Host };
    },
  },
  {
    path: '/resources',
    exact: true,
    component: ResourceList,
    fetch: async ({ host, isPortalHost }) =>
      isPortalHost
        ? await call('getResourcesFromAllHosts')
        : await call('getResources', host),
  },
  {
    path: '/resources/:resourceId',
    component: Resource,
    fetch: async ({ params, host }) => {
      const resource = await call('getResourceById', params.resourceId);
      const documents = await call(
        'getDocumentsByAttachments',
        params.resourceId
      );
      const Host = await call('getHost', host);
      return { resource, documents, Host };
    },
  },
  {
    path: '/works',
    exact: true,
    component: WorkList,
    fetch: async ({ host, isPortalHost }) =>
      isPortalHost
        ? await call('getAllWorksFromAllHosts')
        : await call('getAllWorks', host),
  },
  {
    path: '/works/:workId',
    component: Work,
    fetch: async ({ params, host }) => {
      const work = await call('getWorkById', params.workId);
      const documents = await call('getDocumentsByAttachments', params.workId);
      const Host = await call('getHost', host);
      return { work, documents, Host };
    },
  },
  {
    path: '/people',
    exact: true,
    component: UserList,
    fetch: async ({ host, isPortalHost }) => {
      const keywords = await call('getKeywords');
      const users = isPortalHost
        ? await call('getAllMembersFromAllHosts')
        : await call('getHostMembers', host);
      return { users, keywords };
    },
  },
  {
    path: '/:usernameSlug',
    component: User,
    fetch: async ({ params, host }) => {
      if (!params.usernameSlug || params.usernameSlug[0] !== '@') return {};
      const [, username] = params.usernameSlug.split('@');
      const user = await call('getUserInfo', username, host);
      const Host = await call('getHost', host);
      return { user, Host };
    },
  },
  {
    path: '/communities',
    exact: true,
    component: Communities,
    fetch: async ({ host }) => {
      const Host = await call('getHost', host);
      const hosts = await call('getAllHosts');
      return { Host, hosts };
    },
  },
  {
    path: '*',
    component: NotFoundPage,
  },
];
