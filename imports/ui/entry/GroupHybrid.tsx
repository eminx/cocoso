import React from 'react';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { Box, Center } from '/imports/ui/core';
import GroupDocuments from '/imports/ui/pages/groups/components/GroupDocuments';
import GroupMembers from '/imports/ui/pages/groups/components/GroupMembers';

import TablyCentered from './TablyCentered';
import ActionDates from './ActionDates';
import { DateOccurrence } from './ActionDates';

interface Document {
  _id: string;
  name?: string;
}

interface Group {
  _id: string;
  title?: string;
  host?: string;
  description?: string;
  readingMaterial?: string;
  imageUrl?: string;
  isPrivate?: boolean;
  meetings?: DateOccurrence[];
}

interface Host {
  settings?: {
    menu?: Array<{
      name: string;
      label?: string;
    }>;
  };
}

export interface GroupHybridProps {
  group: Group;
  documents?: Document[];
  Host: Host;
}

export default function GroupHybrid({ group, documents, Host }: GroupHybridProps) {
  if (!group) {
    return null;
  }

  const tabs = [
    {
      title: <Trans i18nKey="common:labels.info">Info</Trans>,
      content: (
        <Box bg="white" className="text-content" p="6">
          {group?.description &&
            HTMLReactParser(DOMPurify.sanitize(group?.description))}
        </Box>
      ),
      path: `/groups/${group._id}/info`,
      id: 'info',
    },
  ];

  if (documents && documents.length > 0) {
    tabs.push({
      title: <Trans i18nKey="common:documents.label">Documents</Trans>,
      content: <GroupDocuments documents={documents} />,
      path: `/groups/${group._id}/documents`,
      id: 'documents',
    });
  }

  const groupsInMenu = Host.settings?.menu.find(
    (item) => item.name === 'groups'
  );
  const tags = [];
  if (group.isPrivate) {
    tags.push(<Trans i18nKey="common:labels.private">Private</Trans>);
  }

  const url = `https://${group.host}/groups/${group._id}`;

  const groupDatesParsed = {
    ...group,
    datesAndTimes: group.meetings,
  };

  return (
    <TablyCentered
      dates={<ActionDates activity={groupDatesParsed} />}
      action={<GroupMembers group={group} />}
      backLink={{ value: '/groups', label: groupsInMenu?.label }}
      images={[group.imageUrl]}
      subTitle={group.readingMaterial}
      tabs={tabs}
      tags={tags}
      title={group.title}
      url={url}
    />
  );
}
