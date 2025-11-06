import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import AddDocument from './admin/AddDocument';
import AddMeeting from './admin/AddMeeting';
import ManageMembers from './admin/ManageMembers';
import AdminFunctions from '../../../entry/AdminFunctions';
import { groupAtom } from '../GroupItemHandler';
import DeleteEntryHandler from '../../../entry/DeleteEntryHandler';
import InviteManager from '../InviteManager';

export default function GroupAdminFunctions() {
  const [popup, setPopup] = useState('none');
  const group = useAtomValue(groupAtom);
  const [, setSearchParams] = useSearchParams();
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');

  useEffect(() => {
    if (group.isPrivate) {
      setSearchParams({ invite: 'true' });
    }
  }, []);

  const handleSelect = (item) => {
    if (item.kind === 'edit') {
      setSearchParams({ edit: 'true' });
      return;
    } else if (item.kind === 'delete') {
      setSearchParams({ delete: 'true' });
      return;
    } else if (item.kind === 'invite') {
      setSearchParams({ invite: 'true' });
      return;
    }
    setPopup(item.kind);
  };

  const handleClose = () => {
    setPopup('none');
  };

  const menuItems = [
    {
      kind: 'document',
      label: t('admin.add_document'),
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

  if (group.isPrivate) {
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

  return (
    <>
      <AdminFunctions menuItems={menuItems} onSelect={handleSelect} />

      {popup === 'document' ? <AddDocument onClose={handleClose} /> : null}
      {popup === 'meeting' ? <AddMeeting onClose={handleClose} /> : null}
      {popup === 'members' ? <ManageMembers onClose={handleClose} /> : null}

      {group.isPrivate ? <InviteManager /> : null}
      <DeleteEntryHandler item={group} context="groups" />
    </>
  );
}
