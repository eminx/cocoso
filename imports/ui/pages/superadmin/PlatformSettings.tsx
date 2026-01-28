import React, { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtom, useAtomValue } from 'jotai';

import { Alert, Box, Center, Heading, Loader, Tabs } from '/imports/ui/core';
import { currentUserAtom, platformAtom } from '/imports/state';

export default function PlatformSettings() {
  const currentUser = useAtomValue(currentUserAtom);
  const [platform] = useAtom(platformAtom);
  const location = useLocation();
  const navigate = useNavigate();
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  if (!currentUser || !currentUser.isSuperAdmin) {
    return (
      <Center p="4" h="100vh">
        <Alert type="error">{tc('message.access.deny')}</Alert>
      </Center>
    );
  }

  if (!platform) {
    return <Loader />;
  }

  const tabs = [
    {
      title: t('settings.tabs.logo'),
      path: 'logo',
    },
    {
      title: t('settings.tabs.info'),
      path: 'info',
    },
    {
      title: t('settings.tabs.options'),
      path: 'options',
    },
    {
      title: t('settings.tabs.footer'),
      path: 'footer',
    },
  ];

  const pathname = location?.pathname;
  const pathnameLastPart = pathname.split('/').pop();
  const tabIndex =
    tabs && tabs.findIndex((tab) => tab.path === pathnameLastPart);

  useEffect(() => {
    if (tabs && !tabs.find((tab) => tab.path === pathnameLastPart)) {
      navigate(tabs[0].path);
    }
  }, [tabs, pathnameLastPart]);

  return (
    <Box mb="8" css={{ minHeight: '100vh' }}>
      <Heading size="lg">{platform?.name}</Heading>

      <Tabs index={tabIndex} tabs={tabs} />

      <Box mt="8">
        <Outlet />
      </Box>
    </Box>
  );
}
