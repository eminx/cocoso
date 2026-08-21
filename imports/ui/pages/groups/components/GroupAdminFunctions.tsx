import React, { useEffect } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import AdminFunctions from '/imports/ui/entry/AdminFunctions';
import DeleteEntryHandler from '/imports/ui/entry/DeleteEntryHandler';
import DocumentUploader from '/imports/ui/forms/DocumentUploader';

import AddMeeting from './admin/AddMeeting';
import ManageMembers from './admin/ManageMembers';
import InviteManager from '../InviteManager';

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

  const handleSelect = (item: any) => {
    switch (item.kind) {
      case 'add_document':
        setSearchParams({ addDocument: 'true' });
        return;
      case 'add_meeting':
        setSearchParams({ addMeeting: 'true' });
        return;
      case 'members':
        setSearchParams({ members: 'true' });
        return;
      case 'invite':
        setSearchParams({ invite: 'true' });
        return;
      case 'edit':
        setSearchParams({ edit: 'true' });
        return;
      case 'delete':
        setSearchParams({ delete: 'true' });
        return;
    }
  };

  const handleClose = () => {
    setSearchParams({});
  };

  const menuItems = [
    {
      kind: 'add_document',
      label: t('admin.add_document'),
    },
    {
      kind: 'add_meeting',
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

  const addDocument = searchParams.get('addDocument') === 'true';
  const addMeeting = searchParams.get('addMeeting') === 'true';
  const members = searchParams.get('members') === 'true';

  return (
    <>
      <AdminFunctions menuItems={menuItems} onSelect={handleSelect} />

      {addDocument ? (
        <DocumentUploader
          active
          documents={documents}
          itemId={group._id}
          context="groups"
          onClose={handleClose}
        />
      ) : null}

      {addMeeting ? <AddMeeting onClose={handleClose} /> : null}
      {members ? <ManageMembers onClose={handleClose} /> : null}
      {group?.isPrivate ? <InviteManager /> : null}

      <DeleteEntryHandler item={group} context="groups" />
    </>
  );
}
