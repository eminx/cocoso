import React from 'react';
import { Box, Center } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import parseHtml from 'html-react-parser';

import TablyCentered from './TablyCentered';
import GroupDocuments from '../pages/groups/components/GroupDocuments';
import GroupMembers from '../pages/groups/components/GroupMembers';

export default function GroupHybrid({ group, Host }) {
  if (!group) {
    return null;
  }

  const tabs = [
    {
      title: <Trans i18nKey="common:labels.info">Info</Trans>,
      content: (
        <Box bg="white" className="text-content" p="6">
          {group?.description && parseHtml(group?.description)}
        </Box>
      ),
      path: 'info',
      id: 'info',
    },
  ];

  if (group.documents && group.documents.length > 0) {
    tabs.push({
      title: <Trans i18nKey="common:documents.label">Documents</Trans>,
      content: <GroupDocuments documents={group.documents} />,
      path: 'documents',
      id: 'documents',
    });
  }

  const groupsInMenu = Host.settings?.menu.find((item) => item.name === 'groups');
  const tags = [];
  if (group.isPrivate) {
    tags.push(<Trans i18nKey="common:labels.private">Private</Trans>);
  }

  return (
    <TablyCentered
      action={
        <Center>
          <GroupMembers group={group} />
        </Center>
      }
      adminMenu={null}
      backLink={{ value: '/groups', label: groupsInMenu?.label }}
      images={[group.imageUrl]}
      subTitle={group.readingMaterial}
      tabs={tabs}
      tags={tags}
      title={group.title}
    />
  );
}
