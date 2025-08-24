import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { Flex, Heading, Text } from '/imports/ui/core';

import Boxling from './Boxling';

const shortCuts = [
  {
    label: <Trans i18nKey="admin:settings.tabs.logo" />,
    helper: <Trans i18nKey="admin:settings.tabs.logoHelper" />,
    link: '/admin/settings/organization/logo',
  },
  {
    label: <Trans i18nKey="admin:settings.tabs.info" />,
    helper: <Trans i18nKey="admin:settings.tabs.infoHelper" />,
    link: '/admin/settings/organization/info',
  },
  {
    label: <Trans i18nKey="admin:design.title" />,
    helper: <Trans i18nKey="admin:design.description" />,
    link: '/admin/settings/design',
  },
  {
    label: <Trans i18nKey="admin:composable.title" />,
    helper: <Trans i18nKey="admin:composable.description" />,
    link: '/admin/composable-pages/*',
  },
  {
    label: <Trans i18nKey="admin:settings.tabs.footer" />,
    helper: <Trans i18nKey="admin:settings.tabs.footerHelper" />,
    link: '/admin/settings/organization/footer',
  },
  {
    label: <Trans i18nKey="admin:settings.tabs.menu" />,
    helper: <Trans i18nKey="admin:settings.tabs.menuHelper" />,
    link: '/admin/settings/menu',
  },
  {
    label: <Trans i18nKey="admin:listings.title" />,
    helper: <Trans i18nKey="admin:listings.shortcutHelper" />,
    link: '/admin/features/activities',
  },
  {
    label: <Trans i18nKey="admin:emails.title" />,
    helper: <Trans i18nKey="admin:emails.shortcutHelper" />,
    link: '/admin/emails',
  },
  {
    label: <Trans i18nKey="admin:users.title" />,
    helper: <Trans i18nKey="admin:users.shortcutHelper" />,
    link: '/admin/users/all',
  },
  {
    label: <Trans i18nKey="admin:newsletter.title" />,
    helper: <Trans i18nKey="admin:newsletter.shortcutHelper" />,
    link: '/admin/email-newsletter',
  },
];

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <Flex wrap="wrap" gap="1rem">
      {shortCuts.map((item) => (
        <Boxling
          key={item.link}
          css={{
            cursor: 'pointer',
            flex: '1 1 200px',
            height: '100%',
            ':hover': {
              backgroundColor: 'white',
            },
          }}
          onClick={() => navigate(item.link)}
        >
          <Heading color="blue.700" mb="2" size="sm">
            {item.label}
          </Heading>
          <Text>{item.helper}</Text>
        </Boxling>
      ))}
    </Flex>
  );
}
