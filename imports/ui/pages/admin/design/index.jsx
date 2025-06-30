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
      // title: <Trans i18nKey="admin:settings.tabs.color" />,
      title: 'Header',
      path: 'header',
      content: <MenuDesign />,
    },
    {
      // title: <Trans i18nKey="admin:settings.tabs.color" />,
      title: 'Elements',
      path: 'elements',
      content: <div>Elements</div>,
    },
    {
      title: <Trans i18nKey="admin:settings.tabs.color" />,
      path: 'color',
      content: <ColorPicker />,
    },
  ];

  return (
    <Box>
      <TablyRouter tabs={tabs} />
    </Box>
  );
}
