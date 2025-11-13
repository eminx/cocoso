import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Box } from '/imports/ui/core';

import MainFeatureSettings from './MainFeatureSettings';
import AdminTabs from '/imports/ui/pages/admin/AdminTabs';

export default function FeatureAdminWrapper({ furtherTabs = [] }) {
  const [t] = useTranslation('admin');

  const tabs = [
    {
      title: t('menu.title'),
      path: 'menu',
    },
    ...furtherTabs,
  ];

  return (
    <AdminTabs tabs={tabs}>
      <Box mb="24">
        <Outlet />
      </Box>
    </AdminTabs>
  );
}
