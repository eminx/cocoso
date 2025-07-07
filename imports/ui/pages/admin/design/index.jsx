import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

import TablyRouter from '/imports/ui/generic/TablyRouter';
import GeneralDesign from './GeneralDesign';
import ColorPicker from './ColorPicker';
import MenuDesign from './MenuDesign';

export default function DesignOptions() {
  const tabs = [
    {
      // title: <Trans i18nKey="admin:settings.tabs.color" />,
      title: 'General',
      path: 'general',
      content: <GeneralDesign />,
    },
    {
      title: <Trans i18nKey="admin:settings.tabs.color" />,
      path: 'color',
      content: <ColorPicker />,
    },
    {
      // title: <Trans i18nKey="admin:settings.tabs.color" />,
      title: 'Menu',
      path: 'navigation',
      content: <MenuDesign />,
    },
  ];

  return (
    <Box>
      <TablyRouter tabs={tabs} />
    </Box>
  );
}
