import React, { useEffect } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import AdminFunctions from '/imports/ui/entry/AdminFunctions';
import DeleteEntryHandler from '/imports/ui/entry/DeleteEntryHandler';
import DocumentUploader from '/imports/ui/forms/DocumentUploader';

import AddMeeting from './admin/AddMeeting';
import ManageMembers from './admin/ManageMembers';
import InviteManager from '../InviteManager';
import { MenuOption } from '/imports/ui/generic/Menu';

export default function GroupAdminFunctions() {
  const { group, documents } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');

  useEffect(() => {
    if (group && group.isPrivate) {
      setSearchParams({ invite: 'true' });
    }
  }, []);

  const handleSetSearchParams = (key: string | undefined, value: string) => {
    if (!key) return;
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.set(key, value);
      return next;
    });
  };

  const handleSelect = (item: MenuOption) => {
    handleSetSearchParams(item.kind, 'true');
  };

  const handleClose = () => {
    setSearchParams({});
  };

  const menuItems = [
    {
      kind: 'documents',
      label: tc('documents.manage'),
    },
    {
      kind: 'meeting',
      label: t('admin.add_meeting'),
    },
    {
      kind: 'members',
      label: t('admin.manage_members'),
    },
  ];

  if (group && group.isPrivate) {
    menuItems.push({
      kind: 'invite',
      label: t('actions.invite'),
    });
  }

  menuItems.push({
    kind: 'edit',
    label: tc('actions.update'),
  });

  menuItems.push({
    kind: 'delete',
    label: tc('actions.remove'),
  });

  const addMeeting = searchParams.get('meeting') === 'true';
  const members = searchParams.get('members') === 'true';

  return (
    <>
      <AdminFunctions menuItems={menuItems} onSelect={handleSelect} />

      <DocumentUploader
        context="groups"
        documents={documents}
        itemId={group._id}
      />

      {addMeeting ? <AddMeeting onClose={handleClose} /> : null}
      {members ? <ManageMembers onClose={handleClose} /> : null}
      {group?.isPrivate ? <InviteManager /> : null}

      <DeleteEntryHandler item={group} context="groups" />
    </>
  );
}
