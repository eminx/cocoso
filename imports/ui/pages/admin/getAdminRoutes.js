import React from 'react';
import { Trans } from 'react-i18next';

import { Code, Text } from '/imports/ui/core';

import Settings from './Settings';
import MenuSettings from './MenuSettings';
import DesignOptions from './design';
import Members from './Members';
import Emails from './Emails';
import EmailNewsletter from './EmailNewsletter';
import AdminHome from './AdminHome';
import {
  ActivitiesAdmin,
  CalendarAdmin,
  // CommunitiesAdmin,
  GroupsAdmin,
  PagesAdmin,
  PeopleAdmin,
  ResourcesAdmin,
  WorksAdmin,
} from './features';
import ComposablePages from '/imports/ui/pages/composablepages';

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
    value: 'home',
    content: <AdminHome />,
    description: <Trans i18nKey="admin:description" />,
  },
  {
    label: <Trans i18nKey="admin:settings.title" />,
    value: 'settings',
    isMulti: true,
    content: [
      {
        label: <Trans i18nKey="admin:info.label" />,
        value: 'settings/organization/*',
        content: <Settings />,
        description: <Trans i18nKey="admin:settings.description" />,
      },
      {
        label: <Trans i18nKey="admin:menu.title" />,
        value: 'settings/menu/*',
        content: <MenuSettings />,
        description: <Trans i18nKey="admin:menu.description" />,
      },
      {
        label: <Trans i18nKey="admin:settings.tabs.design" />,
        value: 'settings/design/*',
        content: <DesignOptions />,
        description: <Trans i18nKey="admin:design.description" />,
      },
    ],
  },
  {
    label: <Trans i18nKey="admin:composable.title" />,
    value: 'composable-pages/*',
    isMulti: false,
    content: <ComposablePages />,
    description: <Trans i18nKey="admin:composable.description" />,
  },
  {
    label: <Trans i18nKey="admin:listings.title" />,
    value: 'features',
    isMulti: true,
    content: [
      {
        label: getMenuLabel(menuItems, 'activities'),
        value: 'features/activities/*',
        content: <ActivitiesAdmin />,
        description: <Trans i18nKey="admin:menu.info" />,
      },
      {
        label: getMenuLabel(menuItems, 'calendar'),
        value: 'features/calendar/*',
        content: <CalendarAdmin />,
        description: <Trans i18nKey="admin:menu.info.calendar" />,
      },
      // {
      //   label: (
      //     <Text as="span">
      //       <Trans i18nKey="common:platform.communities" />
      //       <Code bg="gray.50" fontSize="xs" ml="2">
      //         /communities
      //       </Code>
      //     </Text>
      //   ),
      //   value: 'features/communities/*',
      //   content: <CommunitiesAdmin />,
      // },
      {
        label: getMenuLabel(menuItems, 'groups'),
        value: 'features/groups/*',
        content: <GroupsAdmin />,
        description: <Trans i18nKey="admin:menu.info.groups" />,
      },
      {
        label: getMenuLabel(menuItems, 'info'),
        value: 'features/pages/*',
        content: <PagesAdmin />,
        description: <Trans i18nKey="admin:menu.info.info" />,
      },
      {
        label: getMenuLabel(menuItems, 'people'),
        value: 'features/people/*',
        content: <PeopleAdmin />,
        description: <Trans i18nKey="admin:menu.info.people" />,
      },
      {
        label: getMenuLabel(menuItems, 'resources'),
        value: 'features/resources/*',
        content: <ResourcesAdmin />,
        description: <Trans i18nKey="admin:menu.info.resources" />,
      },
      {
        label: getMenuLabel(menuItems, 'works'),
        value: 'features/works/*',
        content: <WorksAdmin />,
        description: <Trans i18nKey="admin:menu.info.works" />,
      },
    ],
  },
  {
    label: <Trans i18nKey="admin:users.title" />,
    value: 'users/*',
    content: <Members />,
  },
  {
    label: <Trans i18nKey="admin:emails.title" />,
    value: 'emails/*',
    content: <Emails />,
  },
  {
    label: <Trans i18nKey="admin:newsletter.title" />,
    value: 'email-newsletter',
    content: <EmailNewsletter />,
  },
];

export default getAdminRoutes;
