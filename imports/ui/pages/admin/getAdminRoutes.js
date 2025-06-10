import React from 'react';
import { Trans } from 'react-i18next';
import { Code, Text } from '@chakra-ui/react';

import Settings from './Settings';
import MenuSettings from './MenuSettings';
import ColorPicker from './ColorPicker';
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
  <Text as="span">
    {menuItems?.find((item) => item.name === key)?.label}
    <Code bg="gray.50" fontSize="xs" ml="2">
      /{key}
    </Code>
  </Text>
);

const getAdminRoutes = (menuItems) => [
  {
    label: <Trans i18nKey="admin:home" />,
    value: 'home',
    content: <AdminHome />,
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
      },
      {
        label: <Trans i18nKey="admin:menu.title" />,
        value: 'settings/menu/*',
        content: <MenuSettings />,
      },
      {
        label: <Trans i18nKey="admin:settings.tabs.color" />,
        value: 'settings/color',
        content: <ColorPicker />,
      },
    ],
  },
  {
    label: <Trans i18nKey="admin:composable.title" />,
    value: 'composable-pages/*',
    isMulti: false,
    content: <ComposablePages />,
  },
  {
    label: <Trans i18nKey="admin:features.title" />,
    value: 'features',
    isMulti: true,
    content: [
      {
        label: getMenuLabel(menuItems, 'activities'),
        value: 'features/activities/*',
        content: <ActivitiesAdmin />,
      },
      {
        label: getMenuLabel(menuItems, 'calendar'),
        value: 'features/calendar/*',
        content: <CalendarAdmin />,
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
      },
      {
        label: getMenuLabel(menuItems, 'info'),
        value: 'features/pages/*',
        content: <PagesAdmin />,
      },
      {
        label: getMenuLabel(menuItems, 'people'),
        value: 'features/people/*',
        content: <PeopleAdmin />,
      },
      {
        label: getMenuLabel(menuItems, 'resources'),
        value: 'features/resources/*',
        content: <ResourcesAdmin />,
      },
      {
        label: getMenuLabel(menuItems, 'works'),
        value: 'features/works/*',
        content: <WorksAdmin />,
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
