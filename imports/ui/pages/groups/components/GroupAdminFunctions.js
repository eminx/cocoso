import React, { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AddDocument from './admin/AddDocument';
import AddMeeting from './admin/AddMeeting';
import ManageMembers from './admin/ManageMembers';
import AdminFunctions from '../../../entry/AdminFunctions';
import { GroupContext } from '../Group';
import DeleteEntryHandler from '../../../entry/DeleteEntryHandler';

export default function GroupAdminFunctions() {
  const [popup, setPopup] = useState('none');
  const { group } = useContext(GroupContext);
  const [, setSearchParams] = useSearchParams();
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');

  const handleSelect = (item) => {
    if (item.kind === 'edit') {
      setSearchParams({ edit: 'true' });
      return;
    } else if (item.kind === 'delete') {
      setSearchParams({ delete: 'true' });
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
    {
      kind: 'edit',
      label: tc('actions.update'),
    },
    {
      kind: 'delete',
      label: tc('actions.remove'),
    },
  ];

  return (
    <>
      <AdminFunctions menuItems={menuItems} onSelect={handleSelect} />

      {popup === 'document' ? <AddDocument onClose={handleClose} /> : null}
      {popup === 'meeting' ? <AddMeeting onClose={handleClose} /> : null}
      {popup === 'members' ? <ManageMembers onClose={handleClose} /> : null}

      <DeleteEntryHandler item={group} context="groups" />
    </>
  );
}
