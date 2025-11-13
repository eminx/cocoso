import React from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Box, Tabs } from '/imports/ui/core';
import AdminTabs from '/imports/ui/pages/admin/AdminTabs';

import MainFeatureSettings from './MainFeatureSettings';

export default function FeatureAdminWrapper({ listing, furtherTabs = [] }) {
  const [t] = useTranslation('admin');
  const [searchParams] = useSearchParams();

  const tabs = [
    {
      title: t('menu.title'),
      path: 'menu',
      content: <MainFeatureSettings listing={listing} />,
    },
    ...furtherTabs,
  ];

  const selectedTabValue = searchParams.get('tab');
  let tabIndex = tabs?.findIndex((tab) => tab.path === selectedTabValue);
  tabIndex === -1 ? (tabIndex = 0) : null;
  const selectedTab = tabs?.find((tab, index) => index === tabIndex);

  return (
    <>
      <Box mb="8">
        <Tabs index={tabIndex} tabs={tabs} withSearchParams />
      </Box>

      <Box>{selectedTab.content}</Box>
    </>
  );
}
