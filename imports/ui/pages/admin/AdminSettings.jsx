import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Trans } from 'react-i18next';

import { Box, Tabs } from '/imports/ui/core';

import Boxling from './Boxling';

export default function AdminSettings() {
  const location = useLocation();

  const tabs = [
    {
      title: <Trans i18nKey="admin:settings.tabs.logo" />,
      path: 'logo',
    },
    {
      title: <Trans i18nKey="admin:settings.tabs.info" />,
      path: 'info',
    },
    {
      title: <Trans i18nKey="admin:settings.tabs.footer" />,
      path: 'footer',
    },
  ];

  const pathname = location?.pathname;
  const pathnameLastPart = pathname.split('/').pop();
  const tabIndex =
    tabs && tabs.findIndex((tab) => tab.path === pathnameLastPart);

  useEffect(() => {
    if (tabs && !tabs.find((tab) => tab.path === pathnameLastPart)) {
      return <Navigate to="/settings/logo" />;
    }
  }, [pathname]);

  return (
    <>
      <Box mb="8">
        <Tabs index={tabIndex} mb="4" tabs={tabs} />
      </Box>

      <Box mb="24" py="4">
        <Outlet />
      </Box>
    </>
  );
}
