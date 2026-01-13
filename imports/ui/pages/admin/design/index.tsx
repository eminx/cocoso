import React from 'react';
import { Outlet } from 'react-router';
import { Trans } from 'react-i18next';

import { Box } from '/imports/ui/core';

import AdminTabs from '../AdminTabs';

export default function AdminDesign() {
  const tabs = [
    {
      title: <Trans i18nKey="admin:design.tabs.theme" />,
      path: '/admin/settings/design/theme',
    },
    {
      title: <Trans i18nKey="admin:design.tabs.menu" />,
      path: '/admin/settings/design/navigation',
    },
  ];

  return (
    <AdminTabs tabs={tabs}>
      <Outlet />
    </AdminTabs>
  );
}
