import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

import AdminFunctions from '../../../entry/AdminFunctions';
import { WorkContext } from '../Work';
import DeleteEntryHandler from '../../../entry/DeleteEntryHandler';

export default function WorkAdminFunctions() {
  const [tc] = useTranslation('common');
  const { work } = useContext(WorkContext);
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
      <DeleteEntryHandler item={work} context="works" />
    </>
  );
}
