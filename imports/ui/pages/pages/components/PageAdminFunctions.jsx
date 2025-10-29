import React, { useContext } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import AdminFunctions from '../../../entry/AdminFunctions';
import DeleteEntryHandler from '../../../entry/DeleteEntryHandler';

export default function PageAdminFunctions() {
  const [tc] = useTranslation('common');
  const { currentPage } = useContext(PageContext);
  const [, setSearchParams] = useSearchParams();

  const handleSelect = (item) => {
    if (item.kind === 'create') {
      setSearchParams({ new: 'true' });
    } else if (item.kind === 'edit') {
      setSearchParams({ edit: 'true' });
    } else if (item.kind === 'delete') {
      setSearchParams({ delete: 'true' });
    }
  };

  const menuItems = [
    {
      kind: 'create',
      label: tc('labels.create.info'),
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
      <DeleteEntryHandler item={currentPage} context="info" />
    </>
  );
}
