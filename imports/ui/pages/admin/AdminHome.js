import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Text, Wrap } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

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
    <Wrap spacing="4">
      {shortCuts.map((item) => (
        <Boxling
          key={item.link}
          _hover={{ bg: 'white' }}
          style={{ flex: '1 1 200px', cursor: 'pointer' }}
          onClick={() => navigate(item.link)}
        >
          <Heading color="blue.700" mb="2" size="md">
            {item.label}
          </Heading>
          <Text>{item.helper}</Text>
        </Boxling>
      ))}
    </Wrap>
  );
}
