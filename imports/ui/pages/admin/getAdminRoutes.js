import React from 'react';
import { Trans } from 'react-i18next';

import { Code, Text } from '/imports/ui/core';

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
        description: <Trans i18nKey="admin:settings.description" />,
      },
      {
        label: <Trans i18nKey="admin:menu.title" />,
        value: '/admin/settings/menu',
        description: <Trans i18nKey="admin:menu.description" />,
      },
      {
        label: <Trans i18nKey="admin:settings.tabs.design" />,
        value: '/admin/settings/design',
        description: <Trans i18nKey="admin:design.description" />,
      },
    ],
  },

  {
    label: <Trans i18nKey="admin:composable.title" />,
    value: '/admin/composable-pages',
    isMulti: false,
    description: <Trans i18nKey="admin:composable.description" />,
  },
  {
    label: <Trans i18nKey="admin:listings.title" />,
    value: '/admin/listing',
    isMulti: true,
    content: [
      {
        label: getMenuLabel(menuItems, 'activities'),
        value: '/admin/listing/activities',
        description: <Trans i18nKey="admin:menu.info.activities" />,
      },
      {
        label: getMenuLabel(menuItems, 'calendar'),
        value: '/admin/listing/calendar',
        description: <Trans i18nKey="admin:menu.info.calendar" />,
      },
      // {
      // label: getMenuLabel(menuItems, 'communities'),
      // value: '/admin/listing//communities',
      // },
      {
        label: getMenuLabel(menuItems, 'groups'),
        value: '/admin/listing/groups',
        description: <Trans i18nKey="admin:menu.info.groups" />,
      },
      {
        label: getMenuLabel(menuItems, 'info'),
        value: '/admin/listing/info',
        description: <Trans i18nKey="admin:menu.info.info" />,
      },
      {
        label: getMenuLabel(menuItems, 'people'),
        value: '/admin/listing/people',
        description: <Trans i18nKey="admin:menu.info.people" />,
      },
      {
        label: getMenuLabel(menuItems, 'resources'),
        value: '/admin/listing/resources',
        description: <Trans i18nKey="admin:menu.info.resources" />,
      },
      {
        label: getMenuLabel(menuItems, 'works'),
        value: '/admin/listing/works',
        description: <Trans i18nKey="admin:menu.info.works" />,
      },
    ],
  },
  {
    label: <Trans i18nKey="admin:users.title" />,
    value: '/admin/users',
    description: <Trans i18nKey="admin:users.description" />,
  },
  {
    label: <Trans i18nKey="admin:emails.title" />,
    value: '/admin/emails',
    description: <Trans i18nKey="admin:emails.description" />,
  },
  {
    label: <Trans i18nKey="admin:newsletter.title" />,
    value: '/admin/email-newsletter',
    description: <Trans i18nKey="admin:newsletter.description" />,
  },
];

export const getSuperAdminRoutes = () => [
  {
    label: <Trans i18nKey="admin:platform.main.title" />,
    value: '/superadmin/platform',
    isMulti: true,
    content: [
      {
        label: <Trans i18nKey="admin:platform.logo.title" />,
        description: <Trans i18nKey="admin:platform.logo.description" />,
        value: '/superadmin/platform/logo',
      },
      {
        label: <Trans i18nKey="admin:platform.info.title" />,
        description: <Trans i18nKey="admin:platform.info.description" />,
        value: '/superadmin/platform/info',
      },
      {
        label: <Trans i18nKey="admin:platform.options.title" />,
        description: <Trans i18nKey="admin:platform.options.description" />,
        value: '/superadmin/platform/options',
      },
      {
        label: <Trans i18nKey="admin:platform.footer.title" />,
        description: <Trans i18nKey="admin:platform.footer.description" />,
        value: '/superadmin/platform/footer',
      },
    ],
  },
  {
    label: <Trans i18nKey="admin:platform.intro.title" />,
    description: <Trans i18nKey="admin:platform.intro.description" />,
    value: '/superadmin/intro',
  },
  {
    label: <Trans i18nKey="admin:platform.newhost.title" />,
    description: <Trans i18nKey="admin:platform.newhost.description" />,
    value: '/superadmin/new-host',
  },
];

export default getAdminRoutes;
