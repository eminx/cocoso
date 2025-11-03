import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { Trans } from 'react-i18next';

import { Box } from '/imports/ui/core';

import AdminTabs from './AdminTabs';

export default function AdminSettings() {
  const tabs = [
    {
      title: <Trans i18nKey="admin:settings.tabs.logo" />,
      path: '/admin/settings/organization/logo',
    },
    {
      title: <Trans i18nKey="admin:settings.tabs.info" />,
      path: '/admin/settings/organization/info',
    },
    {
      title: <Trans i18nKey="admin:settings.tabs.footer" />,
      path: '/admin/settings/organization/footer',
    },
  ];

  return (
    <AdminTabs tabs={tabs}>
      <Box mb="24">
        <Outlet />
      </Box>
    </AdminTabs>
  );
}
