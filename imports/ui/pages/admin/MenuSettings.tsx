import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Box } from '/imports/ui/core';

import AdminTabs from './AdminTabs';

export default function MenuSettings() {
  const [t] = useTranslation('admin');

  const tabs = [
    {
      title: t('settings.tabs.menuOrder'),
      path: '/admin/settings/menu/order',
    },
    {
      title: t('menu.options.label'),
      path: '/admin/settings/menu/options',
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
