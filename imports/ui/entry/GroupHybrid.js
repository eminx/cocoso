import React, { useState } from 'react';
import { Box, Code, Flex, Link as CLink, Text, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';

import TablyCentered from '../components/TablyCentered';
import GroupDocuments from '../pages/groups/components/GroupDocuments';
import GroupMembers from '../pages/groups/components/GroupMembers';
import GroupMeetings from '../pages/groups/components/GroupMeetingsAction';
import NiceList from '../components/NiceList';
import { ChatButton } from '../smart/ChatHandler';

export default function GroupHybrid({ currentUser, group, Host }) {
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

  if (group.documents && group.documents.length > 0) {
    tabs.push({
      title: tc('documents.label'),
      content: <GroupDocuments documents={group.documents} />,
      path: 'documents',
    });
  }

  const groupsInMenu = Host.settings?.menu.find((item) => item.name === 'groups');

  return (
    <TablyCentered
      action={
        <Center>
          <Flex align="center" justify="center" maxW="860px" w="100%">
            <Box px="12">
              <GroupMembers group={group} />
            </Box>
            {currentUser ? (
              <Box>
                <ChatButton context="groups" currentUser={currentUser} item={group} />
              </Box>
            ) : null}
          </Flex>
        </Center>
      }
      adminMenu={null}
      backLink={{ value: '/groups', label: groupsInMenu?.label }}
      images={[group.imageUrl]}
      subTitle={group.readingMaterial}
      tabs={tabs}
      title={group.title}
    />
  );
}
