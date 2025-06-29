import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

import TablyRouter from '/imports/ui/generic/TablyRouter';
import ColorPicker from './ColorPicker';
import { Trans } from 'react-i18next';

export default function DesignOptions() {
  const tabs = [
    {
      // title: <Trans i18nKey="admin:settings.tabs.color" />,
      title: 'General',
      path: 'general',
      content: <div>General</div>,
    },
    {
      // title: <Trans i18nKey="admin:settings.tabs.color" />,
      title: 'Header',
      path: 'header',
      content: <div>Header</div>,
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
      <Heading size="md" mb="4">
        Design Options
      </Heading>

      <TablyRouter tabs={tabs} />
    </Box>
  );
}
