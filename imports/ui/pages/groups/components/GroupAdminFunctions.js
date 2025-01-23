import React from 'react';
import { useTranslation } from 'react-i18next';

import AddDocument from './admin/AddDocument';
import AddMeeting from './admin/AddMeeting';
import ManageMembers from './admin/ManageMembers';
import AdminFunctions from '../../../entry/AdminFunctions';

export default function GroupAdminFunctions() {
  const [t] = useTranslation('groups');

  const menuItems = (onClose) => [
    {
      kind: 'document',
      label: t('admin.add_document'),
      component: <AddDocument onClose={onClose} />,
    },
    {
      kind: 'meeting',
      label: t('admin.add_meeting'),
      component: <AddMeeting onClose={onClose} />,
    },
    {
      kind: 'members',
      label: t('admin.manage_members'),
      component: <ManageMembers onClose={onClose} />,
    },
  ];

  return <AdminFunctions menuItems={menuItems} />;
}
