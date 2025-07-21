import React from 'react';
import { Trans } from 'react-i18next';

import { Box, Heading } from '/imports/ui/core';
import TablyRouter from '/imports/ui/generic/TablyRouter';

import MenuDesign from './MenuDesign';
import ThemeHandler from './ThemeHandler';

export default function DesignOptions() {
  const tabs = [
    {
      title: <Trans i18nKey="admin:design.tabs.theme" />,
      path: 'theme',
      content: <ThemeHandler />,
    },
    {
      title: <Trans i18nKey="admin:design.tabs.menu" />,
      path: 'navigation',
      content: <MenuDesign />,
    },
  ];

  return <TablyRouter tabs={tabs} />;
}
