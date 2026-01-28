import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';

import AdminFunctions from '/imports/ui/entry/AdminFunctions';
import DeleteEntryHandler from '/imports/ui/entry/DeleteEntryHandler';

import { resourceAtom } from '../ResourceItemHandler';

export default function ResourceAdminFunctions() {
  const [tc] = useTranslation('common');
  const resource = useAtomValue(resourceAtom);
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
