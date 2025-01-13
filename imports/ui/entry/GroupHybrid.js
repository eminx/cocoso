import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';

import TablyCentered from '../components/TablyCentered';

export default function GroupHybrid({ group, Host }) {
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');

  if (!group) {
    return null;
  }

  const tabs = [
    {
      title: tc('labels.info'),
      content: (
        <Box bg="white" className="text-content" p="6">
          {group?.description && parseHtml(group?.description)}
        </Box>
      ),
      path: 'info',
    },
  ];

  const groupsInMenu = Host.settings?.menu.find((item) => item.name === 'groups');

  return (
    <TablyCentered
      action={null}
      adminMenu={null}
      backLink={{ value: '/groups', label: groupsInMenu?.label }}
      images={[group.imageUrl]}
      subTitle={group.readingMaterial}
      tabs={tabs}
      title={group.title}
    />
  );
}
