import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';

import { activityAtom } from '/imports/ssr/components';

import AdminFunctions from '../../../entry/AdminFunctions';
import DeleteEntryHandler from '../../../entry/DeleteEntryHandler';

export default function ActivityAdminFunctions() {
  const [tc] = useTranslation('common');
  const activity = useAtomValue(activityAtom);
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
      <DeleteEntryHandler item={activity} context="activities" />
    </>
  );
}
