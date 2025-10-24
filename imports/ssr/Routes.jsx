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
    Component: Home,
    fetch: async ({ host }) => {
      const Host = await call('getHost', host);
      return { Host };
    },
  },
  {
    path: '/activities',
    exact: true,
    Component: ActivityList,
    fetch: async ({ host, search, isPortalHost }) => {
      const showPast = search?.get('showPast') === 'true';
      return isPortalHost
        ? await call('getAllPublicActivitiesFromAllHosts', showPast)
        : await call('getAllPublicActivities', showPast, host);
    },
  },
  {
    path: '/activities/:activityId',
    Component: Activity,
    fetch: async ({ params, host }) => {
      const activity = await call('getActivityById', params.activityId);
      const Host = await call('getHost', host);
      return { activity, Host };
    },
  },
  {
    path: '/groups',
    exact: true,
    Component: GroupList,
    fetch: async ({ host, isPortalHost }) =>
      await call('getGroupsWithMeetings', isPortalHost, host),
  },
  {
    path: '/groups/:groupId',
    Component: Group,
    fetch: async ({ params, host }) => {
      const group = await call('getGroupWithMeetings', params.groupId);
      const Host = await call('getHost', host);
      return { group, Host };
    },
  },
  {
    path: '/resources',
    exact: true,
    Component: ResourceList,
    fetch: async ({ host, isPortalHost }) =>
      isPortalHost
        ? await call('getResourcesFromAllHosts')
        : await call('getResources', host),
  },
  {
    path: '/resources/:resourceId',
    Component: Resource,
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
    Component: WorkList,
    fetch: async ({ host, isPortalHost }) =>
      isPortalHost
        ? await call('getAllWorksFromAllHosts')
        : await call('getAllWorks', host),
  },
  {
    path: '/works/:workId',
    Component: Work,
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
    Component: UserList,
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
    Component: User,
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
    Component: Communities,
    fetch: async ({ host }) => {
      const Host = await call('getHost', host);
      const hosts = await call('getAllHosts');
      return { Host, hosts };
    },
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
];
