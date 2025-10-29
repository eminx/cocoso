import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

import AdminFunctions from '../../../entry/AdminFunctions';
import { ResourceContext } from '../ResourceItemHandler';
import DeleteEntryHandler from '../../../entry/DeleteEntryHandler';

export default function ResourceAdminFunctions() {
  const [tc] = useTranslation('common');
  const { resource } = useContext(ResourceContext);
  const [, setSearchParams] = useSearchParams();

  const handleSelect = (item) => {
    if (item.kind === 'edit') {
      setSearchParams({ edit: 'true' });
    } else if (item.kind === 'delete') {
      setSearchParams({ delete: 'true' });
    }
  };

  const menuItems = [
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
      <DeleteEntryHandler item={resource} context="resources" />
    </>
  );
}
