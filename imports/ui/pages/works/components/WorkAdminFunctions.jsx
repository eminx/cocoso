import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';

import AdminFunctions from '../../../entry/AdminFunctions';
import { workAtom } from '../WorkItemHandler';
import DeleteEntryHandler from '../../../entry/DeleteEntryHandler';

export default function WorkAdminFunctions() {
  const [tc] = useTranslation('common');
  const work = useAtomValue(workAtom);
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
