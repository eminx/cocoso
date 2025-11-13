import React from 'react';
import { Trans } from 'react-i18next';

import { Code, Text } from '/imports/ui/core';

// import Settings from './AdminSettings';
// import MenuSettings from './MenuSettings';
// import DesignOptions from './design';
// import Members from './Members';
// import Emails from './Emails';
// import EmailNewsletter from './EmailNewsletter';
// import AdminHome from './AdminHome';
// import {
//   ActivitiesAdmin,
//   CalendarAdmin,
//   // CommunitiesAdmin,
//   GroupsAdmin,
//   PagesAdmin,
//   PeopleAdmin,
//   ResourcesAdmin,
//   WorksAdmin,
// } from './features';
// import ComposablePages from '/imports/ui/pages/composablepages';

const getMenuLabel = (menuItems, key) => (
  <>
    {menuItems?.find((item) => item.name === key)?.label}
    <Code bg="gray.50" size="xs" ml="2">
      /{key}
    </Code>
  </>
);

const getAdminRoutes = (menuItems) => [
  {
    label: <Trans i18nKey="admin:home" />,
    value: '/admin/home',
    // content: <AdminHome />,
    description: <Trans i18nKey="admin:description" />,
  },
  {
    label: <Trans i18nKey="admin:settings.title" />,
    value: '/admin/settings',
    isMulti: true,
    content: [
      {
        label: <Trans i18nKey="admin:info.label" />,
        value: '/admin/settings/organization',
        // content: <Settings />,
        description: <Trans i18nKey="admin:settings.description" />,
      },
      {
        label: <Trans i18nKey="admin:menu.title" />,
        value: '/admin/settings/menu',
        // content: <MenuSettings />,
        description: <Trans i18nKey="admin:menu.description" />,
      },
      {
        label: <Trans i18nKey="admin:settings.tabs.design" />,
        value: '/admin/settings/design',
        // content: <DesignOptions />,
        description: <Trans i18nKey="admin:design.description" />,
      },
    ],
  },

  {
    label: <Trans i18nKey="admin:composable.title" />,
    value: '/admin/composable-pages',
    isMulti: false,
    // content: <ComposablePages />,
    description: <Trans i18nKey="admin:composable.description" />,
  },
  {
    label: <Trans i18nKey="admin:listings.title" />,
    value: '/admin/features',
    isMulti: true,
    content: [
      {
        label: getMenuLabel(menuItems, 'activities'),
        value: '/admin/features/activities',
        // content: <ActivitiesAdmin />,
        description: <Trans i18nKey="admin:menu.info.activities" />,
      },
      {
        label: getMenuLabel(menuItems, 'calendar'),
        value: '/admin/features/calendar',
        // content: <CalendarAdmin />,
        description: <Trans i18nKey="admin:menu.info.calendar" />,
      },
      // {
      // label: getMenuLabel(menuItems, 'communities'),
      // value: '/admin/features//communities',
      // content: <CommunitiesAdmin />,
      // },
      {
        label: getMenuLabel(menuItems, 'groups'),
        value: '/admin/features/groups',
        // content: <GroupsAdmin />,
        description: <Trans i18nKey="admin:menu.info.groups" />,
      },
      {
        label: getMenuLabel(menuItems, 'info'),
        value: '/admin/features/pages',
        // content: <PagesAdmin />,
        description: <Trans i18nKey="admin:menu.info.info" />,
      },
      {
        label: getMenuLabel(menuItems, 'people'),
        value: '/admin/features/people',
        // content: <PeopleAdmin />,
        description: <Trans i18nKey="admin:menu.info.people" />,
      },
      {
        label: getMenuLabel(menuItems, 'resources'),
        value: '/admin/features/resources',
        // content: <ResourcesAdmin />,
        description: <Trans i18nKey="admin:menu.info.resources" />,
      },
      {
        label: getMenuLabel(menuItems, 'works'),
        value: '/admin/features/works',
        // content: <WorksAdmin />,
        description: <Trans i18nKey="admin:menu.info.works" />,
      },
    ],
  },
  {
    label: <Trans i18nKey="admin:users.title" />,
    value: '/admin/users',
    // content: <Members />,
    description: <Trans i18nKey="admin:users.description" />,
  },
  {
    label: <Trans i18nKey="admin:emails.title" />,
    value: '/admin/emails',
    // content: <Emails />,
    description: <Trans i18nKey="admin:emails.description" />,
  },
  {
    label: <Trans i18nKey="admin:newsletter.title" />,
    value: '/admin/email-newsletter',
    // content: <EmailNewsletter />,
    description: <Trans i18nKey="admin:newsletter.description" />,
  },
];

export default getAdminRoutes;
